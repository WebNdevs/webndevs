<?php

use App\Http\Controllers\Api\SitemapController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/sitemap.xml', [SitemapController::class, 'show']);
Route::get('/sitemaps/{section}.xml', [SitemapController::class, 'section']);
Route::get('/robots.txt', fn () => response(
    "User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /admin/\nSitemap: ".rtrim((string) config('app.url'), '/')."/sitemap.xml\n",
    200,
    ['Content-Type' => 'text/plain']
));
