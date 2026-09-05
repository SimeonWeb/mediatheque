<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Dto\CreateMediaFileMetaInput;
use App\Entity\MediaFileMeta;
use App\Repository\MediaFileRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Uid\Uuid;

/**
 * @implements ProcessorInterface<CreateMediaFileMetaInput, MediaFileMeta>
 */
final readonly class CreateMediaFileMetaProcessor implements ProcessorInterface
{
    public function __construct(
        private MediaFileRepository $mediaFileRepository,
        private EntityManagerInterface $entityManager,
    ) {
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): MediaFileMeta
    {
        if (!$data instanceof CreateMediaFileMetaInput) {
            throw new \InvalidArgumentException('Les métadonnées sont invalides.');
        }

        $mediaFileId = trim($data->mediaFileId);
        if ('' === $mediaFileId || !Uuid::isValid($mediaFileId)) {
            throw new BadRequestHttpException('Le champ "mediaFileId" doit contenir un UUID valide.');
        }

        $mediaFile = $this->mediaFileRepository->find(Uuid::fromString($mediaFileId));
        if (null === $mediaFile) {
            throw new NotFoundHttpException('Le fichier média demandé n’existe pas.');
        }

        $metadata = $mediaFile->setMeta(trim($data->title), $data->value ?? '');

        $this->entityManager->persist($metadata);
        $this->entityManager->flush();

        return $metadata;
    }
}
