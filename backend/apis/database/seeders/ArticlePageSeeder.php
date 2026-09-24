<?php

namespace Database\Seeders;

use App\Models\ArticlePage;
use App\Models\ArticleSection;
use App\Models\User;
use Illuminate\Database\Seeder;

class ArticlePageSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::query()->where('email', 'admin@wnd.local')->first();

        // Seeding data for Article Module: "/blogs" (Blogs)
        $page = ArticlePage::query()->updateOrCreate(
            ['slug' => '/blogs'],
            [
                'title' => 'Blogs',
                'slug' => '/blogs',
                'status' => 'published',
                'seo_title' => 'Our Blogs & Insights | Article Module',
                'seo_description' => 'Read our latest technical articles, software architecture tutorials, and web development insights.',
                'meta_keywords' => 'Blogs, Articles, Tech Tutorials, WebNDevs',
                'updated_by' => $admin?->id,
            ]
        );

        $this->createSection($page->id, 'hero', 'hero', 0, [
            'tag' => 'ARTICLE DIRECTORY',
            'title1' => 'Software Engineering',
            'title2' => '& Tech Blog',
            'description' => 'In-depth tutorials, system architecture deep dives, and modern web application development insights.',
        ], $admin?->id);

        $this->createSection($page->id, 'header', 'header', 1, [
            'tag' => 'ARTICLE COLLECTION',
            'subheading1' => 'Latest Published',
            'subheading2' => 'Articles & Tutorials',
            'subtext' => 'Stay updated with practical engineering guides written by our senior developers.',
        ], $admin?->id);

        $this->createSection($page->id, 'content', 'content', 2, [
            'tag' => 'FEATURED ARTICLES',
            'subheading1' => 'Featured Engineering',
            'subheading2' => 'Posts & Guides',
            'subtext' => 'Read our top technical guides covering Next.js, Laravel, Docker, and system design patterns.',
            'items' => [
                [
                    'title' => 'Building High-Performance Programmatic SEO Engines with Laravel & React',
                    'category' => 'Engineering',
                    'description' => 'A step-by-step architectural breakdown of scaling dynamic pages using React state and Laravel backend compilers.',
                    'url' => '/blogs/programmatic-seo-engine',
                ],
            ],
        ], $admin?->id);

        $this->createSection($page->id, 'cta', 'cta', 3, [
            'preview' => [
                'text' => 'Subscribe to Newsletter',
                'url' => '/subscribe',
            ],
            'full' => [
                'text' => 'Stay Ahead in Web Engineering',
                'description' => 'Subscribe to get our weekly software architecture articles delivered to your inbox.',
                'url' => '/subscribe',
            ],
        ], $admin?->id);

        // Seeding data for Article Module: "/case-studies"
        $caseStudiesPage = ArticlePage::query()->updateOrCreate(
            ['slug' => '/case-studies'],
            [
                'title' => 'Case Studies',
                'slug' => '/case-studies',
                'status' => 'published',
                'seo_title' => 'Case Studies: Client Success & Technical Results | WebNDevs',
                'seo_description' => 'Explore our deep-dive case studies. Discover how we helped enterprise companies and startups scale.',
                'meta_keywords' => 'Case Studies, Client Success, Systems Engineering, WebNDevs',
                'updated_by' => $admin?->id,
            ]
        );

        $this->createSection($caseStudiesPage->id, 'hero', 'hero', 0, [
            'tag' => 'CLIENT CASE STUDIES',
            'title1' => 'Real Results &',
            'title2' => 'Engineering Impact',
            'description' => 'Explore how our software design, development, and programmatic engines deliver quantifiable business growth.',
        ], $admin?->id);

        $this->createSection($caseStudiesPage->id, 'header', 'header', 1, [
            'tag' => 'SUCCESS STORIES',
            'subheading1' => 'Featured Case',
            'subheading2' => 'Studies & Results',
            'subtext' => 'In-depth project architecture breakdowns and client metrics.',
        ], $admin?->id);

        $this->createSection($caseStudiesPage->id, 'content', 'content', 2, [
            'tag' => 'FEATURED CASES',
            'subheading1' => 'High Impact',
            'subheading2' => 'Client Case Studies',
            'subtext' => 'Quantifiable results shipped for digital platforms.',
            'items' => [
                [
                    'title' => 'Enterprise E-Commerce Engine & Inventory Automation',
                    'category' => 'E-Commerce',
                    'description' => 'Architected a multi-vendor digital marketplace with sub-second page loads and automated inventory sync.',
                    'url' => '/case-studies/ecommerce-engine',
                ],
            ],
        ], $admin?->id);

        $this->createSection($caseStudiesPage->id, 'cta', 'cta', 3, [
            'preview' => [
                'text' => 'View Full Portfolio',
                'url' => '/portfolio',
            ],
            'full' => [
                'text' => 'Achieve Similar Results for Your Platform',
                'description' => 'Connect with our engineering lead to discuss custom software development for your business.',
                'url' => '/contact',
            ],
        ], $admin?->id);
    }

    private function createSection(int $pageId, string $sectionKey, string $sectionType, int $sortOrder, array $data, ?int $adminId): ArticleSection
    {
        return ArticleSection::query()->updateOrCreate(
            [
                'article_page_id' => $pageId,
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
