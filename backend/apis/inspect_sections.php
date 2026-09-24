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

function inspectModel($title, $modelClass, $sectionRelation) {
    echo "==========================================" . PHP_EOL;
    echo "  $title" . PHP_EOL;
    echo "==========================================" . PHP_EOL;
    if (!class_exists($modelClass)) return;

    $pages = $modelClass::with([$sectionRelation . '.items'])->get();
    foreach ($pages as $p) {
        $cat = isset($p->category_slug) ? " (Cat: {$p->category_slug})" : "";
        echo "PAGE ID: {$p->id} | Title: '{$p->title}' | Slug: '{$p->slug}'{$cat}" . PHP_EOL;
        $sections = $p->$sectionRelation;
        if (!$sections || count($sections) === 0) {
            echo "  [No sections found]" . PHP_EOL;
        } else {
            foreach ($sections as $s) {
                $itemCount = count($s->items);
                $dataKeys = is_array($s->data) ? implode(', ', array_keys($s->data)) : 'none';
                echo "  -> SECTION ID: {$s->id} | Key: '{$s->section_key}' | Type: '{$s->section_type}' | Visible: " . ($s->is_visible ? 'YES' : 'NO') . " | Items: {$itemCount} | DataKeys: [{$dataKeys}]" . PHP_EOL;
            }
        }
        echo PHP_EOL;
    }
}

inspectModel("CONTENT PAGES", \App\Models\ContentPage::class, "sectionItems");
inspectModel("SERVICE PAGES", \App\Models\ServicePage::class, "sectionItems");
inspectModel("DATAHUB PAGES", \App\Models\DataHubPage::class, "sectionItems");
inspectModel("SINGLEPAGE PAGES", \App\Models\SinglePagePage::class, "sectionItems");
inspectModel("ARTICLE PAGES", \App\Models\ArticlePage::class, "sectionItems");
