<?php

namespace App\Exception;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ErrorResource;
use ApiPlatform\Metadata\Exception\ProblemExceptionInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Uid\Uuid;

#[ErrorResource(
    status: Response::HTTP_CONFLICT,
    shortName: 'UploaderAlreadyExists',
    description: 'Un uploader avec le même slug existe déjà.',
    normalizationContext: [
        'groups' => ['jsonld', 'jsonproblem', 'jsonapi'],
        'skip_null_values' => true,
        'ignored_attributes' => ['trace', 'file', 'line', 'code', 'message', 'traceAsString', 'previous'],
    ],
)]
final class UploaderAlreadyExistsException extends ConflictHttpException implements ProblemExceptionInterface
{
    /** @var array{uploaderId: Uuid} */
    private readonly array $data;

    public function __construct(
        Uuid $uploaderId,
        ?\Throwable $previous = null,
    ) {
        $this->data = ['uploaderId' => $uploaderId];

        parent::__construct('Ce nom est déjà utilisé.', $previous);
    }

    #[Groups(['jsonld', 'jsonproblem', 'jsonapi'])]
    #[ApiProperty(writable: false, initializable: false)]
    /**
     * @return array{uploaderId: Uuid}
     */
    public function getData(): array
    {
        return $this->data;
    }

    #[Groups(['jsonld', 'jsonproblem', 'jsonapi'])]
    #[ApiProperty(writable: false, initializable: false)]
    public function getType(): string
    {
        return '/errors/uploader-already-exists';
    }

    #[Groups(['jsonld', 'jsonproblem', 'jsonapi'])]
    #[ApiProperty(writable: false, initializable: false)]
    public function getTitle(): string
    {
        return 'Uploader déjà existant';
    }

    #[Groups(['jsonld', 'jsonproblem', 'jsonapi'])]
    public function getStatus(): int
    {
        return Response::HTTP_CONFLICT;
    }

    #[Groups(['jsonld', 'jsonproblem', 'jsonapi'])]
    #[ApiProperty(writable: false, initializable: false)]
    public function getDetail(): string
    {
        return $this->getMessage();
    }

    #[Groups(['jsonld', 'jsonproblem', 'jsonapi'])]
    #[ApiProperty(writable: false, initializable: false)]
    public function getInstance(): ?string
    {
        return null;
    }
}
