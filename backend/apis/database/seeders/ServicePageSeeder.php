<?php

namespace Database\Seeders;

use App\Models\ServicePage;
use App\Models\ServiceSection;
use App\Models\User;
use Illuminate\Database\Seeder;

class ServicePageSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::query()->where('email', 'admin@wnd.local')->first();

        // Single complete seeding data for Service Module: "/web-development" (Web Development)
        $page = ServicePage::query()->updateOrCreate(
            ['slug' => '/web-development'],
            [
                'title' => 'Web Development',
                'slug' => '/web-development',
                'status' => 'published',
                'seo_title' => 'Web Development Services | Service Module',
                'seo_description' => 'Custom web application development, frontend engineering, and backend API integration services.',
                'meta_keywords' => 'Web Development, React, Laravel, Full Stack',
                'updated_by' => $admin?->id,
            ]
        );

        // Seed all sections cleanly aligned with Service Module structure
        $this->createSection($page->id, 'hero', 'hero', 0, [
            'tag' => 'CORE SERVICE',
            'title1' => 'Custom Web Application',
            'title2' => '& Software Development',
            'description' => 'We engineer scalable web applications with Next.js, React, and Laravel tailored to your exact operational requirements.',
        ], $admin?->id);

        $this->createSection($page->id, 'header', 'header', 1, [
            'tag' => 'CAPABILITIES',
            'subheading1' => 'Full-Stack Web',
            'subheading2' => 'Development Services',
            'subtext' => 'From responsive user interfaces to resilient database backends and cloud APIs.',
        ], $admin?->id);

        $this->createSection($page->id, 'plans', 'plans', 2, [
            'tag' => 'SERVICE PACKAGES',
            'subheading1' => 'Flexible Service',
            'subheading2' => 'Plans & Packages',
            'subtext' => 'Choose a development engagement model suited to your team size and timeline.',
            'items' => [
                [
                    'title' => 'Starter Development MVP',
                    'price' => '$2,999',
                    'period' => 'one-time',
                    'description' => 'Ideal for launching rapid web applications and proof-of-concept MVPs.',
                    'features' => [
                        'Custom React / Vite Single-Page Application',
                        'RESTful API Backend setup with Laravel',
                        'Basic CI/CD pipeline and deployment configuration',
                    ],
                ],
                [
                    'title' => 'Enterprise Full-Stack Sprint',
                    'price' => '$7,499',
                    'period' => 'per sprint',
                    'description' => 'Dedicated engineering team for complex full-stack web platforms.',
                    'features' => [
                        'Next.js Server-Side Rendering & Programmatic SEO',
                        'Advanced database design with migration suites',
                        '24/7 Monitoring & uptime guarantee',
                    ],
                ],
            ],
        ], $admin?->id);

        $this->createSection($page->id, 'cta', 'cta', 3, [
            'preview' => [
                'text' => 'Book a Web Development Call',
                'url' => '/contact',
            ],
            'full' => [
                'text' => 'Start Your Web Development Project',
                'description' => 'Discuss your web development specifications with our lead software architects today.',
                'url' => '/contact',
            ],
        ], $admin?->id);
    }

    private function createSection(int $pageId, string $sectionKey, string $sectionType, int $sortOrder, array $data, ?int $adminId): ServiceSection
    {
        return ServiceSection::query()->updateOrCreate(
            [
                'service_page_id' => $pageId,
                'section_key' => $sectionKey,
            ],
            [
                'section_type' => $sectionType,
                'data' => $data,
                'is_visible' => true,
                'sort_order' => $sortOrder,
                'updated_by' => $adminId,
            ]
        );
    }
}
