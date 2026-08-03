<?php

namespace Database\Seeders;

use App\Models\DataHubPage;
use App\Models\DataHubSection;
use App\Models\User;
use Illuminate\Database\Seeder;

class DataHubPageSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::query()->where('email', 'admin@wnd.local')->first();

        // Single complete seeding data for DataHub Module: "/tools" (Tools)
        $page = DataHubPage::query()->updateOrCreate(
            ['slug' => '/tools'],
            [
                'title' => 'Tools',
                'slug' => '/tools',
                'status' => 'published',
                'seo_title' => 'Developer Tools & Utilities | DataHub',
                'seo_description' => 'Explore curated developer tools, utilities, and programmatic integrations.',
                'meta_keywords' => 'Tools, DataHub, Utilities, WebNDevs',
                'updated_by' => $admin?->id,
            ]
        );

        // Seed all sections cleanly aligned with DataHub Module structure
        $this->createSection($page->id, 'hero', 'hero', 0, [
            'tag' => 'DATAHUB DIRECTORY',
            'title1' => 'Developer Tools &',
            'title2' => 'Software Directory',
            'description' => 'Explore production utilities, ROI calculators, schema generators, and optimization tools built for web engineering teams.',
        ], $admin?->id);

        $this->createSection($page->id, 'header', 'header', 1, [
            'tag' => 'TOOL COLLECTIONS',
            'subheading1' => 'Curated Software',
            'subheading2' => '& Utilities',
            'subtext' => 'Free and premium utilities engineered to streamline web development workflows.',
        ], $admin?->id);

        $this->createSection($page->id, 'tools', 'directory', 2, [
            'tag' => 'FEATURED TOOLS',
            'subheading1' => 'Free Online',
            'subheading2' => 'Developer Utilities',
            'subtext' => 'Use our online utility tools to generate structured data, analyze site performance, and test API integrations.',
            'items' => [
                [
                    'icon' => 'Code',
                    'title' => 'JSON Schema Validator & Generator',
                    'description' => 'Validate and format complex JSON-LD structured data for SEO compliance.',
                    'badge' => 'Free Utility',
                    'href' => '/tools/schema-validator',
                    'is_featured' => true,
                ],
                [
                    'icon' => 'Zap',
                    'title' => 'Core Web Vitals Audit Tool',
                    'description' => 'Analyze LCP, CLS, and FID performance scores with actionable diagnostic feedback.',
                    'badge' => 'Popular',
                    'href' => '/tools/web-vitals-audit',
                    'is_featured' => true,
                ],
            ],
        ], $admin?->id);

        $this->createSection($page->id, 'cta', 'cta', 3, [
            'preview' => [
                'text' => 'Request Custom Tooling',
                'url' => '/contact',
            ],
            'full' => [
                'text' => 'Need a Custom Internal Tool or Calculator?',
                'description' => 'We engineer custom web utilities, ROI calculators, and enterprise dashboards.',
                'url' => '/contact',
            ],
        ], $admin?->id);
    }

    private function createSection(int $pageId, string $sectionKey, string $sectionType, int $sortOrder, array $data, ?int $adminId): DataHubSection
    {
        return DataHubSection::query()->updateOrCreate(
            [
                'datahub_page_id' => $pageId,
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
