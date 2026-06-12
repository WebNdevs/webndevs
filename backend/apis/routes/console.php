<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schedule;
use App\Services\SitemapGeneratorService;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('seo:sitemap:warm', function (SitemapGeneratorService $sitemapGenerator) {
    $ttl = now()->addMinutes((int) config('seo.sitemap_cache_minutes', 60));
    Cache::put('seo:sitemap:primary', $sitemapGenerator->generatePrimarySitemapXml(), $ttl);

    $sections = array_keys($sitemapGenerator->generateSectionSitemaps());
    foreach ($sections as $section) {
        $sectionXml = $sitemapGenerator->generateSectionSitemapXml($section);
        if ($sectionXml) {
            Cache::put("seo:sitemap:section:{$section}", $sectionXml, $ttl);
        }
    }

    $this->info('Sitemap caches warmed successfully.');
})->purpose('Generate and cache sitemap XML payloads');

Artisan::command('seo:sitemap:clear', function () {
    $prefix = 'seo:sitemap:';
    $keys = [
        "{$prefix}primary",
        "{$prefix}section:core",
        "{$prefix}section:tools",
        "{$prefix}section:industries",
        "{$prefix}section:solutions",
        "{$prefix}section:comparisons",
        "{$prefix}section:case-studies",
    ];

    foreach ($keys as $key) {
        Cache::forget($key);
    }

    $this->info('Sitemap caches cleared.');
})->purpose('Clear cached sitemap XML payloads');

Schedule::command('seo:sitemap:warm')->dailyAt('02:00');
