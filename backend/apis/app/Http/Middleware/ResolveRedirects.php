<?php

namespace App\Http\Middleware;

use App\Models\Redirect;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ResolveRedirects
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->is('api/*')) {
            return $next($request);
        }

        $requestPath = '/'.ltrim($request->path(), '/');
        $redirect = Redirect::query()
            ->where('from_url', $requestPath)
            ->where('is_active', true)
            ->first();

        if ($redirect) {
            $redirect->increment('hit_count');

            return redirect()->to($redirect->to_url, $redirect->redirect_type);
        }

        return $next($request);
    }
}
