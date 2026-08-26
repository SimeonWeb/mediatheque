<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

final class CreateUploaderInput
{
    #[Assert\NotBlank(normalizer: 'trim')]
    #[Assert\Length(max: 255, normalizer: 'trim')]
    public string $name = '';

    #[Assert\Length(max: 255, normalizer: 'trim')]
    public ?string $slug = null;
}
