<?php

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use App\State\RoleProvider;
use Symfony\Component\Serializer\Attribute\Groups;

#[ApiResource(
    shortName: 'Role',
    operations: [
        new Get(
            uriTemplate: '/role',
            provider: RoleProvider::class,
            formats: ['json' => ['application/json']],
            normalizationContext: ['groups' => ['role:read']],
        ),
    ],
)]
final readonly class Role
{
    public function __construct(
        #[Groups(['role:read'])]
        public string $role,
    ) {
    }
}
