<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Post;
use App\Dto\CreateUploaderInput;
use App\Exception\UploaderAlreadyExistsException;
use App\Repository\UploaderRepository;
use App\State\CreateUploaderProcessor;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ApiResource(
    operations: [
        new Post(
            uriTemplate: '/uploaders',
            input: CreateUploaderInput::class,
            processor: CreateUploaderProcessor::class,
            inputFormats: [
                'jsonld' => ['application/ld+json'],
                'json' => ['application/json'],
            ],
            normalizationContext: ['groups' => ['uploader:create:read']],
            errors: [UploaderAlreadyExistsException::class],
        ),
    ],
)]
#[ORM\Entity(repositoryClass: UploaderRepository::class)]
#[ORM\Table(name: 'uploader')]
class Uploader
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: Types::BIGINT)]
    private int $id;

    #[ORM\Column(length: 255)]
    private string $name;

    #[ORM\Column(length: 255, unique: true)]
    private string $slug;

    public function __construct(string $name, string $slug)
    {
        $this->name = $name;
        $this->slug = $slug;
    }

    #[Groups(['media_file:read', 'uploader:create:read'])]
    public function getId(): int
    {
        return $this->id;
    }

    #[Groups(['media_file:read'])]
    public function getName(): string
    {
        return $this->name;
    }

    #[Groups(['media_file:read'])]
    public function getSlug(): string
    {
        return $this->slug;
    }
}
