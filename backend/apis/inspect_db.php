<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Force sqlite database connection to database/database.sqlite
config([
    'database.default' => 'sqlite',
    'database.connections.sqlite' => [
        'driver' => 'sqlite',
        'database' => __DIR__ . '/database/database.sqlite',
        'prefix' => '',
        'foreign_key_constraints' => true,
    ],
]);

function dumpTable($title, $modelClass) {
    echo "=== $title ===" . PHP_EOL;
    if (!class_exists($modelClass)) {
        echo "Class $modelClass does not exist." . PHP_EOL;
        return;
    }
    try {
        $pages = $modelClass::all();
        echo "Count: " . count($pages) . PHP_EOL;
        foreach ($pages as $p) {
            $cat = isset($p->category_slug) ? " | CatSlug: '{$p->category_slug}'" : "";
            $status = isset($p->status) ? " | Status: '{$p->status}'" : "";
            echo "ID: {$p->id} | Title: '{$p->title}' | Slug: '{$p->slug}'{$cat}{$status}" . PHP_EOL;
        }
    } catch (\Throwable $e) {
        echo "Error querying {$title}: " . $e->getMessage() . PHP_EOL;
    }
    echo PHP_EOL;
}

dumpTable("CONTENT PAGES (ContentPage)", \App\Models\ContentPage::class);
dumpTable("SERVICE PAGES (ServicePage)", \App\Models\ServicePage::class);
dumpTable("DATAHUB PAGES (DataHubPage)", \App\Models\DataHubPage::class);
dumpTable("SINGLEPAGE PAGES (SinglePagePage)", \App\Models\SinglePagePage::class);
dumpTable("ARTICLE PAGES (ArticlePage)", \App\Models\ArticlePage::class);
dumpTable("LEGACY SERVICES (Service)", \App\Models\Service::class);
