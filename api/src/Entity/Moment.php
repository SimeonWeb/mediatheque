<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use App\Dto\CreateMomentInput;
use App\Repository\MomentRepository;
use App\State\CreateMomentProcessor;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ApiResource(
    operations: [
        new Post(
            uriTemplate: '/moments',
            input: CreateMomentInput::class,
            processor: CreateMomentProcessor::class,
            inputFormats: [
                'jsonld' => ['application/ld+json'],
                'json' => ['application/json'],
            ],
            normalizationContext: ['groups' => ['moment:read']],
            security: "is_granted('ROLE_UPLOAD_ALL')",
        ),
        new GetCollection(
            uriTemplate: '/moments',
            normalizationContext: ['groups' => ['moment:read']],
            order: ['startsAt' => 'ASC', 'id' => 'ASC'],
            paginationEnabled: false,
        ),
    ],
)]
#[ORM\Entity(repositoryClass: MomentRepository::class)]
#[ORM\Table(name: 'moment')]
#[ORM\Index(name: 'idx_moment_starts_at', columns: ['starts_at'])]
class Moment
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: Types::INTEGER)]
    private int $id;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private \DateTimeImmutable $startsAt;

    #[ORM\Column(length: 255)]
    private string $label;

    #[ORM\Column(length: 255, unique: true)]
    private string $slug;

    public function __construct(\DateTimeImmutable $startsAt, string $label, string $slug)
    {
        $this->startsAt = $startsAt;
        $this->label = $label;
        $this->slug = $slug;
    }

    #[Groups(['moment:read'])]
    public function getId(): int
    {
        return $this->id;
    }

    #[Groups(['moment:read'])]
    public function getStartsAt(): \DateTimeImmutable
    {
        return $this->startsAt;
    }

    #[Groups(['moment:read'])]
    public function getLabel(): string
    {
        return $this->label;
    }

    #[Groups(['moment:read'])]
    public function getSlug(): string
    {
        return $this->slug;
    }
}
