<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

final class CreateMediaFileMetaInput
{
    public string $mediaFileId = '';

    #[Assert\NotBlank(normalizer: 'trim')]
    #[Assert\Length(max: 255, normalizer: 'trim')]
    public string $title = '';

    #[Assert\NotNull]
    public ?string $value = null;
}
