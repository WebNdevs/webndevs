<?php

use App\Http\Resources\ContentItemResource;
use App\Models\ContentItem;
use Illuminate\Contracts\Console\Kernel;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Kernel::class);
$kernel->bootstrap();

$item = ContentItem::first();
echo 'Raw pro_results type: '.gettype($item->pro_results)."\n";
echo 'Raw pro_results: '.$item->pro_results."\n\n";

$casts = $item->getCasts();
echo 'Casts: '.json_encode($casts, JSON_PRETTY_PRINT)."\n\n";

// Test Resource
$resource = new ContentItemResource($item);
$array = $resource->toArray(request());
echo 'Resource pro_results: '.json_encode($array['pro_results'])."\n";
