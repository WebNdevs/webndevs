<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class CachePublicApiResponse
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $this->shouldCache($request)) {
            return $next($request);
        }

        $store = (string) config('cache.public_api_store', 'redis');
        $ttlSeconds = max((int) config('cache.public_api_ttl_seconds', 900), 60);
        $cacheKey = 'api:public:' . sha1($request->fullUrl());

        try {
            $cached = Cache::store($store)->get($cacheKey);
            if (is_array($cached)) {
                return response($cached['body'] ?? '', (int) ($cached['status'] ?? 200), $cached['headers'] ?? []);
            }
        } catch (\Throwable) {
            // Silently fall back to uncached response when a store is unavailable.
        }

        $response = $next($request);

        if ($response->getStatusCode() !== 200 || ! $response instanceof HttpResponse) {
            return $response;
        }

        $payload = [
            'status' => $response->getStatusCode(),
            'headers' => [
                'Content-Type' => (string) $response->headers->get('Content-Type', 'application/json'),
                'Cache-Control' => "public, max-age={$ttlSeconds}",
                'X-Response-Cache' => 'MISS',
            ],
            'body' => $response->getContent() ?: '',
        ];

        try {
            Cache::store($store)->put($cacheKey, $payload, now()->addSeconds($ttlSeconds));
            $response->headers->set('X-Response-Cache', 'MISS');
            $response->headers->set('Cache-Control', "public, max-age={$ttlSeconds}");
        } catch (\Throwable) {
            // Ignore cache write failures.
        }

        return $response;
    }

    private function shouldCache(Request $request): bool
    {
        if (! $request->isMethod('GET')) {
            return false;
        }

        if (! $request->is('api/v1/*')) {
            return false;
        }

        return ! str_contains($request->path(), '/auth/');
    }
}
