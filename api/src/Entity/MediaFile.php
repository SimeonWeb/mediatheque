<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\ExactFilter;
use ApiPlatform\Doctrine\Orm\Filter\SortFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\QueryParameter;
use App\Enum\MediaType;
use App\Repository\MediaFileRepository;
use App\State\UploadFileProcessor;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    operations: [
        new Post(
            uriTemplate: '/media_files',
            input: false,
            processor: UploadFileProcessor::class,
            inputFormats: ['multipart' => ['multipart/form-data']],
            normalizationContext: ['groups' => ['media_file:read']],
            read: false,
            deserialize: false,
            validate: false,
        ),
        new GetCollection(
            uriTemplate: '/media_files',
            normalizationContext: ['groups' => ['media_file:read']],
            order: ['uploadedAt' => 'DESC'],
            paginationItemsPerPage: 20,
            paginationMaximumItemsPerPage: 100,
            paginationClientItemsPerPage: true,
            parameters: [
                'page' => new QueryParameter(
                    schema: ['type' => 'integer', 'minimum' => 1],
                    castToNativeType: true,
                ),
                'itemsPerPage' => new QueryParameter(
                    schema: ['type' => 'integer', 'minimum' => 1, 'maximum' => 100],
                    castToNativeType: true,
                ),
                'uploader' => new QueryParameter(
                    property: 'uploader.slug',
                    filter: new ExactFilter(),
                    constraints: [
                        new Assert\Length(max: 255),
                        new Assert\Regex(pattern: '/^[a-z0-9]+(?:-[a-z0-9]+)*$/'),
                    ],
                ),
                'type' => new QueryParameter(
                    property: 'mediaType',
                    filter: new ExactFilter(),
                    schema: [
                        'type' => 'string',
                        'enum' => MediaType::VALUES,
                    ],
                    constraints: [
                        new Assert\Choice(choices: MediaType::VALUES),
                    ],
                ),
                'sort[type]' => new QueryParameter(
                    property: 'mediaType',
                    filter: new SortFilter(),
                ),
                'sort[:property]' => new QueryParameter(
                    properties: ['originalName', 'mimeType', 'size', 'createdAt', 'uploadedAt'],
                    filter: new SortFilter(),
                ),
            ],
        ),
    ],
)]
#[ORM\Entity(repositoryClass: MediaFileRepository::class)]
#[ORM\Table(name: 'media_file')]
#[ORM\Index(name: 'idx_media_file_original_name', columns: ['original_name'])]
#[ORM\Index(name: 'idx_media_file_mime_type', columns: ['mime_type'])]
#[ORM\Index(name: 'idx_media_file_type', columns: ['type'])]
#[ORM\Index(name: 'idx_media_file_size', columns: ['size'])]
#[ORM\Index(name: 'idx_media_file_created_at', columns: ['created_at'])]
#[ORM\Index(name: 'idx_media_file_uploaded_at', columns: ['uploaded_at'])]
class MediaFile
{
    #[ORM\Id]
    #[ORM\Column(type: 'uuid', unique: true)]
    private Uuid $id;

    #[ORM\Column(length: 255)]
    private string $originalName;

    #[ORM\Column(length: 255, unique: true)]
    private string $storageName;

    #[ORM\Column(length: 500)]
    private string $relativePath;

    #[ORM\Column(length: 500, nullable: true)]
    private ?string $thumbnailRelativePath;

    #[ORM\Column(length: 500, nullable: true)]
    private ?string $fullRelativePath;

    #[ORM\Column(length: 500, nullable: true)]
    private ?string $mediumRelativePath;

    #[ORM\Column(length: 255)]
    private string $mimeType;

    #[ORM\Column(name: 'type', length: 20, enumType: MediaType::class)]
    private MediaType $mediaType;

    #[ORM\Column(length: 20, nullable: true)]
    private ?string $extension;

    #[ORM\Column(type: Types::BIGINT)]
    private int $size;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private \DateTimeImmutable $createdAt;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private \DateTimeImmutable $uploadedAt;

    #[ORM\ManyToOne(targetEntity: Uploader::class)]
    #[ORM\JoinColumn(nullable: false, onDelete: 'RESTRICT')]
    private Uploader $uploader;

    public function __construct(
        string $originalName,
        string $storageName,
        string $relativePath,
        string $mimeType,
        MediaType $type,
        ?string $extension,
        int $size,
        Uploader $uploader,
        ?string $thumbnailRelativePath = null,
        ?string $fullRelativePath = null,
        ?string $mediumRelativePath = null,
        ?\DateTimeImmutable $createdAt = null,
        ?\DateTimeImmutable $uploadedAt = null,
    ) {
        $uploadedAt ??= new \DateTimeImmutable();

        $this->id = Uuid::v7();
        $this->originalName = $originalName;
        $this->storageName = $storageName;
        $this->relativePath = $relativePath;
        $this->mimeType = $mimeType;
        $this->mediaType = $type;
        $this->extension = $extension;
        $this->size = $size;
        $this->createdAt = $createdAt ?? $uploadedAt;
        $this->uploadedAt = $uploadedAt;
        $this->uploader = $uploader;
        $this->thumbnailRelativePath = $thumbnailRelativePath;
        $this->fullRelativePath = $fullRelativePath;
        $this->mediumRelativePath = $mediumRelativePath;
    }

    #[Groups(['media_file:read'])]
    public function getId(): Uuid
    {
        return $this->id;
    }

    #[Groups(['media_file:read'])]
    public function getOriginalName(): string
    {
        return $this->originalName;
    }

    public function getStorageName(): string
    {
        return $this->storageName;
    }

    public function getRelativePath(): string
    {
        return $this->relativePath;
    }

    public function getThumbnailRelativePath(): ?string
    {
        return $this->thumbnailRelativePath;
    }

    public function getFullRelativePath(): ?string
    {
        return $this->fullRelativePath;
    }

    public function getMediumRelativePath(): ?string
    {
        return $this->mediumRelativePath;
    }

    #[Groups(['media_file:read'])]
    public function getMimeType(): string
    {
        return $this->mimeType;
    }

    #[Groups(['media_file:read'])]
    public function getType(): string
    {
        return $this->mediaType->value;
    }

    #[Groups(['media_file:read'])]
    public function getExtension(): ?string
    {
        return $this->extension;
    }

    #[Groups(['media_file:read'])]
    public function getSize(): int
    {
        return $this->size;
    }

    #[Groups(['media_file:read'])]
    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }

    #[Groups(['media_file:read'])]
    public function getUploadedAt(): \DateTimeImmutable
    {
        return $this->uploadedAt;
    }

    #[Groups(['media_file:read'])]
    public function getUploader(): Uploader
    {
        return $this->uploader;
    }

    /**
     * @return array{full: ?string, medium: ?string, thumbnail: ?string}
     */
    #[Groups(['media_file:read'])]
    public function getPaths(): array
    {
        return [
            'full' => str_starts_with($this->mimeType, 'image/')
                ? $this->fullRelativePath
                : $this->relativePath,
            'medium' => $this->mediumRelativePath,
            'thumbnail' => $this->thumbnailRelativePath,
        ];
    }
}
