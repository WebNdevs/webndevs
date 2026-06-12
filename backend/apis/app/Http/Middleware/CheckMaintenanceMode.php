<?php

namespace App\Http\Middleware;

use App\Services\SettingsService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckMaintenanceMode
{
    /**
     * Paths that should be protected by maintenance mode (public paths only)
     */
    private const PROTECTED_PATHS = [
        '/api/v1/services',
        '/api/v1/blog-posts',
        '/api/v1/case-studies',
        '/api/v1/industries',
        '/api/v1/tools',
        '/api/v1/solutions',
        '/api/v1/content-pages',
        '/api/v1/pages',
        '/api/v1/navigation',
        '/api/v1/search',
        '/api/v1/testimonials',
        '/api/v1/faqs',
        '/api/v1/process-steps',
        '/api/v1/comparisons',
        '/api/v1/cross-references',
        '/api/v1/sitemap',
    ];

    public function handle(Request $request, Closure $next): Response
    {
        // Skip maintenance mode check for admin/authenticated routes
        if ($this->isAdminRoute($request) || $this->isAuthenticated($request)) {
            return $next($request);
        }

        // Only check maintenance mode for public routes
        if (!$this->isPublicRoute($request)) {
            return $next($request);
        }

        if (SettingsService::isMaintenanceMode()) {
            return response()->json([
                'success' => false,
                'message' => 'Site is under maintenance.',
                'data' => null,
                'errors' => [],
            ], 503);
        }

        return $next($request);
    }

    private function isPublicRoute(Request $request): bool
    {
        $path = '/' . ltrim($request->path(), '/');
        
        // Allow settings and auth routes for maintenance page functionality
        if (str_starts_with($path, '/api/settings') || 
            str_starts_with($path, '/api/v1/auth') ||
            str_starts_with($path, '/api/health')) {
            return false;
        }

        foreach (self::PROTECTED_PATHS as $protected) {
            if (str_starts_with($path, $protected)) {
                return true;
            }
        }

        return false;
    }

    private function isAdminRoute(Request $request): bool
    {
        // Check if this is an admin/settings route
        return $request->is('api/settings/*') || 
               $request->is('api/admin/*') ||
               $request->is('api/v1/auth/me');
    }

    private function isAuthenticated(Request $request): bool
    {
        // Check if user is authenticated
        return $request->user() !== null;
    }
}
