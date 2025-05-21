<?php

use App\Http\Middleware\Auth;
use App\Http\Middleware\AuthWithThrottle;
use App\Services\ResponseService;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;


return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // 400 - Bad Request
        $exceptions->render(function (\Symfony\Component\HttpKernel\Exception\BadRequestHttpException $e, Request $request) {
            return ResponseService::error($e->getMessage(),code:400);
        });

        // 401 - Unauthorized
        $exceptions->render(function (\Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException $e, Request $request) {
            return ResponseService::forbidden($e->getMessage());
        });

        // 403 - Forbidden
        $exceptions->render(function (\Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException $e, Request $request) {
            return ResponseService::forbidden($e->getMessage());
        });

        // 404 - Not Found
        $exceptions->render(function (\Symfony\Component\HttpKernel\Exception\NotFoundHttpException $e, Request $request) {
            return ResponseService::notFound($e->getMessage());
        });

        // 422 - Unprocessable Entity (e.g., validation errors)
        $exceptions->render(function (\Illuminate\Validation\ValidationException $e, Request $request) {
            return ResponseService::validationError($e->errors(), $e->getMessage());
        });

        // 429 - Too Many Requests
        $exceptions->render(function (\Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException $e, Request $request) {
            return ResponseService::tooManyAttempts($e->getMessage());
        });

        // Generic fallback (optional)
        $exceptions->render(function (\Throwable $e, Request $request) {
            return ResponseService::error($e->getMessage());
        });
    })
    ->create();

