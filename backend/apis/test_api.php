<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$item = App\Models\ContentItem::first();
echo "Raw pro_results type: " . gettype($item->pro_results) . "\n";
echo "Raw pro_results: " . $item->pro_results . "\n\n";

$casts = $item->getCasts();
echo "Casts: " . json_encode($casts, JSON_PRETTY_PRINT) . "\n\n";

// Test Resource
$resource = new App\Http\Resources\ContentItemResource($item);
$array = $resource->toArray(request());
echo "Resource pro_results: " . json_encode($array['pro_results']) . "\n";
