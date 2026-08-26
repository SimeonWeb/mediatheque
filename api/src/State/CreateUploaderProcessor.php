<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Dto\CreateUploaderInput;
use App\Entity\Uploader;
use App\Repository\UploaderRepository;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;
use Symfony\Component\String\Slugger\SluggerInterface;

/**
 * @implements ProcessorInterface<CreateUploaderInput, Uploader>
 */
final readonly class CreateUploaderProcessor implements ProcessorInterface
{
    public function __construct(
        private SluggerInterface $slugger,
        private UploaderRepository $repository,
        private EntityManagerInterface $entityManager,
    ) {
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): Uploader
    {
        if (!$data instanceof CreateUploaderInput) {
            throw new \InvalidArgumentException('Les données de création du nom sont invalides.');
        }

        $name = trim($data->name);
        $slugSource = null === $data->slug ? $name : trim($data->slug);
        $slug = $this->slugger->slug($slugSource)->lower()->toString();

        if ('' === $slug || mb_strlen($slug) > 255) {
            throw new UnprocessableEntityHttpException('Le slug généré est invalide.');
        }

        if (null !== $this->repository->findOneBy(['slug' => $slug])) {
            throw new ConflictHttpException('Ce nom est déjà utilisé.');
        }

        $uploader = new Uploader($name, $slug);

        try {
            $this->entityManager->persist($uploader);
            $this->entityManager->flush();
        } catch (UniqueConstraintViolationException $exception) {
            throw new ConflictHttpException('Ce nom est déjà utilisé.', $exception);
        }

        return $uploader;
    }
}
