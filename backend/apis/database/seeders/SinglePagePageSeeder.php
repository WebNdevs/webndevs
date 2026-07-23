<?php

namespace Database\Seeders;

use App\Models\SinglePagePage;
use App\Models\SinglePageSection;
use Illuminate\Database\Seeder;

class SinglePagePageSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Home page
        $homePage = SinglePagePage::query()->updateOrCreate(
            ['slug' => '/tools'],
            [
                'title' => 'Tools',
                'slug' => '/tools',
                'category_slug' => '/general',
                'status' => 'published',
                'seo_title' => 'WebNDevs',
                'seo_description' => 'Read our latest articles, insights, and tech tutorials.',
                'meta_keywords' => 'Blog, Development, Technology',
            ]
        );

        $this->seedPageSections($homePage->id, 'OUR HOME', 'WebNDevs', 'Tech guides and insights from our team.');

        // 2. Create SinglePage page
        $singlepagePage = SinglePagePage::query()->updateOrCreate(
            ['slug' => '/free-tools'],
            [
                'title' => 'Free Tools',
                'slug' => '/free-tools',
                'category_slug' => '/tools',
                'status' => 'published',
                'seo_title' => 'Our SinglePage | WebNDevs',
                'seo_description' => 'Explore customer success stories and software project outcomes.',
                'meta_keywords' => 'Case Studies, Software engineering, Success Stories',
            ]
        );

        $this->seedPageSections($singlepagePage->id, 'DATAHUB', 'Client Success Stories', 'Detailed outcomes of our software and development projects.');
    }

    private function seedPageSections(int $pageId, string $heroTag, string $heroTitle, string $heroDesc): void
    {
        // Hero section
        $this->createSection($pageId, 'hero', 'hero', [
            'tag' => $heroTag,
            'title1' => $heroTitle,
            'title2' => '& Insights',
            'description' => $heroDesc,
        ]);

        // Header section
        $this->createSection($pageId, 'header', 'header', [
            'tag' => 'RESOURCES',
            'subheading1' => 'Our Collection',
            'subheading2' => 'Of Expert SinglePages',
            'subtext' => 'Learn how we design, build, and optimize products.',
        ]);

        // Benefits section
        $this->createSection($pageId, 'benefits', 'items', [
            'tag' => "Why Us?",
            'subheading1' => "Why Choose",
            'subheading2' => "WebNDevs?",
            'subtext' => "We're not just another agency. We're the reliable digital partner you can count on for the long haul.",
            'items' => [
                [
                    'icon' => "Users",
                    'title' => "One Team for Everything",
                    'description' => "No more coordinating between designers, developers, and marketers. We handle it all seamlessly under one roof.",
                ],
            ]        
            ]);

        // Comparison section
        $this->createSection($pageId, 'comparison', 'items', [
          'title' => "ChatGPT vs Claude",
          'tag' => "Artificial Intelligence",
          'description' => "Compare our products side-by-side to find the best fit for your business.",
            'items' => [
                'leftHeading' => "Traditional Approach",
                'rightHeading' => "The WebNDevs Way",
                'leftPoints' => [
                    "Hire separate freelancers for each task",
                    "Manage multiple contracts and invoices",
                    "Hope everyone communicates properly",
                    "Deal with inconsistent quality and delays",
                    "Rebuild from scratch when you need changes",
                ],
                'rightPoints' => [
                    "One expert team handles everything",
                    "Single point of contact, simple billing",
                    "Seamless collaboration built into our process",
                    "Consistent quality and on-time delivery",
                    "Scalable solutions that grow with you",
                ],
            ],
        ]);

        // featured section
        $this->createSection($pageId, 'featured', 'items', [
            'tag' => "Our Process",
            'subheading1' => "From Idea to Launch in",
            'subheading2' => "5 Simple Steps",
            'subtext' => "Our proven process ensures your project is delivered on time, on budget, and exceeds expectations.",
            'items' => [
                [
                    'title' => "Sabzithela",
                    'icon' => "Users",
                    'badge' => "featured",
                    'description' => "Designed and developed an online grocery platform for fresh vegetables, fruits, and daily essentials, enabling customers to conveniently order farm-fresh produce with a seamless shopping experience.",
                    'tags' => ["E-Commerce", "WordPress", "Online Grocery"],
                    'href' => "https://sabzithela.com"
                ],
            ],
        ]);

        //Stats section
        $this->createSection($pageId, 'stats', 'stats', [
            [
                [ 'value' => '50+', 'title' => 'Projects Completed' ],
                [ 'value' => '98%', 'title' => 'Client Satisfaction' ],
                [ 'value' => '2.5x', 'title' => 'Average ROI Increase' ],
                [ 'value' => '24/7', 'title' => 'Support Available' ],
            ]
        ]);

        // directory section
        $this->createSection($pageId, 'directory', 'items', [
            'tag' => "Tool Directory",
            'subheading1' => "Browse",
            'subheading2' => "All Free Tools",
            'subtext' => "Find free online tools organized by category.",
            'items' => [
                [
                    'title' => "Sabzithela",
                    'icon' => "Users",
                    'badge' => "featured",
                    'description' => "Designed and developed an online grocery platform for fresh vegetables, fruits, and daily essentials, enabling customers to conveniently order farm-fresh produce with a seamless shopping experience.",
                    'tags' => ["E-Commerce", "WordPress", "Online Grocery"],
                    'href' => "https://sabzithela.com"
                ],
            ],
        ]);

        // FAQ section
        $this->createSection($pageId, 'faq', 'items', [
            'tag' => "FAQs",
            'subheading1' => "Frequently Asked",
            'subheading2' => "Questions",
            'subtext' => "Answers to common questions about our services and development process.",
            'items' => [
                [
                    'question' => "Do you provide end-to-end project development?",
                    'answer' => "Yes. From discovery and UI/UX design to development, deployment, testing, and ongoing maintenance, we manage the complete project lifecycle."
                ],
            ],
        ]);

        // CTA section
        $this->createSection($pageId, 'cta', 'cta', [
            'preview' => [
                'text' => 'Talk to an Expert',
                'url' => '/contact',
            ],
            'full' => [
                'description' => 'Have a project in mind? Let\'s discuss how we can build it together.',
                'text' => 'Get in Touch',
                'url' => '/contact',
            ],
        ]);
    }

    private function createSection(int $pageId, string $sectionKey, string $sectionType, array $data): SinglePageSection
    {
        return SinglePageSection::query()->updateOrCreate(
            [
                'singlepage_page_id' => $pageId,
                'section_key' => $sectionKey,
            ],
            [
                'section_type' => $sectionType,
                'is_visible' => true,
                'sort_order' => match($sectionKey) {
                    'hero' => 0,
                    'header' => 1,
                    'stats' => 2,
                    'comparison' => 3,
                    'featured' => 4,
                    'directory' => 5,
                    'benefits' => 6,
                    'faq' => 7,
                    'cta' => 8,
                    default => 9
                },
                'data' => $data,
            ]
        );
    }
}
