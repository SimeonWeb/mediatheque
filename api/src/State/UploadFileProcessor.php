<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\MediaFile;
use App\Enum\MediaType;
use App\Repository\UploaderRepository;
use App\Service\FileCreationDateExtractor;
use App\Service\ImageVariantGenerator;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\UnsupportedMediaTypeHttpException;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;
use Symfony\Component\Uid\Uuid;

/**
 * @implements ProcessorInterface<mixed, MediaFile>
 */
final readonly class UploadFileProcessor implements ProcessorInterface
{
    private const int MAX_FILE_SIZE = 10 * 1024 * 1024;

    private const array ALLOWED_MIME_TYPES = [
        'application/pdf',
        'application/json',
        'image/gif',
        'image/jpeg',
        'image/png',
        'image/webp',
        'text/plain',
        'audio/mpeg',
        'audio/mp4',
        'audio/ogg',
        'audio/wav',
        'audio/x-wav',
        'video/mp4',
        'video/ogg',
        'video/webm',
    ];

    public function __construct(
        #[Autowire('%app.upload_dir%')]
        private string $uploadDir,
        #[Autowire('%env(int:THUMB_SIZE)%')]
        private int $thumbnailSize,
        #[Autowire('%env(int:MEDIUM_SIZE)%')]
        private int $mediumSize,
        #[Autowire('%env(int:FULL_SIZE)%')]
        private int $fullSize,
        private EntityManagerInterface $entityManager,
        private Filesystem $filesystem,
        private UploaderRepository $uploaderRepository,
        private FileCreationDateExtractor $fileCreationDateExtractor,
        private ImageVariantGenerator $imageVariantGenerator,
    ) {
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): MediaFile
    {
        $request = $context['request'] ?? null;
        if (!$request instanceof Request) {
            throw new \LogicException('La requête HTTP est indisponible.');
        }

        $uploaderId = $request->request->get('uploader_id');
        if (!is_string($uploaderId) || '' === trim($uploaderId) || !Uuid::isValid($uploaderId)) {
            throw new BadRequestHttpException('Le champ "uploader_id" doit contenir un UUID valide.');
        }

        $uploader = $this->uploaderRepository->find(Uuid::fromString($uploaderId));
        if (null === $uploader) {
            throw new NotFoundHttpException('L’uploader demandé n’existe pas.');
        }

        $uploadedFile = $request->files->get('file');
        if (!$uploadedFile instanceof UploadedFile) {
            throw new BadRequestHttpException('Le champ "file" est obligatoire.');
        }

        if (!$uploadedFile->isValid()) {
            throw new BadRequestHttpException('Le fichier n’a pas pu être envoyé.');
        }

        $size = $uploadedFile->getSize();
        if (false === $size || $size > self::MAX_FILE_SIZE) {
            throw new HttpException(Response::HTTP_CONTENT_TOO_LARGE, 'Le fichier ne doit pas dépasser 10 Mo.');
        }

        $mimeType = $uploadedFile->getMimeType() ?? 'application/octet-stream';
        if (!in_array($mimeType, self::ALLOWED_MIME_TYPES, true)) {
            throw new UnsupportedMediaTypeHttpException(sprintf('Le type de fichier "%s" n’est pas autorisé.', $mimeType));
        }

        $originalName = pathinfo($uploadedFile->getClientOriginalName(), PATHINFO_FILENAME);
        if ('' === trim($originalName)) {
            throw new UnprocessableEntityHttpException('Le nom du fichier est invalide.');
        }

        if (mb_strlen($originalName) > 255) {
            throw new UnprocessableEntityHttpException('Le nom du fichier est trop long.');
        }

        $uploadedAt = new \DateTimeImmutable();
        $createdAt = $this->fileCreationDateExtractor->extract(
            $uploadedFile->getPathname(),
            $mimeType,
            $uploadedAt,
        ) ?? $uploadedAt;
        $directory = $uploadedAt->format('Y/m');
        $extension = $uploadedFile->guessExtension();
        $storageName = Uuid::v7()->toRfc4122().($extension ? '.'.$extension : '');
        $relativePath = $directory.'/'.$storageName;
        $targetDirectory = rtrim($this->uploadDir, DIRECTORY_SEPARATOR).DIRECTORY_SEPARATOR.$directory;
        $absolutePath = $targetDirectory.DIRECTORY_SEPARATOR.$storageName;

        try {
            $this->filesystem->mkdir($targetDirectory);
            $uploadedFile->move($targetDirectory, $storageName);
        } catch (\Throwable $exception) {
            throw new HttpException(Response::HTTP_INTERNAL_SERVER_ERROR, 'Le fichier n’a pas pu être enregistré.', $exception);
        }

        $thumbnailRelativePath = null;
        $thumbnailAbsolutePath = null;
        $fullRelativePath = null;
        $fullAbsolutePath = null;
        $mediumRelativePath = null;
        $mediumAbsolutePath = null;

        if (str_starts_with($mimeType, 'image/')) {
            $baseName = pathinfo($storageName, PATHINFO_FILENAME);
            $thumbnailName = sprintf(
                '%s-%d.jpg',
                $baseName,
                max(1, $this->thumbnailSize),
            );
            $thumbnailRelativePath = $directory.'/'.$thumbnailName;
            $thumbnailAbsolutePath = $targetDirectory.DIRECTORY_SEPARATOR.$thumbnailName;
            $fullName = sprintf('%s-%d.jpg', $baseName, max(1, $this->fullSize));
            $fullRelativePath = $directory.'/'.$fullName;
            $fullAbsolutePath = $targetDirectory.DIRECTORY_SEPARATOR.$fullName;
            $mediumName = sprintf('%s-%d.jpg', $baseName, max(1, $this->mediumSize));
            $mediumRelativePath = $directory.'/'.$mediumName;
            $mediumAbsolutePath = $targetDirectory.DIRECTORY_SEPARATOR.$mediumName;

            try {
                $this->imageVariantGenerator->generate($absolutePath, $thumbnailAbsolutePath, $this->thumbnailSize);
                $this->imageVariantGenerator->generate($absolutePath, $mediumAbsolutePath, $this->mediumSize);
                $this->imageVariantGenerator->generate($absolutePath, $fullAbsolutePath, $this->fullSize);
            } catch (\Throwable $exception) {
                $this->filesystem->remove([$absolutePath, $thumbnailAbsolutePath, $mediumAbsolutePath, $fullAbsolutePath]);

                throw new UnprocessableEntityHttpException('Les variantes de l’image n’ont pas pu être générées.', $exception);
            }
        }

        $mediaFile = new MediaFile(
            $originalName,
            $storageName,
            $relativePath,
            $mimeType,
            MediaType::fromMimeType($mimeType),
            $extension,
            $size,
            $uploader,
            $thumbnailRelativePath,
            $fullRelativePath,
            $mediumRelativePath,
            $createdAt,
            $uploadedAt,
        );

        try {
            $this->entityManager->persist($mediaFile);
            $this->entityManager->flush();
        } catch (\Throwable $exception) {
            $this->filesystem->remove(array_filter([$absolutePath, $thumbnailAbsolutePath, $mediumAbsolutePath, $fullAbsolutePath]));

            throw new HttpException(Response::HTTP_INTERNAL_SERVER_ERROR, 'Les métadonnées n’ont pas pu être enregistrées.', $exception);
        }

        return $mediaFile;
    }
}
