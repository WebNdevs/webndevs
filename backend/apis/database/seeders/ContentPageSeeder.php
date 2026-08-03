<?php

namespace Database\Seeders;

use App\Models\ContentPage;
use App\Models\ContentSection;
use App\Models\User;
use Illuminate\Database\Seeder;

class ContentPageSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::query()->where('email', 'admin@wnd.local')->first();

        // Single complete seeding data for Content Module: "/" (Home)
        $page = ContentPage::query()->updateOrCreate(
            ['slug' => '/home'],
            [
                'title' => 'Home',
                'status' => 'published',
                'seo_title' => 'WND Digital Agency | AI-Powered Software & Web Solutions',
                'seo_description' => 'Digital agency delivering custom web development, design, and growth. AI-powered programmatic SEO services.',
                'meta_keywords' => 'WebNDevs, Software Agency, Digital Agency, Web Development',
                'updated_by' => $admin?->id,
            ]
        );

        // Seed all sections cleanly aligned with Content Module structure
        $this->createSection($page->id, 'hero', 'hero', 0, [
            'tag' => 'WEBSITE & DIGITAL PRODUCTS',
            'title1' => 'Digital Products &',
            'title2' => 'Software Solutions',
            'description' => 'We design, build, and scale modern web applications and AI-driven growth engines for businesses worldwide.',
        ], $admin?->id);

        $this->createSection($page->id, 'header', 'header', 1, [
            'tag' => 'OUR OFFERINGS',
            'subheading1' => 'End-to-End Digital',
            'subheading2' => 'Agency Services',
            'subtext' => 'From initial concept to full-scale deployment, our team builds robust software aligned with your business goals.',
        ], $admin?->id);

        $this->createSection($page->id, 'whyus', 'items', 2, [
            'tag' => 'WHY US',
            'subheading1' => 'Why Choose',
            'subheading2' => 'WebNDevs?',
            'subtext' => 'We deliver production-grade software with speed, precision, and long-term support.',
            'items' => [
                [
                    'icon' => 'Users',
                    'title' => 'Unified Core Team',
                    'description' => 'Designers, engineers, and growth marketers working together under one roof.',
                ],
                [
                    'icon' => 'Zap',
                    'title' => 'Rapid Execution',
                    'description' => 'Agile sprints designed to launch robust MVPs and features on schedule.',
                ],
            ],
        ], $admin?->id);

        $this->createSection($page->id, 'comparison', 'comparison', 3, [
            'tag' => 'THE DIFFERENCE',
            'subheading1' => 'Traditional Agency',
            'subheading2' => 'VS The WebNDevs Way',
            'subtext' => 'See how our systematic engineering approach compares to fragmented freelancer workflows.',
            'leftHeading' => 'Traditional Approach',
            'rightHeading' => 'The WebNDevs Way',
            'leftPoints' => [
                'Uncoordinated freelancers & delayed communication',
                'Inconsistent code standards and technical debt',
                'Fragile deployments without automated tests',
            ],
            'rightPoints' => [
                'Single dedicated engineering team and point of contact',
                'Strict CI/CD pipelines and modular codebase standards',
                'Long-term maintainability with comprehensive documentation',
            ],
        ], $admin?->id);

        $this->createSection($page->id, 'process', 'process', 4, [
            'tag' => 'OUR PROCESS',
            'subheading1' => 'From Discovery to',
            'subheading2' => 'Production Launch',
            'subtext' => 'Our 5-step engineering framework ensures predictable delivery and zero deployment surprises.',
            'items' => [
                [
                    'number' => '01',
                    'icon' => 'Search',
                    'title' => 'Discovery & Architecture',
                    'description' => 'Requirements gathering, system design, and tech stack alignment.',
                    'duration' => '1-2 Days',
                ],
                [
                    'number' => '02',
                    'icon' => 'Code',
                    'title' => 'Agile Sprint Execution',
                    'description' => 'Iterative development sprints with continuous review demos.',
                    'duration' => '2-3 Weeks',
                ],
            ],
        ], $admin?->id);

        $this->createSection($page->id, 'stats', 'stats', 5, [
            'tag' => 'BY THE NUMBERS',
            'subheading1' => 'Proven Impact',
            'subheading2' => '& Metrics',
            'subtext' => 'Quantifiable results delivered across client engineering projects.',
            'items' => [
                ['value' => '150+', 'title' => 'Projects Shipped'],
                ['value' => '99.9%', 'title' => 'Uptime Guarantee'],
                ['value' => '3.5x', 'title' => 'Average Performance Lift'],
            ],
        ], $admin?->id);

        $this->createSection($page->id, 'result', 'result', 6, [
            'tag' => 'CASE STUDY',
            'subheading1' => 'Featured Client',
            'subheading2' => 'Success Story',
            'subtext' => 'High-impact platforms built and scaled by WebNDevs.',
            'items' => [
                [
                    'title' => 'Enterprise E-Commerce Engine',
                    'category' => 'E-Commerce',
                    'badge' => 'Featured Case Study',
                    'description' => 'Architected a multi-vendor digital marketplace with sub-second page loads and automated inventory sync.',
                    'url' => 'https://webndevs.com',
                ],
            ],
        ], $admin?->id);

        $this->createSection($page->id, 'review', 'review', 7, [
            'tag' => 'TESTIMONIALS',
            'subheading1' => 'What Our Clients',
            'subheading2' => 'Say About Us',
            'subtext' => 'Feedback from founders and engineering leaders.',
            'items' => [
                [
                    'name' => 'Alex Rivera',
                    'company' => 'TechScale Inc.',
                    'role' => 'CTO',
                    'content' => 'WebNDevs transformed our legacy application into a high-performance modern web app ahead of schedule.',
                    'rating' => 5,
                ],
            ],
        ], $admin?->id);

        $this->createSection($page->id, 'technologies', 'technologies', 8, [
            'tag' => 'TECH STACK',
            'subheading1' => 'Modern Technologies',
            'subheading2' => 'We Specialize In',
            'subtext' => 'Production-ready frameworks and infrastructure powering our solutions.',
            'tags' => ['React', 'Next.js', 'TypeScript', 'Laravel', 'PostgreSQL', 'Docker', 'Tailwind CSS'],
        ], $admin?->id);

        $this->createSection($page->id, 'faq', 'faq', 9, [
            'tag' => 'FAQ',
            'subheading1' => 'Frequently Asked',
            'subheading2' => 'Questions',
            'subtext' => 'Common questions about our digital agency services.',
            'items' => [
                [
                    'question' => 'How do you manage project timelines and deliverables?',
                    'answer' => 'We run 2-week agile sprints with dedicated Slack channels, staging environments, and weekly progress demos.',
                ],
            ],
        ], $admin?->id);

        $this->createSection($page->id, 'data', 'data', 10, [
            'tag' => 'OVERVIEW',
            'subheading1' => 'Comprehensive Content',
            'subheading2' => 'Directory Data',
            'subtext' => 'Structured directory data serving frontend modules.',
        ], $admin?->id);

        $this->createSection($page->id, 'cta', 'cta', 11, [
            'preview' => [
                'text' => 'Schedule a Discovery Call',
                'url' => '/contact',
            ],
            'full' => [
                'text' => 'Build Your Next Project With Us',
                'description' => 'Ready to build high-performance web applications? Contact our engineering team today.',
                'url' => '/contact',
            ],
        ], $admin?->id);
    }

    private function createSection(int $pageId, string $sectionKey, string $sectionType, int $sortOrder, array $data, ?int $adminId): ContentSection
    {
        return ContentSection::query()->updateOrCreate(
            [
                'content_page_id' => $pageId,
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
