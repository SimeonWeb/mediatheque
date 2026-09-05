<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Post;
use App\Dto\CreateMediaFileMetaInput;
use App\State\CreateMediaFileMetaProcessor;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Uid\Uuid;

#[ApiResource(
    operations: [
        new Post(
            uriTemplate: '/media_file_meta',
            input: CreateMediaFileMetaInput::class,
            processor: CreateMediaFileMetaProcessor::class,
            inputFormats: [
                'jsonld' => ['application/ld+json'],
                'json' => ['application/json'],
            ],
            formats: [
                'jsonld' => ['application/ld+json'],
                'json' => ['application/json'],
            ],
            normalizationContext: ['groups' => ['media_file_meta:create:read']],
            security: "is_granted('ROLE_UPLOAD_ALL')",
        ),
    ],
)]
#[ORM\Entity]
#[ORM\Table(name: 'media_file_meta')]
#[ORM\UniqueConstraint(name: 'uniq_media_file_meta_title', columns: ['media_file_id', 'title'])]
class MediaFileMeta
{
    #[ORM\Id]
    #[ORM\Column(type: 'uuid', unique: true)]
    private Uuid $id;

    #[ORM\ManyToOne(targetEntity: MediaFile::class, inversedBy: 'metadata')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private MediaFile $mediaFile;

    #[ORM\Column(length: 255)]
    private string $title;

    #[ORM\Column(type: Types::TEXT)]
    private string $value;

    public function __construct(MediaFile $mediaFile, string $title, string $value)
    {
        $this->id = Uuid::v7();
        $this->mediaFile = $mediaFile;
        $this->title = $title;
        $this->value = $value;
    }

    #[Groups(['media_file_meta:create:read'])]
    public function getId(): Uuid
    {
        return $this->id;
    }

    #[Groups(['media_file_meta:create:read'])]
    public function getMediaFileId(): Uuid
    {
        return $this->mediaFile->getId();
    }

    #[Groups(['media_file_meta:create:read'])]
    public function getTitle(): string
    {
        return $this->title;
    }

    #[Groups(['media_file_meta:create:read'])]
    public function getValue(): string
    {
        return $this->value;
    }

    public function setValue(string $value): void
    {
        $this->value = $value;
    }
}
