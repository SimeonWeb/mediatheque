<?php

namespace App\Security;

use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAuthenticationException;
use Symfony\Component\Security\Core\User\InMemoryUser;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;

final class UploadTokenAuthenticator extends AbstractAuthenticator
{
    public function __construct(
        #[Autowire('%env(UPLOAD_BEARER_TOKEN)%')]
        private readonly string $uploadToken,
        #[Autowire('%env(UPLOAD_ALL_BEARER_TOKEN)%')]
        private readonly string $uploadAllToken,
        #[Autowire('%env(READ_BEARER_TOKEN)%')]
        private readonly string $readToken,
    ) {
    }

    public function supports(Request $request): bool
    {
        $path = $request->getPathInfo();

        return !$request->isMethod(Request::METHOD_OPTIONS)
            && ('/api' === $path || str_starts_with($path, '/api/'));
    }

    public function authenticate(Request $request): Passport
    {
        $authorization = $request->headers->get('Authorization', '');

        if (1 !== preg_match('/^Bearer\s+(\S+)$/i', trim($authorization), $matches)) {
            throw new CustomUserMessageAuthenticationException('Token d’accès invalide.');
        }

        $providedToken = $matches[1];
        $identity = $this->resolveIdentity($providedToken);
        if (null === $identity) {
            throw new CustomUserMessageAuthenticationException('Token d’accès invalide.');
        }

        [$identifier, $roles] = $identity;

        return new SelfValidatingPassport(
            new UserBadge(
                $identifier,
                static fn (): InMemoryUser => new InMemoryUser($identifier, null, $roles),
            ),
        );
    }

    public function onAuthenticationSuccess(
        Request $request,
        TokenInterface $token,
        string $firewallName,
    ): ?Response {
        return null;
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): JsonResponse
    {
        return new JsonResponse(
            ['error' => 'Token d’accès invalide.'],
            Response::HTTP_UNAUTHORIZED,
        );
    }

    /**
     * @return array{string, list<string>}|null
     */
    private function resolveIdentity(string $providedToken): ?array
    {
        $tokens = [
            [$this->uploadAllToken, 'upload-all-token', ['ROLE_UPLOAD_ALL']],
            [$this->uploadToken, 'upload-token', ['ROLE_UPLOADER']],
            [$this->readToken, 'read-token', ['ROLE_READER']],
        ];

        foreach ($tokens as [$expectedToken, $identifier, $roles]) {
            if ('' !== $expectedToken && hash_equals($expectedToken, $providedToken)) {
                return [$identifier, $roles];
            }
        }

        return null;
    }
}
