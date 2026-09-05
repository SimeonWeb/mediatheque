<?php

namespace App\Command;

use App\Entity\MediaFile;
use App\Enum\MediaType;
use App\Repository\MediaFileRepository;
use App\Repository\UploaderRepository;
use Doctrine\ORM\EntityManagerInterface;
use DOMDocument;
use DOMXPath;
use RuntimeException;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Throwable;

#[AsCommand(
    name: 'app:scrape-apple-playlist',
    description: 'Extrait une playlist Apple Music dans un fichier JSON et télécharge ses artworks.',
)]
final class ScrapeApplePlaylistCommand extends Command
{
    private const int ARTWORK_SIZE = 300;

    public function __construct(
        private readonly HttpClientInterface $httpClient,
        private readonly EntityManagerInterface $entityManager,
        private readonly MediaFileRepository $mediaFileRepository,
        private readonly UploaderRepository $uploaderRepository,
        #[Autowire('%kernel.project_dir%')]
        private readonly string $projectDirectory,
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->addArgument('url', InputArgument::REQUIRED, 'URL publique de la playlist Apple Music')
            ->addOption('uploader', null, InputOption::VALUE_REQUIRED, 'Slug de l’uploader associé', null);
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $url = (string) $input->getArgument('url');
        $uploaderSlug = trim((string) $input->getOption('uploader'));
        $filesystem = new Filesystem();
        $temporaryDirectory = null;

        try {
            $this->assertAppleMusicUrl($url);

            if ('' === $uploaderSlug) {
                throw new RuntimeException('L’option --uploader est obligatoire.');
            }

            $uploader = $this->uploaderRepository->findOneBy(['slug' => $uploaderSlug]);
            if (null === $uploader) {
                throw new RuntimeException(sprintf('L’uploader "%s" n’existe pas.', $uploaderSlug));
            }

            $playlist = $this->extractPlaylist($this->downloadPage($url));
            $slug = $this->slugify($playlist['title']);
            $baseDirectory = $this->projectDirectory.'/var/uploads/apple-playlists';
            $destinationDirectory = $baseDirectory.'/'.$slug;
            $temporaryDirectory = $baseDirectory.'/.'.$slug.'-'.bin2hex(random_bytes(6));
            $artworkDirectory = $temporaryDirectory.'/artworks';

            $filesystem->mkdir($artworkDirectory);

            $items = [];
            $downloadedArtworkPaths = [];
            foreach ($playlist['items'] as $index => $item) {
                $artworkFilename = $item['id'].'.jpg';
                $artworkRelativePath = 'artworks/'.$artworkFilename;
                $downloadedArtworkPath = $artworkDirectory.'/'.$artworkFilename;

                $this->downloadArtwork($item['artworkUrl'], $downloadedArtworkPath);
                $downloadedArtworkPaths[] = $downloadedArtworkPath;
                $items[] = [
                    'artwork' => $artworkRelativePath,
                    'title' => $item['title'],
                    'artist' => $item['artist'],
                    'album' => $item['album'],
                    'duration' => $item['duration'],
                ];

                $output->writeln(sprintf('Artwork %d/%d téléchargé.', $index + 1, count($playlist['items'])));
            }

            $this->createPlaylistArtwork($downloadedArtworkPaths, $temporaryDirectory.'/artwork.jpg');

            $json = json_encode([
                'title' => $playlist['title'],
                'artwork' => 'artwork.jpg',
                'source' => $url,
                'items' => $items,
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);

            $filesystem->dumpFile($temporaryDirectory.'/playlist.json', $json."\n");
            $jsonSize = filesize($temporaryDirectory.'/playlist.json');
            if (false === $jsonSize) {
                throw new RuntimeException('Impossible de déterminer la taille du fichier JSON.');
            }

            $filesystem->remove($destinationDirectory);
            $filesystem->rename($temporaryDirectory, $destinationDirectory);
            $temporaryDirectory = null;

            $storageName = $playlist['id'].'.json';
            $relativePath = 'apple-playlists/'.$slug.'/playlist.json';
            $playlistArtworkRelativePath = 'apple-playlists/'.$slug.'/artwork.jpg';
            $uploadedAt = new \DateTimeImmutable();
            $mediaFile = $this->mediaFileRepository->findOneBy(['storageName' => $storageName]);

            if (null === $mediaFile) {
                $mediaFile = new MediaFile(
                    $playlist['title'],
                    $storageName,
                    $relativePath,
                    'application/json',
                    MediaType::Audio,
                    'json',
                    $jsonSize,
                    $uploader,
                    thumbnailRelativePath: $playlistArtworkRelativePath,
                    uploadedAt: $uploadedAt,
                );
                $this->entityManager->persist($mediaFile);
                $databaseAction = 'créé';
            } else {
                $mediaFile->refreshStoredFile(
                    $playlist['title'],
                    $relativePath,
                    'application/json',
                    MediaType::Audio,
                    'json',
                    $jsonSize,
                    $uploader,
                    thumbnailRelativePath: $playlistArtworkRelativePath,
                    uploadedAt: $uploadedAt,
                );
                $databaseAction = 'mis à jour';
            }

            $this->entityManager->flush();

            $output->writeln(sprintf(
                '<info>%d morceau(x) exporté(s) dans %s ; MediaFile %s (%s).</info>',
                count($items),
                $destinationDirectory,
                $databaseAction,
                $mediaFile->getId()->toRfc4122(),
            ));

            return Command::SUCCESS;
        } catch (Throwable $exception) {
            if (null !== $temporaryDirectory) {
                $filesystem->remove($temporaryDirectory);
            }

            $output->writeln('<error>'.$exception->getMessage().'</error>');

            return Command::FAILURE;
        }
    }

    private function assertAppleMusicUrl(string $url): void
    {
        $parts = parse_url($url);

        if (
            false === $parts
            || 'https' !== ($parts['scheme'] ?? null)
            || 'music.apple.com' !== ($parts['host'] ?? null)
        ) {
            throw new RuntimeException('L’URL doit être une URL HTTPS du domaine music.apple.com.');
        }
    }

    private function downloadPage(string $url): string
    {
        $response = $this->httpClient->request('GET', $url, [
            'headers' => [
                'Accept' => 'text/html,application/xhtml+xml',
                'Accept-Language' => 'fr-FR,fr;q=0.9',
                'User-Agent' => 'Mozilla/5.0 (compatible; MediathequeApplePlaylistScraper/1.0)',
            ],
            'max_redirects' => 5,
            'timeout' => 30,
        ]);

        if (200 !== $response->getStatusCode()) {
            throw new RuntimeException(sprintf('Apple Music a retourné le statut HTTP %d.', $response->getStatusCode()));
        }

        return $response->getContent();
    }

    /**
     * @return array{
     *     id: string,
     *     title: string,
     *     items: list<array{id: string, title: string, artist: string, album: string, duration: int, artworkUrl: string}>
     * }
     */
    private function extractPlaylist(string $html): array
    {
        $document = new DOMDocument();
        $previousUseInternalErrors = libxml_use_internal_errors(true);

        try {
            if (!$document->loadHTML($html, LIBXML_NONET | LIBXML_NOERROR | LIBXML_NOWARNING)) {
                throw new RuntimeException('La page Apple Music n’a pas pu être analysée.');
            }
        } finally {
            libxml_clear_errors();
            libxml_use_internal_errors($previousUseInternalErrors);
        }

        $script = (new DOMXPath($document))->query('//script[@id="serialized-server-data"]')?->item(0);
        if (null === $script) {
            throw new RuntimeException('Les données de la playlist sont absentes de la page Apple Music.');
        }

        $payload = json_decode($script->textContent, true, 512, JSON_THROW_ON_ERROR);
        $sections = $payload['data'][0]['data']['sections'] ?? null;
        if (!is_array($sections)) {
            throw new RuntimeException('Le format des données Apple Music n’est pas reconnu.');
        }

        $playlistId = null;
        $title = null;
        $tracks = null;

        foreach ($sections as $section) {
            if ('containerDetailHeaderLockup' === ($section['itemKind'] ?? null)) {
                $title = $section['items'][0]['title'] ?? null;
                $playlistId = $section['items'][0]['contentDescriptor']['identifiers']['storeAdamID'] ?? null;
            }

            if ('trackLockup' === ($section['itemKind'] ?? null)) {
                $tracks = $section['items'] ?? null;
            }
        }

        if (
            !is_string($playlistId)
            || '' === trim($playlistId)
            || !is_string($title)
            || '' === trim($title)
            || !is_array($tracks)
        ) {
            throw new RuntimeException('La page ne contient pas une playlist Apple Music exploitable.');
        }

        $items = [];
        foreach ($tracks as $track) {
            $id = $track['contentDescriptor']['identifiers']['storeAdamID'] ?? null;
            $trackTitle = $track['title'] ?? null;
            $artist = $track['artistName'] ?? $track['subtitleLinks'][0]['title'] ?? null;
            $album = $track['tertiaryLinks'][0]['title'] ?? null;
            $duration = $track['duration'] ?? null;
            $artworkTemplate = $track['artwork']['dictionary']['url'] ?? null;

            if (
                !is_string($id)
                || !is_string($trackTitle)
                || !is_string($artist)
                || !is_string($album)
                || !is_int($duration)
                || !is_string($artworkTemplate)
            ) {
                throw new RuntimeException('Un morceau contient des données incomplètes ou non reconnues.');
            }

            $items[] = [
                'id' => $id,
                'title' => $trackTitle,
                'artist' => $artist,
                'album' => $album,
                'duration' => $duration,
                'artworkUrl' => strtr($artworkTemplate, [
                    '{w}' => (string) self::ARTWORK_SIZE,
                    '{h}' => (string) self::ARTWORK_SIZE,
                    '{f}' => 'jpg',
                ]),
            ];
        }

        return ['id' => $playlistId, 'title' => $title, 'items' => $items];
    }

    private function downloadArtwork(string $url, string $destination): void
    {
        $response = $this->httpClient->request('GET', $url, ['timeout' => 30]);

        if (200 !== $response->getStatusCode()) {
            throw new RuntimeException(sprintf('Impossible de télécharger un artwork (HTTP %d).', $response->getStatusCode()));
        }

        $contentType = $response->getHeaders(false)['content-type'][0] ?? '';
        if (!str_starts_with($contentType, 'image/')) {
            throw new RuntimeException('Apple Music n’a pas retourné une image pour un artwork.');
        }

        (new Filesystem())->dumpFile($destination, $response->getContent());
    }

    /**
     * @param non-empty-list<string> $artworkPaths
     */
    private function createPlaylistArtwork(array $artworkPaths, string $destination): void
    {
        if ([] === $artworkPaths) {
            throw new RuntimeException('La playlist ne contient aucun artwork utilisable.');
        }

        $availableArtworkPaths = array_values(array_unique($artworkPaths));
        shuffle($availableArtworkPaths);
        $selectedArtworkPaths = array_slice($availableArtworkPaths, 0, 9);

        while (count($selectedArtworkPaths) < 9) {
            $lastArtworkPath = $selectedArtworkPaths[array_key_last($selectedArtworkPaths)] ?? null;
            $candidates = array_values(array_filter(
                $availableArtworkPaths,
                static fn (string $artworkPath): bool => $artworkPath !== $lastArtworkPath,
            ));

            if ([] === $candidates) {
                $candidates = $availableArtworkPaths;
            }

            $selectedArtworkPaths[] = $candidates[array_rand($candidates)];
        }

        $grid = imagecreatetruecolor(self::ARTWORK_SIZE, self::ARTWORK_SIZE);
        if (false === $grid) {
            throw new RuntimeException('Impossible de préparer l’artwork de la playlist.');
        }

        $cellSize = intdiv(self::ARTWORK_SIZE, 3);

        foreach ($selectedArtworkPaths as $index => $artworkPath) {
            $content = file_get_contents($artworkPath);
            $source = false === $content ? false : imagecreatefromstring($content);

            if (false === $source) {
                throw new RuntimeException(sprintf('L’artwork "%s" ne peut pas être utilisé.', basename($artworkPath)));
            }

            $sourceWidth = imagesx($source);
            $sourceHeight = imagesy($source);
            $cropSize = min($sourceWidth, $sourceHeight);
            $column = $index % 3;
            $row = intdiv($index, 3);

            if (!imagecopyresampled(
                $grid,
                $source,
                $column * $cellSize,
                $row * $cellSize,
                intdiv($sourceWidth - $cropSize, 2),
                intdiv($sourceHeight - $cropSize, 2),
                $cellSize,
                $cellSize,
                $cropSize,
                $cropSize,
            )) {
                throw new RuntimeException('Une cellule de l’artwork n’a pas pu être générée.');
            }
        }

        if (!imagejpeg($grid, $destination, 90)) {
            throw new RuntimeException('L’artwork de la playlist n’a pas pu être enregistré.');
        }
    }

    private function slugify(string $value): string
    {
        $ascii = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $value);
        $slug = strtolower(false === $ascii ? $value : $ascii);
        $slug = preg_replace('/[^a-z0-9]+/', '-', $slug) ?? '';
        $slug = trim($slug, '-');

        if ('' === $slug) {
            throw new RuntimeException('Le titre de la playlist ne permet pas de créer un nom de dossier.');
        }

        return $slug;
    }
}
