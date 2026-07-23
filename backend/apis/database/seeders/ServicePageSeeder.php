<?php

namespace Database\Seeders;

use App\Models\ServicePage;
use App\Models\ServiceSection;
use Illuminate\Database\Seeder;

class ServicePageSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Web Development page
        $webDevelopmentPage = ServicePage::query()->updateOrCreate(
            ['slug' => '/web-development'],
            [
                'title' => 'Web Development',
                'slug' => '/web-development',
                'status' => 'published',
                'seo_title' => 'WebNDevs',
                'seo_description' => 'Read our latest articles, insights, and tech tutorials.',
                'meta_keywords' => 'Blog, Development, Technology',
            ]
        );

        $this->seedPageSections($webDevelopmentPage->id, 'OUR HOME', 'WebNDevs', 'Tech guides and insights from our team.');

        // 2. Create App Development page
        $appDevelopmentPage = ServicePage::query()->updateOrCreate(
            ['slug' => '/app-development'],
            [
                'title' => 'App Development',
                'slug' => '/app-development',
                'status' => 'published',
                'seo_title' => 'Our DataHub | WebNDevs',
                'seo_description' => 'Explore customer success stories and software project outcomes.',
                'meta_keywords' => 'Case Studies, Software engineering, Success Stories',
            ]
        );

        $this->seedPageSections($appDevelopmentPage->id, 'DATAHUB', 'Client Success Stories', 'Detailed outcomes of our software and development projects.');
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
            'subheading2' => 'Of Expert Services',
            'subtext' => 'Learn how we design, build, and optimize products.',
        ]);

        // Why Choose Us section
        $this->createSection($pageId, 'whyus', 'items', [
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

        // Process section
        $this->createSection($pageId, 'process', 'process', [
            'tag' => "Our Process",
            'subheading1' => "From Idea to Launch in",
            'subheading2' => "5 Simple Steps",
            'subtext' => "Our proven process ensures your project is delivered on time, on budget, and exceeds expectations.",
            'items' => [
                [
                    'number' => '01',
                    'icon' => 'Search',
                    'title' => 'Discover',
                    'description' => 'We start by understanding your business, goals, and challenges. A quick call helps us map out exactly what you need.',
                    'duration' => 'Timeline: 1-2 days'
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

        // Result section
        $this->createSection($pageId, 'result', 'result', [
            [
                'title' => "Sabzithela",
                'category' => "E-Commerce",
                'badge' => "featured",
                'description' => "Designed and developed an online grocery platform for fresh vegetables, fruits, and daily essentials, enabling customers to conveniently order farm-fresh produce with a seamless shopping experience.",
                'results' => [
                    "Simplified online grocery ordering process",
                    "Responsive shopping experience across all devices",
                    "Enhanced customer convenience with home delivery"
                ],
                'tags' => ["E-Commerce", "WordPress", "Online Grocery"],
                'url' => "https://sabzithela.com"
            ],
        ]);

        // Review section
        $this->createSection($pageId, 'review', 'review', [
            [
                'name' => "Ankit Sharma",
                'company' => "Sabzithela",
                'content' => "WebNDevs built a fast, user-friendly grocery platform that perfectly matches our business needs. The shopping experience is seamless, and customers appreciate how easy it is to browse and order fresh produce online.",
                'rating' => 5,
                'photo_url' => null,
                'role' => "Founder, Sabzithela",
            ],
        ]);

        // Technologies section
        $this->createSection($pageId, 'technologies', 'technologies', [
            'techtag' => "Tech Specs",
            'techHeading1' => "Our Technology",
            'techHeading2' => "Stack & Expertise",
            'techSubtext' => "We use modern frameworks, cloud platforms, AI services, and development tools to build secure, scalable, and future-ready digital products.",
            'tags' => [
                "Next.js",
                "React",
                "TypeScript",
                "Laravel",
            ],
        ]);

        // FAQ section
        $this->createSection($pageId, 'faq', 'faq', [
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

        // Data section
        $this->createSection($pageId, 'data', 'data', [
            [
                'title' => "Don't Hesitate To Reach Out to Us",
                'description' => "Thank you for expressing your interest in webndevs.com. Whether you're looking for web development projects, graphic design, digital marketing, or other technology solutions, we're here to assist you. Our team is eager to share its expertise and help bring your ideas to life. Let's collaborate and create something amazing together."
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

    private function createSection(int $pageId, string $sectionKey, string $sectionType, array $data): ServiceSection
    {
        return ServiceSection::query()->updateOrCreate(
            [
                'service_page_id' => $pageId,
                'section_key' => $sectionKey,
            ],
            [
                'section_type' => $sectionType,
                'is_visible' => true,
                'sort_order' => match($sectionKey) {
                    'hero' => 0,
                    'header' => 1,
                    'whyus' => 2,
                    'comparison' => 3,
                    'process' => 4,
                    'stats' => 5,
                    'result' => 6,
                    'review' => 7,
                    'technologies' => 8,
                    'directory' => 9,
                    'benefits' => 10,
                    'faq' => 11,
                    'data' => 12,
                    'cta' => 13,
                    default => 14
                },
                'data' => $data,
            ]
        );
    }
}
