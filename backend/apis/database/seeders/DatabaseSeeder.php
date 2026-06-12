<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->updateOrCreate([
            'email' => 'admin@wnd.local',
        ], [
            'name' => 'WND Admin',
            'password' => Hash::make('password123'),
            'is_admin' => true,
        ]);

        User::query()->updateOrCreate([
            'email' => 'editor@wnd.local',
        ], [
            'name' => 'WND Editor',
            'password' => Hash::make('password123'),
            'is_admin' => false,
        ]);

        $this->call([
            ServiceSeeder::class,
            ContentPageSeeder::class,
            BlogPostSeeder::class,
            ServicePlanSeeder::class,
            ProgrammaticContentSeeder::class,
        ]);
    }
}
