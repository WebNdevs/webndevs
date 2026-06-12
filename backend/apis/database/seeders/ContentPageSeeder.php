<?php

namespace Database\Seeders;

use App\Models\ContentItem;
use App\Models\ContentPage;
use App\Models\ContentSection;
use App\Models\User;
use Illuminate\Database\Seeder;

class ContentPageSeeder extends Seeder
{
    public function run(): void
    {
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
        return ContentPage::query()->updateOrCreate(
            ['slug' => $slug],
            [
                'title' => $title,
                'slug' => $slug,
                'status' => 'published',
                'seo_title' => $seoTitle,
                'seo_description' => $seoDescription,
                'meta_keywords' => '',
                'updated_by' => $adminId,
            ]
        );
    }

    private function createSection(int $pageId, string $sectionKey, string $sectionType, string $title, string $name, ?string $content, array $fields = [], ?int $adminId = null): ContentSection
    {
        $existingOrder = ContentSection::query()
            ->where('content_page_id', $pageId)
            ->max('sort_order') ?? 0;

        return ContentSection::query()->updateOrCreate(
            [
                'content_page_id' => $pageId,
                'section_key' => $sectionKey,
            ],
            [
                'section_type' => $sectionType,
                'title' => $title,
                'name' => $name,
                'content' => $content,
                'is_visible' => true,
                'sort_order' => $existingOrder + 1,
                'fields' => $fields,
                'sync_version' => 1,
                'updated_by' => $adminId,
            ]
        );
    }

    private function createItem(int $sectionId, string $itemKey, array $data, int $sortOrder = 0, ?int $adminId = null): ContentItem
    {
        return ContentItem::query()->updateOrCreate(
            [
                'content_section_id' => $sectionId,
                'item_key' => $itemKey,
            ],
            [
                'title' => $data['title'] ?? '',
                'content' => $data['content'] ?? null,
                'category' => $data['category'] ?? null,
                'url' => $data['url'] ?? null,
                'description' => $data['description'] ?? null,
                'results' => $data['results'] ?? null,
                'tags' => $data['tags'] ?? null,
                'badge' => $data['badge'] ?? null,
                'avatar' => $data['avatar'] ?? null,
                'client_name' => $data['client_name'] ?? null,
                'client_role' => $data['client_role'] ?? null,
                'company' => $data['company'] ?? null,
                'rating' => $data['rating'] ?? null,
                'sort_order' => $sortOrder,
                'is_featured' => $data['is_featured'] ?? false,
                'is_active' => $data['is_active'] ?? true,
                'updated_by' => $adminId,
            ]
        );
    }

    // ===================== HOME PAGE =====================
    private function createHomePageSections(int $pageId, ?int $adminId): void
    {
        // Hero Section
        $this->createSection($pageId, 'hero', 'hero', 'AI-Powered Digital Agency', 'Hero Section', 'We build high-converting websites and automate your business workflows.', [
            'eyebrow' => 'AI-Powered Solutions',
            'subtitle' => 'For Ambitious Founders & Teams',
            'cta_primary' => 'Book Free Strategy Call',
            'cta_secondary' => 'View Our Work',
        ], $adminId);

        // Why Choose Us Section
        $whySection = $this->createSection($pageId, 'why-choose', 'why-choose', 'Why Leading Brands Choose WebNDevs', 'Why Choose Us', 'We combine cutting-edge technology with strategic thinking to deliver measurable results.', [
            'columns' => 3,
        ], $adminId);

        $whyItems = [
            ['title' => 'AI-Powered Development', 'description' => 'Leverage the latest AI tools to build faster without sacrificing quality.', 'badge' => 'success', 'is_featured' => true],
            ['title' => 'Transparent Process', 'description' => 'Real-time dashboards, weekly updates, and clear milestones.', 'badge' => 'info', 'is_featured' => true],
            ['title' => 'Dedicated Support', 'description' => '24/7 monitoring and rapid response times.', 'badge' => 'warning', 'is_featured' => true],
        ];

        foreach ($whyItems as $index => $item) {
            $this->createItem($whySection->id, "why-$index", $item, $index, $adminId);
        }

        // Services Overview Section
        $servicesOverviewSection = $this->createSection($pageId, 'services-overview', 'services-grid', 'Our Services', 'Services Overview', 'From web development to AI automation, we cover all aspects of your digital presence.', [
            'columns' => 3,
            'show_view_all' => true,
            'view_all_link' => '/services',
        ], $adminId);

        $serviceItems = [
            ['title' => 'Web Development', 'category' => 'Development', 'description' => 'Custom websites and web applications with modern technologies.', 'badge' => 'success', 'is_featured' => true],
            ['title' => 'Mobile Development', 'category' => 'Development', 'description' => 'iOS and Android apps that deliver exceptional experiences.', 'badge' => 'info', 'is_featured' => true],
            ['title' => 'UI/UX Design', 'category' => 'Design', 'description' => 'User-centered design that converts visitors into customers.', 'badge' => 'warning', 'is_featured' => true],
        ];

        foreach ($serviceItems as $index => $item) {
            $this->createItem($servicesOverviewSection->id, "service-$index", $item, $index, $adminId);
        }

        // Process Steps Section
        $processSection = $this->createSection($pageId, 'process', 'process', 'How We Work', 'Our Process', 'A streamlined approach to deliver results fast.', [
            'steps' => 4,
        ], $adminId);

        $processSteps = [
            ['title' => 'Discovery', 'content' => 'We analyze your business goals, competitors, and target audience to create a strategic roadmap.', 'duration' => '1-2 days'],
            ['title' => 'Design', 'content' => 'Our designers create wireframes and high-fidelity mockups that align with your brand vision.', 'duration' => '3-5 days'],
            ['title' => 'Development', 'content' => 'Our engineers build your solution using cutting-edge technologies with rigorous quality standards.', 'duration' => '2-8 weeks'],
            ['title' => 'Launch & Support', 'content' => 'We deploy, monitor, and optimize your digital presence with ongoing support.', 'duration' => 'Ongoing'],
        ];

        foreach ($processSteps as $index => $step) {
            $this->createItem($processSection->id, "step-$index", $step, $index, $adminId);
        }

        // Portfolio Projects Section
        $portfolioSection = $this->createSection($pageId, 'portfolio', 'portfolio', 'Real Results for Real Businesses', 'Portfolio Projects', 'We don\'t just build projects—we build solutions that drive measurable growth.', [
            'limit' => 6,
            'show_stats' => true,
            'show_view_all' => true,
            'view_all_link' => '/portfolio',
        ], $adminId);

        $portfolioItems = [
            ['item_key' => 'financeflow', 'title' => 'FinanceFlow SaaS Platform', 'category' => 'Web Development', 'url' => 'https://financeflow.com', 'description' => 'Built a complete financial management platform with real-time analytics and automated reporting.', 'results' => ['10,000+ active users in 6 months', '40% reduction in processing time', '98% uptime since launch'], 'tags' => ['React', 'Node.js', 'PostgreSQL'], 'badge' => 'success', 'is_featured' => true, 'is_active' => true],
            ['item_key' => 'healthtrack', 'title' => 'HealthTrack Mobile App', 'category' => 'Mobile Development', 'url' => 'https://healthtrack.com', 'description' => 'Native iOS and Android fitness tracking app with AI-powered workout recommendations.', 'results' => ['50K+ downloads in first quarter', '4.8★ average rating', 'Featured on App Store'], 'tags' => ['React Native', 'Firebase', 'AI/ML'], 'badge' => 'info', 'is_featured' => true, 'is_active' => true],
            ['item_key' => 'retailpro', 'title' => 'RetailPro Dashboard', 'category' => 'Data Analytics', 'url' => 'https://retailpro.com', 'description' => 'Custom Power BI dashboard integrating sales data from multiple sources for real-time insights.', 'results' => ['60% faster reporting', 'Saved 20 hours/week', 'Better decision making'], 'tags' => ['Power BI', 'SQL', 'Azure'], 'badge' => 'warning', 'is_featured' => true, 'is_active' => true],
            ['item_key' => 'ecoshop', 'title' => 'EcoShop E-commerce', 'category' => 'Web Development', 'url' => 'https://ecoshop.com', 'description' => 'High-converting online store with custom checkout flow and inventory management system.', 'results' => ['250% increase in sales', '35% cart abandonment reduction', '3x faster page loads'], 'tags' => ['WordPress', 'WooCommerce', 'Stripe'], 'badge' => 'success', 'is_featured' => true, 'is_active' => true],
        ];

        foreach ($portfolioItems as $index => $item) {
            $this->createItem($portfolioSection->id, $item['item_key'], $item, $index, $adminId);
        }

        // Stats Section
        $statsSection = $this->createSection($pageId, 'stats', 'items-list', 'Our Impact', 'Statistics', 'Key metrics demonstrating our success.', [
            'display_type' => 'stats_grid',
        ], $adminId);

        $statsItems = [
            ['item_key' => 'stat-projects', 'title' => '50+', 'description' => 'Projects Completed', 'badge' => 'success'],
            ['item_key' => 'stat-satisfaction', 'title' => '98%', 'description' => 'Client Satisfaction', 'badge' => 'success'],
            ['item_key' => 'stat-roi', 'title' => '2.5x', 'description' => 'Average ROI Increase', 'badge' => 'info'],
            ['item_key' => 'stat-support', 'title' => '24/7', 'description' => 'Support Available', 'badge' => 'default'],
        ];

        foreach ($statsItems as $index => $item) {
            $this->createItem($statsSection->id, $item['item_key'], $item, $index, $adminId);
        }

        // Testimonials Section
        $testimonialsSection = $this->createSection($pageId, 'testimonials', 'testimonials', "Don't Just Take Our Word for It", 'Client Testimonials', 'Hear from the founders and business owners who trusted us with their digital growth.', [
            'limit' => 3,
            'show_rating' => true,
            'show_view_all' => true,
            'view_all_link' => '/testimonials',
        ], $adminId);

        $testimonialsItems = [
            ['item_key' => 'testimonial-1', 'title' => 'Sarah Mitchell', 'content' => 'WebNDevs transformed our outdated website into a modern, high-converting platform. Within 3 months, we saw a 180% increase in qualified leads.', 'client_name' => 'Sarah Mitchell', 'client_role' => 'CEO, TechStart Inc.', 'company' => 'TechStart Inc.', 'rating' => 5, 'is_featured' => true, 'is_active' => true],
            ['item_key' => 'testimonial-2', 'title' => 'James Rodriguez', 'content' => 'I was juggling 4 different freelancers before finding WebNDevs. Now I have one team handling design, development, and marketing.', 'client_name' => 'James Rodriguez', 'client_role' => 'Founder, FitLife App', 'company' => 'FitLife App', 'rating' => 5, 'is_featured' => true, 'is_active' => true],
            ['item_key' => 'testimonial-3', 'title' => 'Emily Chen', 'content' => 'The Power BI dashboard they built saves our team 15+ hours every week. We can now make data-driven decisions in real-time.', 'client_name' => 'Emily Chen', 'client_role' => 'Marketing Director, RetailPro', 'company' => 'RetailPro', 'rating' => 5, 'is_featured' => true, 'is_active' => true],
        ];

        foreach ($testimonialsItems as $index => $item) {
            $this->createItem($testimonialsSection->id, $item['item_key'], $item, $index, $adminId);
        }

        // CTA Section
        $this->createSection($pageId, 'cta', 'cta', 'Ready to Transform Your Business?', 'Call to Action', 'Let\'s discuss how we can help you achieve your goals.', [
            'cta_text' => 'Book Free Strategy Call',
            'cta_link' => '/contact',
            'show_alternative' => true,
            'alt_cta_text' => 'View Our Work',
            'alt_cta_link' => '/portfolio',
        ], $adminId);
    }

    // ===================== PORTFOLIO PAGE =====================
    private function createPortfolioPageSections(int $pageId, ?int $adminId): void
    {
        // Hero Section
        $this->createSection($pageId, 'hero', 'hero', 'Our Work', 'Portfolio Hero', 'Explore our successful projects across various industries and services.', [
            'show_view_all' => false,
        ], $adminId);

        // Portfolio Projects Section
        $portfolioSection = $this->createSection($pageId, 'portfolio', 'portfolio', 'Featured Projects', 'All Portfolio Items', 'Browse through our diverse portfolio of successful client engagements.', [
            'show_filters' => true,
            'show_results' => true,
            'categories' => ['Web Development', 'Mobile Development', 'Data Analytics', 'AI & Automation', 'Branding'],
        ], $adminId);

        $portfolioItems = [
            ['item_key' => 'financeflow', 'title' => 'FinanceFlow SaaS Platform', 'category' => 'Web Development', 'url' => 'https://financeflow.com', 'description' => 'Built a complete financial management platform with real-time analytics and automated reporting.', 'results' => ['10,000+ active users in 6 months', '40% reduction in processing time', '98% uptime since launch'], 'tags' => ['React', 'Node.js', 'PostgreSQL'], 'badge' => 'success', 'is_featured' => true, 'is_active' => true],
            ['item_key' => 'healthtrack', 'title' => 'HealthTrack Mobile App', 'category' => 'Mobile Development', 'url' => 'https://healthtrack.com', 'description' => 'Native iOS and Android fitness tracking app with AI-powered workout recommendations.', 'results' => ['50K+ downloads in first quarter', '4.8★ average rating', 'Featured on App Store'], 'tags' => ['React Native', 'Firebase', 'AI/ML'], 'badge' => 'info', 'is_featured' => true, 'is_active' => true],
            ['item_key' => 'retailpro', 'title' => 'RetailPro Dashboard', 'category' => 'Data Analytics', 'url' => 'https://retailpro.com', 'description' => 'Custom Power BI dashboard integrating sales data from multiple sources for real-time insights.', 'results' => ['60% faster reporting', 'Saved 20 hours/week', 'Better decision making'], 'tags' => ['Power BI', 'SQL', 'Azure'], 'badge' => 'warning', 'is_featured' => true, 'is_active' => true],
            ['item_key' => 'ecoshop', 'title' => 'EcoShop E-commerce', 'category' => 'Web Development', 'url' => 'https://ecoshop.com', 'description' => 'High-converting online store with custom checkout flow and inventory management system.', 'results' => ['250% increase in sales', '35% cart abandonment reduction', '3x faster page loads'], 'tags' => ['WordPress', 'WooCommerce', 'Stripe'], 'badge' => 'success', 'is_featured' => true, 'is_active' => true],
            ['item_key' => 'autoflow', 'title' => 'AutoFlow Automation Suite', 'category' => 'AI & Automation', 'url' => 'https://autoflow.com', 'description' => 'Custom automation workflows connecting CRM, email, and project management tools.', 'results' => ['15 hours saved per week', '90% fewer manual errors', 'ROI achieved in 2 months'], 'tags' => ['Zapier', 'APIs', 'Python'], 'badge' => 'info', 'is_featured' => true, 'is_active' => true],
            ['item_key' => 'brandhub', 'title' => 'BrandHub Identity System', 'category' => 'Branding', 'url' => 'https://brandhub.com', 'description' => 'Complete brand identity including logo, guidelines, website, and marketing materials.', 'results' => ['3x brand recognition', '45% increase in leads', 'Consistent brand presence'], 'tags' => ['Brand Design', 'Marketing', 'UI/UX'], 'badge' => 'default', 'is_featured' => false, 'is_active' => true],
        ];

        foreach ($portfolioItems as $index => $item) {
            $this->createItem($portfolioSection->id, $item['item_key'], $item, $index, $adminId);
        }

        // CTA Section
        $this->createSection($pageId, 'cta', 'cta', 'Want to Join Our Success Stories?', 'Portfolio CTA', 'Let\'s discuss how we can achieve similar results for your business.', [
            'cta_text' => 'Start Your Project',
            'cta_link' => '/contact',
        ], $adminId);
    }

    // ===================== TESTIMONIALS PAGE =====================
    private function createTestimonialsPageSections(int $pageId, ?int $adminId): void
    {
        // Hero Section
        $this->createSection($pageId, 'hero', 'hero', 'Client Success Stories', 'Testimonials Hero', 'Hear from the founders and business owners who trusted us with their digital growth.', [], $adminId);

        // Trust Badges Section
        $trustSection = $this->createSection($pageId, 'trust-badges', 'items-list', 'Why Clients Choose Us', 'Trust Metrics', 'Our commitment to excellence is reflected in our track record.', [
            'display_type' => 'trust_badges',
        ], $adminId);

        $trustItems = [
            ['item_key' => 'trust-rating', 'title' => '4.9/5', 'description' => 'Average Rating', 'badge' => 'success'],
            ['item_key' => 'trust-repeat', 'title' => '85%', 'description' => 'Repeat Clients', 'badge' => 'info'],
            ['item_key' => 'trust-delivery', 'title' => '100%', 'description' => 'On-Time Delivery', 'badge' => 'default'],
        ];

        foreach ($trustItems as $index => $item) {
            $this->createItem($trustSection->id, $item['item_key'], $item, $index, $adminId);
        }

        // Testimonials Grid Section
        $testimonialsSection = $this->createSection($pageId, 'testimonials', 'testimonials', "Don't Just Take Our Word for It", 'All Client Testimonials', 'Read what our clients say about their experience working with WebNDevs.', [
            'limit' => 12,
            'show_rating' => true,
            'columns' => 3,
        ], $adminId);

        $testimonialsItems = [
            ['item_key' => 'testimonial-1', 'title' => 'Sarah Mitchell', 'content' => 'WebNDevs transformed our outdated website into a modern, high-converting platform. Within 3 months, we saw a 180% increase in qualified leads. They understood our business and delivered beyond expectations.', 'client_name' => 'Sarah Mitchell', 'client_role' => 'CEO, TechStart Inc.', 'company' => 'TechStart Inc.', 'rating' => 5, 'is_featured' => true, 'is_active' => true],
            ['item_key' => 'testimonial-2', 'title' => 'James Rodriguez', 'content' => 'I was juggling 4 different freelancers before finding WebNDevs. Now I have one team handling design, development, and marketing. The relief of having clear communication and consistent quality is priceless.', 'client_name' => 'James Rodriguez', 'client_role' => 'Founder, FitLife App', 'company' => 'FitLife App', 'rating' => 5, 'is_featured' => true, 'is_active' => true],
            ['item_key' => 'testimonial-3', 'title' => 'Emily Chen', 'content' => 'The Power BI dashboard they built saves our team 15+ hours every week. We can now make data-driven decisions in real-time instead of waiting days for reports. Best investment we\'ve made this year.', 'client_name' => 'Emily Chen', 'client_role' => 'Marketing Director, RetailPro', 'company' => 'RetailPro', 'rating' => 5, 'is_featured' => true, 'is_active' => true],
            ['item_key' => 'testimonial-4', 'title' => 'Michael Foster', 'content' => 'Our e-commerce sales tripled after WebNDevs optimized our store. They didn\'t just make it look good—they focused on conversion rates, page speed, and user experience. The results speak for themselves.', 'client_name' => 'Michael Foster', 'client_role' => 'Owner, EcoShop', 'company' => 'EcoShop', 'rating' => 5, 'is_featured' => true, 'is_active' => true],
            ['item_key' => 'testimonial-5', 'title' => 'Lisa Thompson', 'content' => 'The automation workflows WebNDevs set up have been game-changing. Tasks that used to take hours now happen automatically. We\'ve reduced errors by 90% and our team can focus on what actually matters.', 'client_name' => 'Lisa Thompson', 'client_role' => 'Operations Manager, AutoCorp', 'company' => 'AutoCorp', 'rating' => 5, 'is_featured' => false, 'is_active' => true],
            ['item_key' => 'testimonial-6', 'title' => 'David Park', 'content' => 'From logo to website to marketing materials, WebNDevs nailed our brand identity. They took time to understand our vision and created something that truly represents who we are. Couldn\'t be happier.', 'client_name' => 'David Park', 'client_role' => 'Founder, BrandHub', 'company' => 'BrandHub', 'rating' => 5, 'is_featured' => false, 'is_active' => true],
        ];

        foreach ($testimonialsItems as $index => $item) {
            $this->createItem($testimonialsSection->id, $item['item_key'], $item, $index, $adminId);
        }

        // CTA Section
        $this->createSection($pageId, 'cta', 'cta', 'Ready to Become Our Next Success Story?', 'Testimonials CTA', 'Let\'s discuss how we can help transform your business.', [
            'cta_text' => 'Get in Touch',
            'cta_link' => '/contact',
        ], $adminId);
    }

    // ===================== FAQ PAGE =====================
    private function createFaqPageSections(int $pageId, ?int $adminId): void
    {
        // Hero Section
        $this->createSection($pageId, 'hero', 'hero', 'Frequently Asked Questions', 'FAQ Hero', 'Find answers to common questions about our services, process, and pricing.', [], $adminId);

        // General FAQ Section
        $generalFaqSection = $this->createSection($pageId, 'general-faq', 'faqs', 'General Questions', 'General FAQ', 'Common questions about working with WebNDevs.', [
            'category' => 'general',
        ], $adminId);

        $generalFaqItems = [
            ['title' => 'What services does WebNDevs offer?', 'content' => 'We offer a comprehensive suite of digital services including web development, mobile app development, UI/UX design, digital marketing, SEO, and automation solutions. Our team specializes in creating custom solutions tailored to your business needs.', 'is_featured' => true, 'is_active' => true],
            ['title' => 'How long does a typical project take?', 'content' => 'Project timelines vary based on scope and complexity. A simple website might take 4-6 weeks, while a complex web application could take 3-6 months. We provide detailed timelines during our discovery phase.', 'is_featured' => true, 'is_active' => true],
            ['title' => 'What is your pricing model?', 'content' => 'We offer flexible pricing models including fixed-price projects, hourly engagements, and retainer arrangements. Our approach depends on project scope, timeline, and ongoing needs. Contact us for a custom quote.', 'is_featured' => false, 'is_active' => true],
            ['title' => 'Do you provide ongoing support?', 'content' => 'Yes! We offer various maintenance and support packages to ensure your digital assets continue performing optimally. This includes updates, security monitoring, and performance optimization.', 'is_featured' => false, 'is_active' => true],
        ];

        foreach ($generalFaqItems as $index => $item) {
            $this->createItem($generalFaqSection->id, "faq-gen-$index", $item, $index, $adminId);
        }

        // Technical FAQ Section
        $techFaqSection = $this->createSection($pageId, 'technical-faq', 'faqs', 'Technical Questions', 'Technical FAQ', 'Questions about our technical approach and capabilities.', [
            'category' => 'technical',
        ], $adminId);

        $techFaqItems = [
            ['title' => 'What technologies do you work with?', 'content' => 'We work with modern technologies including React, Vue, Angular for frontend, Node.js, Laravel, Python for backend, and various databases and cloud platforms. We choose the right tool for each specific project.', 'is_featured' => true, 'is_active' => true],
            ['title' => 'Do you work with existing codebases?', 'content' => 'Absolutely. We have experience inheriting and improving existing projects. We conduct thorough code audits to understand the current state and develop a migration or enhancement strategy.', 'is_featured' => false, 'is_active' => true],
            ['title' => 'How do you handle data security?', 'content' => 'Security is paramount. We implement industry best practices including encryption, secure authentication, regular audits, and compliance with regulations like GDPR and SOC2 where applicable.', 'is_featured' => false, 'is_active' => true],
        ];

        foreach ($techFaqItems as $index => $item) {
            $this->createItem($techFaqSection->id, "faq-tech-$index", $item, $index, $adminId);
        }

        // CTA Section
        $this->createSection($pageId, 'cta', 'cta', 'Still have questions?', 'Contact CTA', 'Our team is ready to answer any questions you might have.', [
            'cta_text' => 'Contact Us',
            'cta_link' => '/contact',
        ], $adminId);
    }

    // ===================== SERVICES PAGE =====================
    private function createServicesPageSections(int $pageId, ?int $adminId): void
    {
        // Hero Section
        $this->createSection($pageId, 'hero', 'hero', 'Our Services', 'Services Hero', 'Comprehensive digital solutions to transform your business and drive growth.', [
            'show_cta' => true,
        ], $adminId);

        // Services Grid Section
        $servicesGridSection = $this->createSection($pageId, 'services-grid', 'services-grid', 'What We Offer', 'Services Overview', 'From concept to launch, we provide end-to-end digital services.', [
            'columns' => 3,
            'show_learn_more' => true,
        ], $adminId);

        $servicesItems = [
            ['title' => 'Web Development', 'category' => 'Development', 'description' => 'Custom websites and web applications built with modern technologies. From landing pages to complex SaaS platforms.', 'badge' => 'success', 'is_featured' => true, 'is_active' => true],
            ['title' => 'Mobile Development', 'category' => 'Development', 'description' => 'iOS and Android apps that deliver exceptional user experiences. Native and cross-platform solutions.', 'badge' => 'info', 'is_featured' => true, 'is_active' => true],
            ['title' => 'UI/UX Design', 'category' => 'Design', 'description' => 'User-centered design that converts visitors into customers. Research-driven interfaces that delight users.', 'badge' => 'warning', 'is_featured' => true, 'is_active' => true],
            ['title' => 'Digital Marketing', 'category' => 'Marketing', 'description' => 'Data-driven campaigns that generate leads and grow your audience. SEO, PPC, and content marketing.', 'badge' => 'success', 'is_featured' => true, 'is_active' => true],
            ['title' => 'Automation', 'category' => 'Technology', 'description' => 'Streamline workflows and reduce manual work. Integration solutions that save time and reduce errors.', 'badge' => 'info', 'is_featured' => true, 'is_active' => true],
            ['title' => 'Analytics & Insights', 'category' => 'Technology', 'description' => 'Make data-driven decisions with custom dashboards and reporting. Turn raw data into actionable insights.', 'badge' => 'default', 'is_featured' => true, 'is_active' => true],
        ];

        foreach ($servicesItems as $index => $item) {
            $this->createItem($servicesGridSection->id, "service-$index", $item, $index, $adminId);
        }

        // Technologies Section
        $techSection = $this->createSection($pageId, 'technologies', 'technologies', 'Technologies We Master', 'Tech Stack', 'We use the most modern and reliable technologies to build your solution.', [
            'categories' => ['Frontend', 'Backend', 'Database', 'Cloud'],
        ], $adminId);

        $techItems = [
            ['title' => 'React', 'category' => 'Frontend', 'description' => 'Modern React development with hooks, TypeScript, and performance optimization.', 'badge' => 'success'],
            ['title' => 'Node.js', 'category' => 'Backend', 'description' => 'Scalable server-side applications with Express and modern frameworks.', 'badge' => 'info'],
            ['title' => 'PostgreSQL', 'category' => 'Database', 'description' => 'Reliable relational database for complex queries and data integrity.', 'badge' => 'warning'],
            ['title' => 'AWS', 'category' => 'Cloud', 'description' => 'Cloud infrastructure for reliability, security, and scalability.', 'badge' => 'default'],
        ];

        foreach ($techItems as $index => $item) {
            $this->createItem($techSection->id, "tech-$index", $item, $index, $adminId);
        }

        // CTA Section
        $this->createSection($pageId, 'cta', 'cta', 'Need a custom solution?', 'Services CTA', 'Let\'s discuss your project and create something amazing together.', [
            'cta_text' => 'Start a Project',
            'cta_link' => '/contact',
        ], $adminId);
    }

    // ===================== DATA HUB PAGE =====================
    private function createDataHubPageSections(int $pageId, ?int $adminId): void
    {
        // Hero Section
        $this->createSection($pageId, 'hero', 'hero', 'Data Hub', 'Data Hub Hero', 'Explore our comprehensive directory of tools, industries, solutions, and comparisons.', [
            'show_search' => true,
        ], $adminId);

        // Menu Tiles Section - links to other modules
        $menuSection = $this->createSection($pageId, 'menu-tiles', 'items-list', 'Explore Our Resources', 'Data Hub Menu', 'Browse our curated directories and resources.', [
            'display_type' => 'link_card',
        ], $adminId);

        $menuItems = [
            ['title' => 'Tools & Software', 'description' => 'CRM, automation, analytics tools and more', 'url' => '/data/tools', 'badge' => 'success', 'is_featured' => true],
            ['title' => 'Industries', 'description' => 'Solutions tailored for your industry', 'url' => '/data/industries', 'badge' => 'info', 'is_featured' => true],
            ['title' => 'Solutions', 'description' => 'Problem-solution pairings', 'url' => '/data/solutions', 'badge' => 'warning', 'is_featured' => true],
            ['title' => 'Comparisons', 'description' => 'Compare tools side-by-side', 'url' => '/data/compare', 'badge' => 'default', 'is_featured' => false],
        ];

        foreach ($menuItems as $index => $item) {
            $this->createItem($menuSection->id, "menu-$index", $item, $index, $adminId);
        }
    }
}