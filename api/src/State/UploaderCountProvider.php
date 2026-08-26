<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\ApiResource\UploaderCount;
use App\Repository\UploaderRepository;

/**
 * @implements ProviderInterface<UploaderCount>
 */
final readonly class UploaderCountProvider implements ProviderInterface
{
    public function __construct(private UploaderRepository $uploaderRepository)
    {
    }

    /**
     * @return list<UploaderCount>
     */
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): array
    {
        return array_map(
            static fn (array $row): UploaderCount => new UploaderCount(
                $row[0]->getId()->toRfc4122(),
                $row[0]->getName(),
                $row[0]->getSlug(),
                (int) $row['total'],
            ),
            $this->uploaderRepository->findAllWithMediaFileCount(),
        );
    }
}
