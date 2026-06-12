<?php

namespace Database\Seeders;

use App\Models\Service;
use App\Models\User;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::query()->where('email', 'admin@wnd.local')->first();

        $services = [
            [
                'name' => 'Web Development',
                'slug' => 'web-development',
                'category' => 'Web Development',
                'base_price' => 1500,
                'status' => 'active',
                'description' => 'Custom websites and web applications.',
                'features' => ['Custom design', 'Responsive layout', 'CMS integration', 'SEO ready'],
                'projects_completed' => 48,
            ],
            [
                'name' => 'UI/UX Design',
                'slug' => 'ui-ux-design',
                'category' => 'UI/UX Design',
                'base_price' => 800,
                'status' => 'active',
                'description' => 'User-focused interface and product design.',
                'features' => ['Wireframing', 'Prototyping', 'Design systems'],
                'projects_completed' => 61,
            ],
            [
                'name' => 'Mobile App Development',
                'slug' => 'mobile-app-development',
                'category' => 'Mobile Apps',
                'base_price' => 5000,
                'status' => 'active',
                'description' => 'Cross-platform and native app development.',
                'features' => ['React Native', 'iOS', 'Android', 'Store deployment'],
                'projects_completed' => 19,
            ],
            [
                'name' => 'Branding',
                'slug' => 'branding',
                'category' => 'Branding',
                'base_price' => 1200,
                'status' => 'active',
                'description' => 'Complete brand identity and positioning.',
                'features' => ['Logo design', 'Brand guidelines', 'Visual assets'],
                'projects_completed' => 25,
            ],

            [
                'name' => 'Digital Marketing',
                'slug' => 'digital-marketing',
                'category' => 'Digital Marketing',
                'base_price' => 1300,
                'status' => 'active',
                'description' => 'Comprehensive digital marketing strategies.',
                'features' => ['SEO', 'PPC', 'Social media marketing', 'Email campaigns'],
                'projects_completed' => 32,
            ],

            [
                'name' => 'Data Analytics',
                'slug' => 'data-analytics',
                'category' => 'Data Analytics',
                'base_price' => 2000,
                'status' => 'active',
                'description' => 'In-depth data analysis and reporting.',
                'features' => ['Data visualization', 'Predictive analytics', 'Custom reports'],
                'projects_completed' => 15,
            ],
        ];

        foreach ($services as $service) {
            Service::query()->updateOrCreate(
                ['slug' => $service['slug']],
                [
                    ...$service,
                    'created_by' => $admin?->id,
                ]
            );
        }
    }
}
