<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SitemapGeneratorService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function __construct(private readonly SitemapGeneratorService $sitemapGenerator)
    {
    }

    public function show(): Response
    {
        $cacheKey = 'seo:sitemap:primary';
        $ttl = now()->addMinutes((int) config('seo.sitemap_cache_minutes', 60));
        $xml = Cache::remember($cacheKey, $ttl, fn (): string => $this->sitemapGenerator->generatePrimarySitemapXml());

        return response($xml, 200)->header('Content-Type', 'application/xml');
    }

    public function section(string $section): Response
    {
        $cacheKey = "seo:sitemap:section:{$section}";
        $ttl = now()->addMinutes((int) config('seo.sitemap_cache_minutes', 60));
        $xml = Cache::remember($cacheKey, $ttl, fn (): ?string => $this->sitemapGenerator->generateSectionSitemapXml($section));
        if (! $xml) {
            abort(404);
        }

        return response($xml, 200)->header('Content-Type', 'application/xml');
    }
}
