<?php

namespace Database\Seeders;

use App\Models\SinglePagePage;
use App\Models\SinglePageSection;
use App\Models\User;
use Illuminate\Database\Seeder;

class SinglePagePageSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::query()->where('email', 'admin@wnd.local')->first();

        // Single complete seeding data for SinglePage Module: "/crm-solutions" under solutions category
        $page = SinglePagePage::query()->updateOrCreate(
            ['slug' => '/crm-solutions'],
            [
                'title' => 'CRM Solutions',
                'category_slug' => 'solutions',
                'status' => 'published',
                'seo_title' => 'CRM Solutions & Integration | SinglePage Module',
                'seo_description' => 'Custom CRM software integration, lead pipeline automation, and customer analytics platforms.',
                'meta_keywords' => 'CRM, Solutions, Software, Integration, WebNDevs',
                'updated_by' => $admin?->id,
            ]
        );

        // Seed all sections cleanly aligned with SinglePage Module structure
        $this->createSection($page->id, 'hero', 'hero', 0, [
            'tag' => 'SOLUTIONS CATEGORY',
            'title1' => 'Custom CRM Solutions &',
            'title2' => 'Customer Platforms',
            'description' => 'Streamline sales pipelines, client support workflows, and customer communication with custom CRM integrations.',
        ], $admin?->id);

        $this->createSection($page->id, 'header', 'header', 1, [
            'tag' => 'CRM FEATURES',
            'subheading1' => 'Automated Customer',
            'subheading2' => 'Relationship Tools',
            'subtext' => 'Empower sales and operations teams with real-time deal tracking and communication logs.',
        ], $admin?->id);

        $this->createSection($page->id, 'features', 'items', 2, [
            'tag' => 'CORE CAPABILITIES',
            'subheading1' => 'Enterprise CRM',
            'subheading2' => 'Module Highlights',
            'subtext' => 'Key features included in our bespoke CRM solution deployments.',
            'items' => [
                [
                    'icon' => 'TrendingUp',
                    'title' => 'Visual Sales Pipeline',
                    'description' => 'Drag-and-drop deal stages with real-time deal value aggregation and stage probabilities.',
                ],
                [
                    'icon' => 'Mail',
                    'title' => 'Automated Email Sequences',
                    'description' => 'Triggered lead nurturing sequences integrated directly with your transactional mail provider.',
                ],
            ]
        ], $admin?->id);

        $this->createSection($page->id, 'cta', 'cta', 3, [
            'preview' => [
                'text' => 'Explore CRM Solutions',
                'url' => '/contact',
            ],
            'full' => [
                'text' => 'Build a Custom CRM for Your Operations',
                'description' => 'Consult with our CRM specialists to design a customer platform tailored to your workflow.',
                'url' => '/contact',
            ]
        ], $admin?->id);
    }

    private function createSection(int $pageId, string $sectionKey, string $sectionType, int $sortOrder, array $data, ?int $adminId): SinglePageSection
    {
        return SinglePageSection::query()->updateOrCreate(
            [
                'singlepage_page_id' => $pageId,
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
