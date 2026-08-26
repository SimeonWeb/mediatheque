<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\ApiResource\MediaTypeCount;
use App\Enum\MediaType;
use App\Repository\MediaFileRepository;

/**
 * @implements ProviderInterface<MediaTypeCount>
 */
final readonly class MediaTypeCountProvider implements ProviderInterface
{
    public function __construct(private MediaFileRepository $mediaFileRepository)
    {
    }

    /**
     * @return list<MediaTypeCount>
     */
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): array
    {
        $counts = $this->mediaFileRepository->countByType();

        return array_map(
            static fn (MediaType $type): MediaTypeCount => new MediaTypeCount(
                $type->value,
                $counts[$type->value] ?? 0,
            ),
            MediaType::cases(),
        );
    }
}
