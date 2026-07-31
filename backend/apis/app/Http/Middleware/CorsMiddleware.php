<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CorsMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // Read from config (not env() directly) so this still works once
        // `php artisan config:cache` has run in production — Laravel stops
        // loading the .env file entirely once config is cached, so a raw
        // env() call here would silently return empty and break CORS for
        // every route in the `api` middleware group.
        $allowedOrigins = (array) config('cors.allowed_origins', []);

        $origin = (string) $request->headers->get('Origin', '');
        
        // Allow all origins in local development (APP_ENV=local)
        $isLocal = app()->environment('local');
        
        // Check if origin is in allowed list or if we're in local dev mode
        $allowedOrigin = null;
        if ($isLocal) {
            // In local development, allow any origin
            $allowedOrigin = $origin ?: '*';
        } elseif (in_array($origin, $allowedOrigins, true)) {
            $allowedOrigin = $origin;
        }

        $headers = [
            'Access-Control-Allow-Methods' => 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD',
            'Access-Control-Allow-Headers' => 'Accept, Authorization, Content-Type, X-Requested-With, X-CSRF-Token',
            'Access-Control-Allow-Credentials' => 'true',
            'Access-Control-Max-Age' => '86400',
            'Vary' => 'Origin',
        ];
        
        if ($allowedOrigin && $allowedOrigin !== '*') {
            $headers['Access-Control-Allow-Origin'] = $allowedOrigin;
        }

        // Handle preflight requests
        if ($request->getMethod() === 'OPTIONS') {
            $response = response('', 204, $headers);
            if ($allowedOrigin === '*') {
                $response->headers->set('Access-Control-Allow-Origin', '*');
            }
            return $response;
        }

        $response = $next($request);
        foreach ($headers as $key => $value) {
            $response->headers->set($key, $value);
        }
        
        // For local development, allow all origins on actual responses too
        if ($allowedOrigin === '*') {
            $response->headers->set('Access-Control-Allow-Origin', '*');
        }

        return $response;
    }
}
