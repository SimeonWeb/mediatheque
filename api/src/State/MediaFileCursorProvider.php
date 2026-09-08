<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\Pagination\PartialPaginatorInterface;
use ApiPlatform\State\ProviderInterface;
use App\Entity\MediaFile;
use App\Enum\MediaType;
use App\Repository\MediaFileRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

/**
 * @implements ProviderInterface<MediaFile>
 */
final readonly class MediaFileCursorProvider implements ProviderInterface
{
    public function __construct(private MediaFileRepository $mediaFileRepository)
    {
    }

    /**
     * @return PartialPaginatorInterface<MediaFile>
     */
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): PartialPaginatorInterface
    {
        $request = $context['request'] ?? null;
        if (!$request instanceof Request) {
            throw new \LogicException('La requête HTTP est indisponible.');
        }

        $itemsPerPage = min(100, max(1, $request->query->getInt('itemsPerPage', 20)));
        $queryBuilder = $this->mediaFileRepository->createQueryBuilder('mediaFile');

        $type = $request->query->get('type');
        if (is_string($type) && '' !== $type) {
            $mediaType = MediaType::tryFrom($type);
            if (null === $mediaType) {
                throw new BadRequestHttpException('Le type de média est invalide.');
            }

            $queryBuilder
                ->andWhere('mediaFile.mediaType = :mediaType')
                ->setParameter('mediaType', $mediaType);
        }

        $uploader = $request->query->get('uploader');
        if (is_string($uploader) && '' !== $uploader) {
            $queryBuilder
                ->innerJoin('mediaFile.uploader', 'uploader')
                ->andWhere('uploader.slug = :uploader')
                ->setParameter('uploader', $uploader);
        }

        $createdAtCursor = $request->query->all('createdAt');
        $idCursor = $request->query->all('id');
        $operator = isset($createdAtCursor['gt'], $idCursor['gt']) ? 'gt' : (isset($createdAtCursor['lt'], $idCursor['lt']) ? 'lt' : null);

        if (([] !== $createdAtCursor || [] !== $idCursor) && null === $operator) {
            throw new BadRequestHttpException('Le curseur de pagination est incomplet.');
        }

        $direction = 'ASC';
        if (null !== $operator) {
            try {
                $cursorDate = new \DateTimeImmutable((string) $createdAtCursor[$operator]);
            } catch (\Throwable $exception) {
                throw new BadRequestHttpException('La date du curseur est invalide.', $exception);
            }

            $cursorId = filter_var($idCursor[$operator], FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
            if (false === $cursorId) {
                throw new BadRequestHttpException('L’identifiant du curseur est invalide.');
            }

            $comparison = 'gt' === $operator ? '>' : '<';
            $queryBuilder
                ->andWhere(sprintf(
                    '(mediaFile.createdAt %1$s :cursorDate OR (mediaFile.createdAt = :cursorDate AND mediaFile.id %1$s :cursorId))',
                    $comparison,
                ))
                ->setParameter('cursorDate', $cursorDate)
                ->setParameter('cursorId', $cursorId);

            if ('lt' === $operator) {
                $direction = 'DESC';
            }
        }

        $items = $queryBuilder
            ->orderBy('mediaFile.createdAt', $direction)
            ->addOrderBy('mediaFile.id', $direction)
            ->setMaxResults($itemsPerPage)
            ->getQuery()
            ->getResult();

        if ('DESC' === $direction) {
            $items = array_reverse($items);
        }

        return new CursorPaginator($items, $itemsPerPage);
    }
}
