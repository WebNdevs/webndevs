<?php

use App\Http\Controllers\Api\SitemapController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/sitemap.xml', [SitemapController::class, 'show']);
Route::get('/sitemaps/{section}.xml', [SitemapController::class, 'section']);
Route::get('/robots.txt', fn () => response(
    "User-agent: *\nDisallow: /\n",
    200,
    ['Content-Type' => 'text/plain']
));
