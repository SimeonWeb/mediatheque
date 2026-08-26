<?php

namespace App\Repository;

use App\Entity\MediaFile;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<MediaFile>
 */
final class MediaFileRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, MediaFile::class);
    }

    /**
     * @return array<string, int>
     */
    public function countByType(): array
    {
        $rows = $this->createQueryBuilder('mediaFile')
            ->select('mediaFile.mediaType AS type')
            ->addSelect('COUNT(mediaFile.id) AS total')
            ->groupBy('mediaFile.mediaType')
            ->getQuery()
            ->getArrayResult();

        $counts = [];
        foreach ($rows as $row) {
            $type = $row['type'];
            $counts[is_string($type) ? $type : $type->value] = (int) $row['total'];
        }

        return $counts;
    }
}
