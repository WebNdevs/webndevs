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

function testController($name, $controllerClass) {
    echo "==========================================" . PHP_EOL;
    echo "  $name" . PHP_EOL;
    echo "==========================================" . PHP_EOL;
    $controller = new $controllerClass();
    $response = $controller->index();
    $data = $response->getData(true);
    foreach ($data as $key => $pages) {
        echo "Root Key: '$key' | Count: " . count($pages) . PHP_EOL;
        foreach ($pages as $path => $pageData) {
            $sections = is_array($pageData) ? implode(', ', array_keys($pageData)) : 'none';
            echo "  Path: '$path' => Sections: [$sections]" . PHP_EOL;
        }
    }
    echo PHP_EOL;
}

testController("PUBLIC CONTENT CONTROLLER", \App\Http\Controllers\Api\PublicContentController::class);
testController("PUBLIC SERVICE CONTROLLER", \App\Http\Controllers\Api\PublicServiceController::class);
testController("PUBLIC DATAHUB CONTROLLER", \App\Http\Controllers\Api\PublicDataHubController::class);
testController("PUBLIC SINGLEPAGE CONTROLLER", \App\Http\Controllers\Api\PublicSinglePageController::class);
testController("PUBLIC ARTICLE CONTROLLER", \App\Http\Controllers\Api\PublicArticleController::class);
