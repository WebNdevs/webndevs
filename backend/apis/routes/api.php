<?php

use App\Http\Controllers\Api\AiContentController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AuditLogController;
use App\Http\Controllers\Api\ContentPageController;
use App\Http\Controllers\Api\ContentGapController;
use App\Http\Controllers\Api\ContentSectionController;
use App\Http\Controllers\Api\ContentItemController;
use App\Http\Controllers\Api\ArticlePageController;
use App\Http\Controllers\Api\ArticleSectionController;
use App\Http\Controllers\Api\ArticleItemController;
use App\Http\Controllers\Api\PublicArticleController;
use App\Http\Controllers\Api\ServicePageController;
use App\Http\Controllers\Api\ServiceSectionController;
use App\Http\Controllers\Api\ServiceItemController;
use App\Http\Controllers\Api\PublicServiceController;
use App\Http\Controllers\Api\DataHubPageController;
use App\Http\Controllers\Api\DataHubSectionController;
use App\Http\Controllers\Api\DataHubItemController;
use App\Http\Controllers\Api\PublicDataHubController;
use App\Http\Controllers\Api\SinglePagePageController;
use App\Http\Controllers\Api\SinglePageSectionController;
use App\Http\Controllers\Api\SinglePageItemController;
use App\Http\Controllers\Api\PublicSinglePageController;
use App\Http\Controllers\Api\CrossReferencePageController;
use App\Http\Controllers\Api\FAQController;
use App\Http\Controllers\Api\HomeController;
use App\Http\Controllers\Api\InternalLinkController;
use App\Http\Controllers\Api\NavigationController;
use App\Http\Controllers\Api\MediaLibraryController;
use App\Http\Controllers\Api\PublicContentController;
use App\Http\Controllers\Api\PackageOfferController;
use App\Http\Controllers\Api\ProcessStepController;
use App\Http\Controllers\Api\RedirectController;
use App\Http\Controllers\Api\SearchController;
use App\Http\Controllers\Api\SeoMetadataController;
use App\Http\Controllers\Api\FeatureController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\ServiceCategoryController;
use App\Http\Controllers\Api\ServiceInquiryController;
use App\Http\Controllers\Api\ServicePageContentController;
use App\Http\Controllers\Api\ServicePageSectionController;
use App\Http\Controllers\Api\ServicePlanController;
use App\Http\Controllers\Api\ServiceTemplateController;
use App\Http\Controllers\Api\SettingsController;
use App\Http\Controllers\Api\SitemapController;
use App\Http\Controllers\Api\TestimonialController;
use App\Http\Controllers\Api\UseCaseController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    $checks = [
        'database' => false,
        'cache' => false,
        'queue' => false,
    ];

    try {
        DB::select('select 1');
        $checks['database'] = true;
    } catch (\Throwable) {
    }

    try {
        Cache::put('health:ping', 'ok', now()->addMinute());
        $checks['cache'] = Cache::get('health:ping') === 'ok';
    } catch (\Throwable) {
    }

    try {
        Queue::size();
        $checks['queue'] = true;
    } catch (\Throwable) {
    }

    $ok = ! in_array(false, $checks, true);

    return response()->json([
        'status' => $ok ? 'ok' : 'degraded',
        'timestamp' => now()->toIso8601String(),
        'checks' => $checks,
    ], $ok ? 200 : 503);
});

Route::get('/settings/general', [SettingsController::class, 'publicGeneral']);

Route::prefix('v1')->group(function () {
    Route::post('/auth/register', [AuthController::class, 'register'])->middleware('throttle:3,1');
    Route::post('/auth/login', [AuthController::class, 'login'])->middleware('throttle:5,1');

    Route::get('/services', [ServiceController::class, 'index']);
    Route::get('/services/{service:slug}', [ServiceController::class, 'show']);
    Route::get('/services/{service:slug}/plans', [ServicePlanController::class, 'index']);
    Route::get('/services/{service:slug}/plans/compare', [ServicePlanController::class, 'compare']);
    Route::get('/services/{service:slug}/templates', [ServiceTemplateController::class, 'index']);
    Route::get('/services/{service:slug}/page-content', [ServicePageContentController::class, 'index']);
    Route::get('/services/{service:slug}/sections', [ServicePageSectionController::class, 'show']);
    Route::get('/services/{service:slug}/sections/history', [ServicePageSectionController::class, 'history']);
    Route::get('/services/{service:slug}/package-offers', [PackageOfferController::class, 'index']);
    Route::get('/service-categories', [ServiceCategoryController::class, 'index']);
    Route::get('/service-categories/tree', [ServiceCategoryController::class, 'tree']);
    Route::get('/features', [FeatureController::class, 'index']);
    Route::get('/features/{feature:slug}', [FeatureController::class, 'show']);
    Route::get('/navigation/header', [NavigationController::class, 'header']);
    Route::get('/navigation/footer', [NavigationController::class, 'footer']);
    Route::get('/testimonials', [TestimonialController::class, 'index']);
    Route::get('/search', [SearchController::class, 'index'])->middleware('throttle:public-api');
    Route::get('/cross-reference/{entityA}/{entityB}', [CrossReferencePageController::class, 'findByEntities']);
    Route::get('/cross-reference-pages', [CrossReferencePageController::class, 'index']);
    Route::get('/cross-reference-pages/{crossReferencePage}', [CrossReferencePageController::class, 'show']);
    Route::get('/home', HomeController::class);
    Route::get('/sitemap.xml', [SitemapController::class, 'show'])->middleware('throttle:public-api');
    Route::get('/sitemaps/{section}.xml', [SitemapController::class, 'section'])->middleware('throttle:public-api');
    Route::get('/robots.txt', fn () => response(
        "User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /admin/\nSitemap: ".rtrim((string) config('app.url'), '/')."/sitemap.xml\n",
        200,
        ['Content-Type' => 'text/plain']
    ));
    Route::get('/media/assets', [MediaLibraryController::class, 'assets']);
    Route::get('/media/folders/tree', [MediaLibraryController::class, 'foldersTree']);
    Route::post('/service-inquiries', [ServiceInquiryController::class, 'store'])->middleware('throttle:3,1');
    
    Route::get('/articles', [PublicArticleController::class, 'index']);
    Route::get('/article-pages', [ArticlePageController::class, 'index']);
    Route::get('/article-pages/{articlePage:slug}/sections/{section}', [ArticleSectionController::class, 'show'])->where('articlePage', '.*');
    Route::get('/article-pages/{articlePage:slug}/sections', [ArticleSectionController::class, 'index'])->where('articlePage', '.*');
    Route::get('/article-pages/{articlePage:slug}', [ArticlePageController::class, 'show'])->where('articlePage', '.*');
    
    Route::get('/service', [PublicServiceController::class, 'index']);
    Route::get('/service-pages', [ServicePageController::class, 'index']);
    Route::get('/service-pages/{servicePage:slug}/sections/{section}', [ServiceSectionController::class, 'show'])->where('servicePage', '.*');
    Route::get('/service-pages/{servicePage:slug}/sections', [ServiceSectionController::class, 'index'])->where('servicePage', '.*');
    Route::get('/service-pages/{servicePage:slug}', [ServicePageController::class, 'show'])->where('servicePage', '.*');
    
    Route::get('/content', [PublicContentController::class, 'index']);
    Route::get('/content-pages', [ContentPageController::class, 'index']);
    Route::get('/content-pages/{contentPage:slug}/sections/{section}', [ContentSectionController::class, 'show'])->where('contentPage', '.*');
    Route::get('/content-pages/{contentPage:slug}/sections', [ContentSectionController::class, 'index'])->where('contentPage', '.*');
    Route::get('/content-pages/{contentPage:slug}', [ContentPageController::class, 'show'])->where('contentPage', '.*');
    
    Route::get('/datahub', [PublicDataHubController::class, 'index']);
    Route::get('/datahub-pages', [DataHubPageController::class, 'index']);
    Route::get('/datahub-pages/{datahubPage:slug}/sections/{section}', [DataHubSectionController::class, 'show'])->where('datahubPage', '.*');
    Route::get('/datahub-pages/{datahubPage:slug}/sections', [DataHubSectionController::class, 'index'])->where('datahubPage', '.*');
    Route::get('/datahub-pages/{datahubPage:slug}', [DataHubPageController::class, 'show'])->where('datahubPage', '.*');
    
    Route::get('/singlepage', [PublicSinglePageController::class, 'index']);
    Route::get('/singlepage-pages', [SinglePagePageController::class, 'index']);
    Route::get('/singlepage-pages/{singlepagePage:slug}/sections/{section}', [SinglePageSectionController::class, 'show'])->where('singlepagePage', '.*');
    Route::get('/singlepage-pages/{singlepagePage:slug}/sections', [SinglePageSectionController::class, 'index'])->where('singlepagePage', '.*');
    Route::get('/singlepage-pages/{singlepagePage:slug}', [SinglePagePageController::class, 'show'])->where('singlepagePage', '.*');
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::get('/auth/token-info', [AuthController::class, 'tokenInfo']);
        Route::post('/auth/refresh', [AuthController::class, 'refreshToken']);

        // Admin-only routes (require admin role or specific permissions)
        Route::middleware(['auth:sanctum'])->group(function () {
            // Settings management - requires settings.manage permission
            Route::middleware(['permission:settings.manage'])->group(function () {
                Route::get('/settings', [SettingsController::class, 'index']);
                Route::get('/settings-export', [SettingsController::class, 'export']);
                Route::post('/settings-import', [SettingsController::class, 'import']);
                Route::get('/settings/audit-logs', [SettingsController::class, 'auditLogs']);
                Route::post('/settings/cache/clear', [SettingsController::class, 'clearCache']);
                Route::post('/settings/backup', [SettingsController::class, 'createBackup']);
                // These must come AFTER specific routes to avoid conflict
                Route::get('/settings/{tab}', [SettingsController::class, 'show']);
                Route::put('/settings/{tab}', [SettingsController::class, 'update']);
                Route::post('/settings/{tab}/test', [SettingsController::class, 'test']);
                Route::post('/settings/{tab}/reset', [SettingsController::class, 'reset']);
            });

            // Services management - requires services.manage permission
            // Route::middleware(['permission:services.manage'])->group(function () {
            //     Route::post('/services', [ServiceController::class, 'store']);
            //     Route::post('/services/bulk', [ServiceController::class, 'bulk']);
            //     Route::put('/services/{service:slug}', [ServiceController::class, 'update']);
            //     Route::delete('/services/{service:slug}', [ServiceController::class, 'destroy']);
            //     Route::put('/services/{service:slug}/plans', [ServicePlanController::class, 'sync']);
            //     Route::post('/services/{service:slug}/plans/bulk', [ServicePlanController::class, 'bulk']);
            //     Route::put('/services/{service:slug}/templates', [ServiceTemplateController::class, 'sync']);
            //     Route::put('/services/{service:slug}/page-content', [ServicePageContentController::class, 'sync']);
            //     Route::put('/services/{service:slug}/sections', [ServicePageSectionController::class, 'sync']);
            //     Route::post('/services/{service:slug}/sections/publish', [ServicePageSectionController::class, 'publish']);
            //     Route::post('/services/{service:slug}/sections/rollback', [ServicePageSectionController::class, 'rollback']);
            //     Route::put('/services/{service:slug}/package-offers', [PackageOfferController::class, 'sync']);
            //     Route::post('/services/{service:slug}/package-offers/bulk', [PackageOfferController::class, 'bulk']);
            //     Route::post('/service-categories', [ServiceCategoryController::class, 'store']);
            //     Route::put('/service-categories/{serviceCategory}', [ServiceCategoryController::class, 'update']);
            //     Route::delete('/service-categories/{serviceCategory}', [ServiceCategoryController::class, 'destroy']);
            //     Route::put('/service-categories/reorder', [ServiceCategoryController::class, 'reorder']);
            //     Route::post('/service-categories/bulk', [ServiceCategoryController::class, 'bulk']);
            // });

            // Service pages management - requires services.manage permission
            Route::middleware(['permission:service.manage'])->group(function () {
                Route::post('/service-pages', [ServicePageController::class, 'store']);
                Route::post('/service-pages/bulk', [ServicePageController::class, 'bulk']);
                Route::post('/service-pages/{servicePage:slug}/sections/reorder', [ServiceSectionController::class, 'reorder'])->where('servicePage', '.*');
                Route::post('/service-pages/{servicePage:slug}/sections', [ServiceSectionController::class, 'store'])->where('servicePage', '.*');
                Route::put('/service-pages/{servicePage:slug}/sections/{section}', [ServiceSectionController::class, 'update'])->where('servicePage', '.*');
                Route::delete('/service-pages/{servicePage:slug}/sections/{section}', [ServiceSectionController::class, 'destroy'])->where('servicePage', '.*');
                Route::put('/service-pages/{servicePage:slug}', [ServicePageController::class, 'update'])->where('servicePage', '.*');
                Route::delete('/service-pages/{servicePage:slug}', [ServicePageController::class, 'destroy'])->where('servicePage', '.*');

                Route::get('/service-sections/{section}/items', [ServiceItemController::class, 'index']);
                Route::post('/service-sections/{section}/items', [ServiceItemController::class, 'store']);
                Route::get('/service-sections/{section}/items/{item}', [ServiceItemController::class, 'show']);
                Route::put('/service-sections/{section}/items/{item}', [ServiceItemController::class, 'update']);
                Route::delete('/service-sections/{section}/items/{item}', [ServiceItemController::class, 'destroy']);
                Route::post('/service-sections/{section}/items/reorder', [ServiceItemController::class, 'reorder']);
                Route::post('/service-sections/{section}/items/bulk-action', [ServiceItemController::class, 'bulkAction']);
            });
    
            // Content pages management - requires content.manage permission
            Route::middleware(['permission:content.manage'])->group(function () {
                Route::post('/content-pages', [ContentPageController::class, 'store']);
                Route::post('/content-pages/bulk', [ContentPageController::class, 'bulk']);
                Route::post('/content-pages/{contentPage:slug}/sections/reorder', [ContentSectionController::class, 'reorder'])->where('contentPage', '.*');
                Route::post('/content-pages/{contentPage:slug}/sections', [ContentSectionController::class, 'store'])->where('contentPage', '.*');
                Route::put('/content-pages/{contentPage:slug}/sections/{section}', [ContentSectionController::class, 'update'])->where('contentPage', '.*');
                Route::delete('/content-pages/{contentPage:slug}/sections/{section}', [ContentSectionController::class, 'destroy'])->where('contentPage', '.*');
                Route::put('/content-pages/{contentPage:slug}', [ContentPageController::class, 'update'])->where('contentPage', '.*');
                Route::delete('/content-pages/{contentPage:slug}', [ContentPageController::class, 'destroy'])->where('contentPage', '.*');

                Route::get('/content-sections/{section}/items', [ContentItemController::class, 'index']);
                Route::post('/content-sections/{section}/items', [ContentItemController::class, 'store']);
                Route::get('/content-sections/{section}/items/{item}', [ContentItemController::class, 'show']);
                Route::put('/content-sections/{section}/items/{item}', [ContentItemController::class, 'update']);
                Route::delete('/content-sections/{section}/items/{item}', [ContentItemController::class, 'destroy']);
                Route::post('/content-sections/{section}/items/reorder', [ContentItemController::class, 'reorder']);
                Route::post('/content-sections/{section}/items/bulk-action', [ContentItemController::class, 'bulkAction']);
            });

            // DataHub pages management - requires datahub.manage permission
            Route::middleware(['permission:datahub.manage'])->group(function () {
                Route::post('/datahub-pages', [DataHubPageController::class, 'store']);
                Route::post('/datahub-pages/bulk', [DataHubPageController::class, 'bulk']);
                Route::post('/datahub-pages/{datahubPage:slug}/sections/reorder', [DataHubSectionController::class, 'reorder'])->where('datahubPage', '.*');
                Route::post('/datahub-pages/{datahubPage:slug}/sections', [DataHubSectionController::class, 'store'])->where('datahubPage', '.*');
                Route::put('/datahub-pages/{datahubPage:slug}/sections/{section}', [DataHubSectionController::class, 'update'])->where('datahubPage', '.*');
                Route::delete('/datahub-pages/{datahubPage:slug}/sections/{section}', [DataHubSectionController::class, 'destroy'])->where('datahubPage', '.*');
                Route::put('/datahub-pages/{datahubPage:slug}', [DataHubPageController::class, 'update'])->where('datahubPage', '.*');
                Route::delete('/datahub-pages/{datahubPage:slug}', [DataHubPageController::class, 'destroy'])->where('datahubPage', '.*');

                Route::get('/datahub-sections/{section}/items', [DataHubItemController::class, 'index']);
                Route::post('/datahub-sections/{section}/items', [DataHubItemController::class, 'store']);
                Route::get('/datahub-sections/{section}/items/{item}', [DataHubItemController::class, 'show']);
                Route::put('/datahub-sections/{section}/items/{item}', [DataHubItemController::class, 'update']);
                Route::delete('/datahub-sections/{section}/items/{item}', [DataHubItemController::class, 'destroy']);
                Route::post('/datahub-sections/{section}/items/reorder', [DataHubItemController::class, 'reorder']);
                Route::post('/datahub-sections/{section}/items/bulk-action', [DataHubItemController::class, 'bulkAction']);
            });

            // SinglePage pages management - requires singlepage.manage permission
            Route::middleware(['permission:singlepage.manage'])->group(function () {
                Route::post('/singlepage-pages', [SinglePagePageController::class, 'store']);
                Route::post('/singlepage-pages/bulk', [SinglePagePageController::class, 'bulk']);
                Route::post('/singlepage-pages/{singlepagePage:slug}/sections/reorder', [SinglePageSectionController::class, 'reorder'])->where('singlepagePage', '.*');
                Route::post('/singlepage-pages/{singlepagePage:slug}/sections', [SinglePageSectionController::class, 'store'])->where('singlepagePage', '.*');
                Route::put('/singlepage-pages/{singlepagePage:slug}/sections/{section}', [SinglePageSectionController::class, 'update'])->where('singlepagePage', '.*');
                Route::delete('/singlepage-pages/{singlepagePage:slug}/sections/{section}', [SinglePageSectionController::class, 'destroy'])->where('singlepagePage', '.*');
                Route::put('/singlepage-pages/{singlepagePage:slug}', [SinglePagePageController::class, 'update'])->where('singlepagePage', '.*');
                Route::delete('/singlepage-pages/{singlepagePage:slug}', [SinglePagePageController::class, 'destroy'])->where('singlepagePage', '.*');

                Route::get('/singlepage-sections/{section}/items', [SinglePageItemController::class, 'index']);
                Route::post('/singlepage-sections/{section}/items', [SinglePageItemController::class, 'store']);
                Route::get('/singlepage-sections/{section}/items/{item}', [SinglePageItemController::class, 'show']);
                Route::put('/singlepage-sections/{section}/items/{item}', [SinglePageItemController::class, 'update']);
                Route::delete('/singlepage-sections/{section}/items/{item}', [SinglePageItemController::class, 'destroy']);
                Route::post('/singlepage-sections/{section}/items/reorder', [SinglePageItemController::class, 'reorder']);
                Route::post('/singlepage-sections/{section}/items/bulk-action', [SinglePageItemController::class, 'bulkAction']);
            });

            // Articles pages management - requires articles.manage permission
            Route::middleware(['permission:articles.manage'])->group(function () {
                Route::post('/article-pages', [ArticlePageController::class, 'store']);
                Route::post('/article-pages/bulk', [ArticlePageController::class, 'bulk']);
                Route::post('/article-pages/{articlePage:slug}/sections/reorder', [ArticleSectionController::class, 'reorder'])->where('articlePage', '.*');
                Route::post('/article-pages/{articlePage:slug}/sections', [ArticleSectionController::class, 'store'])->where('articlePage', '.*');
                Route::put('/article-pages/{articlePage:slug}/sections/{section}', [ArticleSectionController::class, 'update'])->where('articlePage', '.*');
                Route::delete('/article-pages/{articlePage:slug}/sections/{section}', [ArticleSectionController::class, 'destroy'])->where('articlePage', '.*');
                Route::put('/article-pages/{articlePage:slug}', [ArticlePageController::class, 'update'])->where('articlePage', '.*');
                Route::delete('/article-pages/{articlePage:slug}', [ArticlePageController::class, 'destroy'])->where('articlePage', '.*');

                Route::get('/article-sections/{section}/items', [ArticleItemController::class, 'index']);
                Route::post('/article-sections/{section}/items', [ArticleItemController::class, 'store']);
                Route::get('/article-sections/{section}/items/{item}', [ArticleItemController::class, 'show']);
                Route::put('/article-sections/{section}/items/{item}', [ArticleItemController::class, 'update']);
                Route::delete('/article-sections/{section}/items/{item}', [ArticleItemController::class, 'destroy']);
                Route::post('/article-sections/{section}/items/reorder', [ArticleItemController::class, 'reorder']);
                Route::post('/article-sections/{section}/items/bulk-action', [ArticleItemController::class, 'bulkAction']);
            });

            // Media library management - requires media.manage permission
            Route::middleware(['permission:media.manage'])->group(function () {
                Route::post('/media/folders', [MediaLibraryController::class, 'createFolder']);
                Route::put('/media/folders/{mediaFolder}', [MediaLibraryController::class, 'updateFolder']);
                Route::delete('/media/folders/{mediaFolder}', [MediaLibraryController::class, 'deleteFolder']);
                Route::put('/media/assets/bulk-upsert', [MediaLibraryController::class, 'bulkUpsertAssets']);
                Route::post('/media/assets/bulk-action', [MediaLibraryController::class, 'bulkAssetAction']);
            });

            // User management - requires users.manage permission (admins only)
            Route::middleware(['permission:users.manage'])->group(function () {
                Route::get('/users', [UserController::class, 'index']);
                Route::get('/users/permissions', [UserController::class, 'listPermissions']);
                Route::get('/users/roles', [UserController::class, 'listRoles']);
                Route::get('/users/{user}', [UserController::class, 'show']);
                Route::post('/users', [UserController::class, 'store']);
                Route::put('/users/{user}', [UserController::class, 'update']);
                Route::delete('/users/{user}', [UserController::class, 'destroy']);
                Route::post('/users/{user}/change-password', [UserController::class, 'changePassword']);
                Route::post('/users/{user}/revoke-tokens', [UserController::class, 'revokeTokens']);
            });

            // AI generation - requires ai.use permission
            Route::middleware(['permission:ai.use', 'throttle:ai-generation'])->group(function () {
                Route::post('/ai/generate', [AiContentController::class, 'generate']);
                Route::post('/ai/generate-stream', [AiContentController::class, 'generateStream']);
                Route::post('/ai/bulk-generate', [AiContentController::class, 'bulkGenerate']);
                Route::get('/ai/job/{contentGenerationJob}', [AiContentController::class, 'jobStatus']);
                Route::post('/ai/suggest-links', [AiContentController::class, 'suggestLinks']);
                Route::post('/ai/find-gaps', [AiContentController::class, 'findGaps']);
                Route::post('/ai/generate-seo', [AiContentController::class, 'generateSeo']);
                Route::post('/ai/generate-faq', [AiContentController::class, 'generateFaq']);
            });

            // Analytics - requires analytics.view permission
            Route::middleware(['permission:analytics.view'])->group(function () {
                Route::get('/audit-logs', [AuditLogController::class, 'index']);
            });

            // Additional management routes (require services.manage by default)
            Route::middleware(['permission:services.manage'])->group(function () {
                Route::post('/features', [FeatureController::class, 'store']);
                Route::put('/features/{feature:slug}', [FeatureController::class, 'update']);
                Route::delete('/features/{feature:slug}', [FeatureController::class, 'destroy']);
                Route::apiResource('cross-reference-pages', CrossReferencePageController::class)->only(['store', 'update', 'destroy']);
                Route::post('/cross-reference-pages/{crossReferencePage}/publish', [CrossReferencePageController::class, 'publish']);
                Route::post('/cross-reference-pages/{crossReferencePage}/draft', [CrossReferencePageController::class, 'draft']);
                Route::apiResource('testimonials', TestimonialController::class)->except(['index', 'show','create', 'edit']);
                Route::apiResource('faqs', FAQController::class)->except(['create', 'edit']);
                Route::put('/faqs/reorder', [FAQController::class, 'reorder']);
                Route::apiResource('process-steps', ProcessStepController::class)->except(['create', 'edit']);
                Route::put('/process-steps/reorder', [ProcessStepController::class, 'reorder']);
                Route::apiResource('use-cases', UseCaseController::class)->except(['create', 'edit']);
                Route::apiResource('redirects', RedirectController::class)->except(['create', 'edit']);
            });

            // Navigation management - requires services.manage permission
            Route::middleware(['permission:services.manage'])->group(function () {
                Route::get('/navigation', [NavigationController::class, 'index']);
                Route::get('/navigation/{navigationMenu}', [NavigationController::class, 'show']);
                Route::post('/navigation/menus', [NavigationController::class, 'storeMenu']);
                Route::put('/navigation/menus/{navigationMenu}', [NavigationController::class, 'updateMenu']);
                Route::delete('/navigation/menus/{navigationMenu}', [NavigationController::class, 'destroyMenu']);
                Route::post('/navigation/items', [NavigationController::class, 'storeItem']);
                Route::put('/navigation/items/{navigationItem}', [NavigationController::class, 'updateItem']);
                Route::delete('/navigation/items/{navigationItem}', [NavigationController::class, 'destroyItem']);
                Route::put('/navigation/items/reorder', [NavigationController::class, 'reorderItems']);
                Route::apiResource('seo-metadata', SeoMetadataController::class)->except(['create', 'edit']);
                Route::put('/seo-metadata/bulk-update', [SeoMetadataController::class, 'bulkUpdate']);
            });

            // Content items - requires content.manage permission
            Route::middleware(['permission:content.manage'])->group(function () {
                Route::post('/upload', [\App\Http\Controllers\Api\UploadController::class, 'upload']);
                Route::get('/content-sections/{section}/items', [ContentItemController::class, 'index']);
                Route::post('/content-sections/{section}/items', [ContentItemController::class, 'store']);
                Route::get('/content-sections/{section}/items/{item}', [ContentItemController::class, 'show']);
                Route::put('/content-sections/{section}/items/{item}', [ContentItemController::class, 'update']);
                Route::delete('/content-sections/{section}/items/{item}', [ContentItemController::class, 'destroy']);
                Route::post('/content-sections/{section}/items/reorder', [ContentItemController::class, 'reorder']);
                Route::post('/content-sections/{section}/items/bulk-action', [ContentItemController::class, 'bulkAction']);
            });

            // AI tools (read-only) - requires ai.use permission
            Route::middleware(['permission:ai.use'])->group(function () {
                Route::get('/content-gaps', [ContentGapController::class, 'index']);
                Route::post('/content-gaps/bulk-generate', [ContentGapController::class, 'bulkGenerate']);
                Route::post('/content-gaps/{contentGap}/mark-created', [ContentGapController::class, 'markCreated']);
                Route::post('/content-gaps/{contentGap}/mark-ignored', [ContentGapController::class, 'markIgnored']);
                Route::get('/internal-links', [InternalLinkController::class, 'index']);
                Route::post('/internal-links/auto-scan', [InternalLinkController::class, 'autoScan']);
                Route::post('/internal-links/{internalLink}/confirm', [InternalLinkController::class, 'confirm']);
                Route::delete('/internal-links/{internalLink}/reject', [InternalLinkController::class, 'reject']);
            });
        });
    });
});
