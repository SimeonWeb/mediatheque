<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\ApiResource\Role;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

/**
 * @implements ProviderInterface<Role>
 */
final readonly class RoleProvider implements ProviderInterface
{
    public function __construct(private AuthorizationCheckerInterface $authorizationChecker)
    {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): Role
    {
        $role = match (true) {
            $this->authorizationChecker->isGranted('ROLE_UPLOAD_ALL') => 'UPLOAD_ALL',
            $this->authorizationChecker->isGranted('ROLE_UPLOADER') => 'UPLOAD',
            $this->authorizationChecker->isGranted('ROLE_READER') => 'READ',
            default => throw new AccessDeniedException(),
        };

        return new Role($role);
    }
}
