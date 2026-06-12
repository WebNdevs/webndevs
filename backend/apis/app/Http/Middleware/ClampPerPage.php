<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ClampPerPage
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->query->has('per_page')) {
            $perPage = (int) $request->query('per_page', 20);
            $request->query->set('per_page', max(min($perPage, 20), 1));
        }

        if ($request->query->has('limit')) {
            $limit = (int) $request->query('limit', 20);
            $request->query->set('limit', max(min($limit, 20), 1));
        }

        return $next($request);
    }
}
