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

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Database\Seeders\ContentPageSeeder;
use Database\Seeders\SinglePagePageSeeder;
use Database\Seeders\DataHubPageSeeder;
use Database\Seeders\ServicePageSeeder;
use Database\Seeders\ServicePlanSeeder;
use Database\Seeders\ArticlePageSeeder;

$admin = User::query()->updateOrCreate([
    'email' => 'admin@wnd.local',
], [
    'name' => 'WND Admin',
    'password' => Hash::make('password123'),
    'is_admin' => true,
]);

echo "Admin user created/found: ID {$admin->id}" . PHP_EOL;

$seeders = [
    ContentPageSeeder::class,
    SinglePagePageSeeder::class,
    DataHubPageSeeder::class,
    ServicePageSeeder::class,
    ServicePlanSeeder::class,
    ArticlePageSeeder::class,
];

foreach ($seeders as $seederClass) {
    echo "Running $seederClass..." . PHP_EOL;
    try {
        $seeder = new $seederClass();
        $seeder->run();
        echo "  [DONE]" . PHP_EOL;
    } catch (\Throwable $e) {
        echo "  [ERROR]: " . $e->getMessage() . PHP_EOL;
    }
}
