<?php

namespace Database\Seeders;

use App\Models\ContentPage;
use App\Models\ContentSection;
use Illuminate\Database\Seeder;

class ContentPageSeeder extends Seeder
{
    public function run(): void
    {
<<<<<<< HEAD
        // 1. Create Home page
        $homePage = ContentPage::query()->updateOrCreate(
            ['slug' => '/'],
=======
        $admin = User::query()->where('email', 'admin@wnd.local')->first();

        // Create Home page
        $homePage = $this->createOrGetPage('home', 'Home', 'WND Digital Agency | AI-Powered Programmatic SEO', 'Digital agency delivering design, development, and growth. AI-powered programmatic SEO services.', $admin?->id);
        $this->createHomePageSections($homePage->id, $admin?->id);

        // Create Portfolio page
        $portfolioPage = $this->createOrGetPage('portfolio', 'Portfolio', 'Our Portfolio | WebNDevs', 'Explore our successful projects and case studies.', $admin?->id);
        $this->createPortfolioPageSections($portfolioPage->id, $admin?->id);

        // Create Testimonials page
        $testimonialsPage = $this->createOrGetPage('testimonials', 'Testimonials', 'Client Testimonials | WebNDevs', 'Read what our clients say about working with WebNDevs.', $admin?->id);
        $this->createTestimonialsPageSections($testimonialsPage->id, $admin?->id);

        // Create FAQ page
        $faqPage = $this->createOrGetPage('faq', 'FAQ', 'Frequently Asked Questions | WebNDevs', 'Find answers to common questions about our services.', $admin?->id);
        $this->createFaqPageSections($faqPage->id, $admin?->id);

        // Create Services page
        $servicesPage = $this->createOrGetPage('services', 'Services', 'Our Services | WebNDevs', 'Explore our comprehensive digital services.', $admin?->id);
        $this->createServicesPageSections($servicesPage->id, $admin?->id);

        // Create Data Hub page - just menu tiles linking to other modules
        $dataHubPage = $this->createOrGetPage('data', 'Data Hub', 'Data Hub | WebNDevs', 'Explore tools, industries, solutions, and comparisons.', $admin?->id);
        $this->createDataHubPageSections($dataHubPage->id, $admin?->id);
    }

    private function createOrGetPage(string $slug, string $title, string $seoTitle, string $seoDescription, ?int $adminId): ContentPage
    {
<<<<<<< Updated upstream
        return ContentPage::query()->updateOrCreate(
            ['slug' => $slug],
=======
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
            'subheading2' => 'Of Expert Contents',
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

        // Comparison section
        $this->createSection($pageId, 'comparison', 'comparison', [
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
>>>>>>> Stashed changes
>>>>>>> 7b791a2 (sql changes)
            [
                'title' => 'Home',
                'slug' => '/',
                'status' => 'published',
                'seo_title' => 'WebNDevs',
                'seo_description' => 'Read our latest articles, insights, and tech tutorials.',
                'meta_keywords' => 'Blog, Development, Technology',
            ]
        );

        $this->seedPageSections($homePage->id, 'OUR HOME', 'WebNDevs', 'Tech guides and insights from our team.');

        // 2. Create DataHub page
        $datahubPage = ContentPage::query()->updateOrCreate(
            ['slug' => '/datahub'],
            [
                'title' => 'DataHub',
                'slug' => '/datahub',
                'status' => 'published',
                'seo_title' => 'Our DataHub | WebNDevs',
                'seo_description' => 'Explore customer success stories and software project outcomes.',
                'meta_keywords' => 'Case Studies, Software engineering, Success Stories',
            ]
        );

        $this->seedPageSections($datahubPage->id, 'DATAHUB', 'Client Success Stories', 'Detailed outcomes of our software and development projects.');
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
            'subheading2' => 'Of Expert Contents',
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

        // Comparison section
        $this->createSection($pageId, 'content', 'comparison', [
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

    private function createSection(int $pageId, string $sectionKey, string $sectionType, array $data): ContentSection
    {
        return ContentSection::query()->updateOrCreate(
            [
                'content_page_id' => $pageId,
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
                    'faq' => 9,
                    'data' => 10,
                    'cta' => 11,
                    default => 12
                },
                'data' => $data,
            ]
        );
    }
}
