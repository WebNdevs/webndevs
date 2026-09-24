<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

config([
    'database.default' => 'sqlite',
    'database.connections.sqlite' => [
        'driver' => 'sqlite',
        'database' => __DIR__ . '/database/database.sqlite',
        'prefix' => '',
        'foreign_key_constraints' => true,
    ],
]);

$tables = [
    'content_pages', 'content_sections', 'content_items',
    'service_pages', 'service_sections', 'service_items',
    'datahub_pages', 'datahub_sections', 'datahub_items',
    'singlepage_pages', 'singlepage_sections', 'singlepage_items',
    'article_pages', 'article_sections', 'article_items',
    'services', 'service_plans', 'service_templates', 'service_page_contents', 'service_page_sections',
    'articles'
];

foreach ($tables as $table) {
    if (Illuminate\Support\Facades\Schema::hasTable($table)) {
        echo "=== TABLE: $table ===" . PHP_EOL;
        $rows = DB::table($table)->get();
        echo "Count: " . count($rows) . PHP_EOL;
        foreach ($rows as $r) {
            echo json_encode($r, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . PHP_EOL;
        }
        echo PHP_EOL;
    }
}
