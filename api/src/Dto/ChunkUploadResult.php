<?php

namespace App\Dto;

final readonly class ChunkUploadResult
{
    public function __construct(
        public string $uploadId,
        public int $receivedBytes,
        public int $totalBytes,
        public string $originalName,
        public ?string $assembledPath = null,
    ) {
    }

    public function isComplete(): bool
    {
        return null !== $this->assembledPath;
    }
}
