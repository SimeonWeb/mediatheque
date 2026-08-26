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
        private readonly string $expectedToken,
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
        if ('' === $this->expectedToken || !hash_equals($this->expectedToken, $providedToken)) {
            throw new CustomUserMessageAuthenticationException('Token d’accès invalide.');
        }

        return new SelfValidatingPassport(
            new UserBadge(
                'upload-token',
                static fn (): InMemoryUser => new InMemoryUser('upload-token', null, ['ROLE_UPLOADER']),
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
}
