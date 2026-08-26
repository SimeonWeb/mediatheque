<?php

namespace App\Repository;

use App\Entity\MediaFile;
use App\Entity\Uploader;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\Query\Expr\Join;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Uploader>
 */
final class UploaderRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Uploader::class);
    }

    /**
     * @return list<array{0: Uploader, total: int|string}>
     */
    public function findAllWithMediaFileCount(): array
    {
        return $this->createQueryBuilder('uploader')
            ->select('uploader')
            ->addSelect('COUNT(mediaFile.id) AS total')
            ->leftJoin(MediaFile::class, 'mediaFile', Join::WITH, 'mediaFile.uploader = uploader')
            ->groupBy('uploader.id')
            ->orderBy('uploader.name', 'ASC')
            ->addOrderBy('uploader.slug', 'ASC')
            ->getQuery()
            ->getResult();
    }
}
