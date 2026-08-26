<?php

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use App\State\MediaTypeCountProvider;
use Symfony\Component\Serializer\Attribute\Groups;

#[ApiResource(
    shortName: 'MediaType',
    operations: [
        new GetCollection(
            uriTemplate: '/media_types',
            provider: MediaTypeCountProvider::class,
            paginationEnabled: false,
            normalizationContext: ['groups' => ['media_type:read']],
        ),
    ],
)]
final readonly class MediaTypeCount
{
    public function __construct(
        #[Groups(['media_type:read'])]
        public string $type,
        #[Groups(['media_type:read'])]
        public int $total,
    ) {
    }
}
