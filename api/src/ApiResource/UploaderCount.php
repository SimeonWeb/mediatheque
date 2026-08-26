<?php

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use App\State\UploaderCountProvider;
use Symfony\Component\Serializer\Attribute\Groups;

#[ApiResource(
    shortName: 'UploaderSummary',
    operations: [
        new GetCollection(
            uriTemplate: '/uploaders',
            provider: UploaderCountProvider::class,
            paginationEnabled: false,
            normalizationContext: ['groups' => ['uploader_summary:read']],
        ),
    ],
)]
final readonly class UploaderCount
{
    public function __construct(
        #[ApiProperty(identifier: false)]
        #[Groups(['uploader_summary:read'])]
        public string $id,
        #[Groups(['uploader_summary:read'])]
        public string $name,
        #[Groups(['uploader_summary:read'])]
        public string $slug,
        #[Groups(['uploader_summary:read'])]
        public int $total,
    ) {
    }
}
