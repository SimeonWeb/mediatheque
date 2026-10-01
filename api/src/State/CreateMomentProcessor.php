<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Dto\CreateMomentInput;
use App\Entity\Moment;
use App\Repository\MomentRepository;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;
use Symfony\Component\String\Slugger\SluggerInterface;

/**
 * @implements ProcessorInterface<CreateMomentInput, Moment>
 */
final readonly class CreateMomentProcessor implements ProcessorInterface
{
    public function __construct(
        private SluggerInterface $slugger,
        private MomentRepository $repository,
        private EntityManagerInterface $entityManager,
    ) {
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): Moment
    {
        if (!$data instanceof CreateMomentInput || null === $data->startsAt) {
            throw new \InvalidArgumentException('Les données de création du moment sont invalides.');
        }

        $label = trim($data->label);
        $slug = $this->slugger->slug($label)->lower()->toString();

        if ('' === $slug || mb_strlen($slug) > 255) {
            throw new UnprocessableEntityHttpException('Le slug généré est invalide.');
        }

        if (null !== $this->repository->findOneBy(['slug' => $slug])) {
            throw new ConflictHttpException('Un moment avec le même label existe déjà.');
        }

        $moment = new Moment($data->startsAt, $label, $slug);

        try {
            $this->entityManager->persist($moment);
            $this->entityManager->flush();
        } catch (UniqueConstraintViolationException $exception) {
            throw new ConflictHttpException('Un moment avec le même label existe déjà.', $exception);
        }

        return $moment;
    }
}
