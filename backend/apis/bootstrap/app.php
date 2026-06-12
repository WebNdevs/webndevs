<?php

use App\Http\Middleware\CheckPermission;
use App\Http\Middleware\CorsMiddleware;
use App\Http\Middleware\ClampPerPage;
use App\Http\Middleware\CachePublicApiResponse;
use App\Http\Middleware\EnsureAdmin;
use App\Http\Middleware\ForceJsonResponse;
use App\Http\Middleware\GzipApiResponse;
use App\Http\Middleware\ResolveRedirects;
use App\Http\Middleware\SanitizeRichTextInput;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'admin' => EnsureAdmin::class,
            'permission' => CheckPermission::class,
        ]);

        $middleware->appendToGroup('api', [
            ClampPerPage::class,
            ForceJsonResponse::class,
            SanitizeRichTextInput::class,
            CorsMiddleware::class,
            CachePublicApiResponse::class,
            GzipApiResponse::class,
        ]);

        $middleware->appendToGroup('web', [
            ResolveRedirects::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (ValidationException $e, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'data' => null,
                'errors' => $e->errors(),
            ], 422);
        });

        $exceptions->render(function (AuthenticationException $e, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated.',
                'data' => null,
                'errors' => [],
            ], 401);
        });

        $exceptions->render(function (HttpExceptionInterface $e, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            return response()->json([
                'success' => false,
                'message' => $e->getMessage() ?: 'HTTP error.',
                'data' => null,
                'errors' => [],
            ], $e->getStatusCode());
        });

        $exceptions->render(function (Throwable $e, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            return response()->json([
                'success' => false,
                'message' => 'Server error.',
                'data' => null,
                'errors' => config('app.debug') ? [$e->getMessage()] : [],
            ], 500);
        });
    })->create();
