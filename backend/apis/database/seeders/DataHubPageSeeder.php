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

        // Seeding data for DataHub Module: "/tools" (Tools)
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

        $this->createSection($page->id, 'directory', 'directory', 2, [
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

        // Seeding data for DataHub Module: "/solutions"
        $solutionsPage = DataHubPage::query()->updateOrCreate(
            ['slug' => '/solutions'],
            [
                'title' => 'Solutions',
                'slug' => '/solutions',
                'status' => 'published',
                'seo_title' => 'Enterprise Software & Tech Business Solutions | WebNDevs',
                'seo_description' => 'Discover customized enterprise software systems, CRM solutions, cloud database infrastructures, and custom integrations.',
                'meta_keywords' => 'Solutions, Enterprise Software, CRM, Systems Integration',
                'updated_by' => $admin?->id,
            ]
        );

        $this->createSection($solutionsPage->id, 'hero', 'hero', 0, [
            'tag' => 'ENTERPRISE SOLUTIONS',
            'title1' => 'Custom Business',
            'title2' => 'Software Solutions',
            'description' => 'Tailored CRM systems, ERP integrations, and enterprise web architecture built for scaling companies.',
        ], $admin?->id);

        $this->createSection($solutionsPage->id, 'header', 'header', 1, [
            'tag' => 'SOLUTIONS DIRECTORY',
            'subheading1' => 'Bespoke Software',
            'subheading2' => '& System Architectures',
            'subtext' => 'Accelerate digital transformation with proven corporate software blueprints.',
        ], $admin?->id);

        $this->createSection($solutionsPage->id, 'directory', 'directory', 2, [
            'tag' => 'FEATURED SOLUTIONS',
            'subheading1' => 'Enterprise Solution',
            'subheading2' => 'Catalog',
            'subtext' => 'Explore our specialized solution modules.',
            'items' => [
                [
                    'icon' => 'TrendingUp',
                    'title' => 'Custom CRM Solutions',
                    'description' => 'Streamline sales pipelines, client support workflows, and lead nurturing.',
                    'href' => '/solutions/crm-solutions',
                    'is_featured' => true,
                ],
            ],
        ], $admin?->id);

        $this->createSection($solutionsPage->id, 'cta', 'cta', 3, [
            'preview' => [
                'text' => 'Discuss Your Solution Needs',
                'url' => '/contact',
            ],
            'full' => [
                'text' => 'Architect Your Custom Solution',
                'description' => 'Consult with our senior solution architects to evaluate your business requirements.',
                'url' => '/contact',
            ],
        ], $admin?->id);

        // Seeding data for DataHub Module: "/industries"
        $industriesPage = DataHubPage::query()->updateOrCreate(
            ['slug' => '/industries'],
            [
                'title' => 'Industries',
                'slug' => '/industries',
                'status' => 'published',
                'seo_title' => 'Industry-Specific Software & Tech Solutions | WebNDevs',
                'seo_description' => 'Tailored digital products for Healthcare, Real Estate, E-Commerce, Finance, and Education.',
                'meta_keywords' => 'Industries, Healthcare Software, FinTech, Real Estate Tech',
                'updated_by' => $admin?->id,
            ]
        );

        $this->createSection($industriesPage->id, 'hero', 'hero', 0, [
            'tag' => 'DOMAINS & VERTICALS',
            'title1' => 'Industry-Specific',
            'title2' => 'Software Solutions',
            'description' => 'Specialized software applications engineered for domain-specific compliance and growth.',
        ], $admin?->id);

        $this->createSection($industriesPage->id, 'header', 'header', 1, [
            'tag' => 'INDUSTRY DIRECTORY',
            'subheading1' => 'Domain Solutions',
            'subheading2' => '& Expertise',
            'subtext' => 'Building high-converting platforms tailored to your industry standards.',
        ], $admin?->id);

        $this->createSection($industriesPage->id, 'cta', 'cta', 2, [
            'preview' => [
                'text' => 'Consult an Industry Specialist',
                'url' => '/contact',
            ],
            'full' => [
                'text' => 'Build for Your Industry Vertical',
                'description' => 'Schedule a call with engineers experienced in your market domain.',
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
