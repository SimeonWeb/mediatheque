<?php

namespace App\Service;

use App\Dto\ChunkUploadResult;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;
use Symfony\Component\HttpKernel\Exception\HttpException;

final readonly class ChunkUploadManager
{
    public function __construct(
        #[Autowire('%app.upload_chunk_dir%')]
        private string $chunkDirectory,
        #[Autowire('%env(int:MAX_FILE_SIZE)%')]
        private int $maxFileSize,
        #[Autowire('%env(int:UPLOAD_CHUNK_TTL)%')]
        private int $chunkTtl,
        private Filesystem $filesystem,
    ) {
    }

    public function receive(
        UploadedFile $uploadedFile,
        string $uploadId,
        string $uploaderId,
        string $contentRange,
    ): ChunkUploadResult {
        if (1 !== preg_match('/^[A-Za-z0-9._-]{1,128}$/', $uploadId)) {
            throw new BadRequestHttpException('Le champ "upload_id" est invalide.');
        }

        if (1 !== preg_match('/^bytes (\d+)-(\d+)\/(\d+)$/', trim($contentRange), $matches)) {
            throw new BadRequestHttpException('Le header "Content-Range" est invalide.');
        }

        $start = (int) $matches[1];
        $end = (int) $matches[2];
        $total = (int) $matches[3];
        $chunkSize = $uploadedFile->getSize();

        if ($total < 1 || $total > $this->maxFileSize) {
            throw new HttpException(
                Response::HTTP_CONTENT_TOO_LARGE,
                sprintf('Le fichier ne doit pas dépasser %s.', $this->formatBytes($this->maxFileSize)),
            );
        }

        if ($start < 0 || $end < $start || $end >= $total || false === $chunkSize || $chunkSize !== $end - $start + 1) {
            throw new BadRequestHttpException('La plage du chunk ne correspond pas au fichier reçu.');
        }

        $this->cleanupExpiredUploads();
        $this->filesystem->mkdir($this->chunkDirectory);

        $sessionDirectory = $this->getSessionDirectory($uploadId);
        $this->filesystem->mkdir($sessionDirectory);
        $lock = fopen($sessionDirectory.'/upload.lock', 'c+');

        if (false === $lock || !flock($lock, LOCK_EX)) {
            if (is_resource($lock)) {
                fclose($lock);
            }

            throw new HttpException(Response::HTTP_INTERNAL_SERVER_ERROR, 'Le chunk ne peut pas être verrouillé.');
        }

        try {
            $manifestPath = $sessionDirectory.'/manifest.json';
            $manifest = $this->readOrCreateManifest(
                $manifestPath,
                $uploadId,
                $uploaderId,
                $uploadedFile->getClientOriginalName(),
                $total,
            );

            $this->validateManifest(
                $manifest,
                $uploadId,
                $uploaderId,
                $uploadedFile->getClientOriginalName(),
                $total,
            );

            $partName = sprintf('%020d-%020d.part', $start, $end);
            $partPath = $sessionDirectory.'/'.$partName;

            if (is_file($partPath)) {
                if (filesize($partPath) !== $chunkSize) {
                    throw new ConflictHttpException('Un chunk différent existe déjà pour cette plage.');
                }
            } else {
                $uploadedFile->move($sessionDirectory, $partName);
            }

            $manifest['updatedAt'] = time();
            $this->writeManifest($manifestPath, $manifest);
            touch($sessionDirectory);

            [$parts, $receivedBytes, $complete] = $this->inspectParts($sessionDirectory, $total);
            $assembledPath = $complete
                ? $this->assemble($sessionDirectory, $parts, $total)
                : null;

            return new ChunkUploadResult(
                $uploadId,
                $receivedBytes,
                $total,
                $manifest['originalName'],
                $assembledPath,
            );
        } catch (HttpException $exception) {
            throw $exception;
        } catch (\Throwable $exception) {
            throw new HttpException(
                Response::HTTP_INTERNAL_SERVER_ERROR,
                'Le chunk n’a pas pu être enregistré.',
                $exception,
            );
        } finally {
            flock($lock, LOCK_UN);
            fclose($lock);
        }
    }

    public function discard(string $uploadId): void
    {
        $this->filesystem->remove($this->getSessionDirectory($uploadId));
    }

    /**
     * @return array{uploadId: string, uploaderId: string, originalName: string, totalBytes: int, createdAt: int, updatedAt: int}
     */
    private function readOrCreateManifest(
        string $manifestPath,
        string $uploadId,
        string $uploaderId,
        string $originalName,
        int $total,
    ): array {
        if (is_file($manifestPath)) {
            $contents = file_get_contents($manifestPath);
            $manifest = false === $contents ? null : json_decode($contents, true, flags: JSON_THROW_ON_ERROR);

            if (!is_array($manifest)) {
                throw new ConflictHttpException('La session d’upload est invalide.');
            }

            return $manifest;
        }

        $manifest = [
            'uploadId' => $uploadId,
            'uploaderId' => $uploaderId,
            'originalName' => $originalName,
            'totalBytes' => $total,
            'createdAt' => time(),
            'updatedAt' => time(),
        ];
        $this->writeManifest($manifestPath, $manifest);

        return $manifest;
    }

    /**
     * @param array<string, mixed> $manifest
     */
    private function validateManifest(
        array $manifest,
        string $uploadId,
        string $uploaderId,
        string $originalName,
        int $total,
    ): void {
        if (
            ($manifest['uploadId'] ?? null) !== $uploadId
            || ($manifest['uploaderId'] ?? null) !== $uploaderId
            || ($manifest['originalName'] ?? null) !== $originalName
            || ($manifest['totalBytes'] ?? null) !== $total
        ) {
            throw new ConflictHttpException('Les informations de la session d’upload ne correspondent pas.');
        }
    }

    /**
     * @param array<string, mixed> $manifest
     */
    private function writeManifest(string $manifestPath, array $manifest): void
    {
        $temporaryPath = $manifestPath.'.tmp';
        $contents = json_encode($manifest, JSON_THROW_ON_ERROR | JSON_PRETTY_PRINT);

        if (false === file_put_contents($temporaryPath, $contents, LOCK_EX)) {
            throw new \RuntimeException('Le manifeste ne peut pas être écrit.');
        }

        $this->filesystem->rename($temporaryPath, $manifestPath, true);
    }

    /**
     * @return array{list<array{start: int, end: int, path: string}>, int, bool}
     */
    private function inspectParts(string $sessionDirectory, int $total): array
    {
        $parts = [];

        foreach (glob($sessionDirectory.'/*.part') ?: [] as $partPath) {
            if (1 !== preg_match('/^(\d+)-(\d+)\.part$/', basename($partPath), $matches)) {
                continue;
            }

            $parts[] = [
                'start' => (int) $matches[1],
                'end' => (int) $matches[2],
                'path' => $partPath,
            ];
        }

        usort($parts, static fn (array $left, array $right): int => $left['start'] <=> $right['start']);

        $expectedStart = 0;
        $receivedBytes = 0;
        foreach ($parts as $part) {
            if ($part['start'] !== $expectedStart) {
                return [$parts, $receivedBytes, false];
            }

            $partSize = filesize($part['path']);
            if (false === $partSize || $partSize !== $part['end'] - $part['start'] + 1) {
                throw new ConflictHttpException('Un chunk enregistré est incomplet.');
            }

            $receivedBytes += $partSize;
            $expectedStart = $part['end'] + 1;
        }

        return [$parts, $receivedBytes, $expectedStart === $total];
    }

    /**
     * @param list<array{start: int, end: int, path: string}> $parts
     */
    private function assemble(string $sessionDirectory, array $parts, int $total): string
    {
        $temporaryPath = $sessionDirectory.'/assembled.tmp';
        $assembledPath = $sessionDirectory.'/assembled.file';
        $output = fopen($temporaryPath, 'wb');

        if (false === $output) {
            throw new \RuntimeException('Le fichier assemblé ne peut pas être créé.');
        }

        try {
            foreach ($parts as $part) {
                $input = fopen($part['path'], 'rb');
                if (false === $input) {
                    throw new \RuntimeException('Un chunk ne peut pas être lu.');
                }

                try {
                    if (false === stream_copy_to_stream($input, $output)) {
                        throw new \RuntimeException('Un chunk ne peut pas être assemblé.');
                    }
                } finally {
                    fclose($input);
                }
            }
        } finally {
            fclose($output);
        }

        if (filesize($temporaryPath) !== $total) {
            $this->filesystem->remove($temporaryPath);

            throw new ConflictHttpException('Le fichier assemblé est incomplet.');
        }

        $this->filesystem->rename($temporaryPath, $assembledPath, true);

        return $assembledPath;
    }

    private function cleanupExpiredUploads(): void
    {
        if (!is_dir($this->chunkDirectory)) {
            return;
        }

        $expiration = time() - max(1, $this->chunkTtl);
        foreach (new \FilesystemIterator($this->chunkDirectory, \FilesystemIterator::SKIP_DOTS) as $directory) {
            if ($directory->isDir() && $directory->getMTime() < $expiration) {
                $this->filesystem->remove($directory->getPathname());
            }
        }
    }

    private function getSessionDirectory(string $uploadId): string
    {
        return rtrim($this->chunkDirectory, DIRECTORY_SEPARATOR).DIRECTORY_SEPARATOR.hash('sha256', $uploadId);
    }

    private function formatBytes(int $bytes): string
    {
        if (0 === $bytes % (1024 * 1024 * 1024)) {
            return ($bytes / (1024 * 1024 * 1024)).' Go';
        }

        return (int) ceil($bytes / (1024 * 1024)).' Mo';
    }
}
