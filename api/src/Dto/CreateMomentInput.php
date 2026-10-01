<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

final class CreateMomentInput
{
    #[Assert\NotNull]
    public ?\DateTimeImmutable $startsAt = null;

    #[Assert\NotBlank(normalizer: 'trim')]
    #[Assert\Length(max: 255, normalizer: 'trim')]
    public string $label = '';
}
