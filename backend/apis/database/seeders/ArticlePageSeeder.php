<?php

namespace Database\Seeders;

use App\Models\ArticlePage;
use App\Models\ArticleSection;
use Illuminate\Database\Seeder;

class ArticlePageSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Blogs page
        $blogsPage = ArticlePage::query()->updateOrCreate(
            ['slug' => '/blogs'],
            [
                'title' => 'Blogs',
                'slug' => '/blogs',
                'status' => 'published',
                'seo_title' => 'Our Blog | WebNDevs',
                'seo_description' => 'Read our latest articles, insights, and tech tutorials.',
                'meta_keywords' => 'Blog, Development, Technology',
            ]
        );

        $this->seedPageSections($blogsPage->id, 'OUR BLOG', 'Blogs & Insights', 'Tech guides and insights from our team.');

        // 2. Create Case Studies page
        $caseStudiesPage = ArticlePage::query()->updateOrCreate(
            ['slug' => '/case-studies'],
            [
                'title' => 'Case Studies',
                'slug' => '/case-studies',
                'status' => 'published',
                'seo_title' => 'Our Case Studies | WebNDevs',
                'seo_description' => 'Explore customer success stories and software project outcomes.',
                'meta_keywords' => 'Case Studies, Software engineering, Success Stories',
            ]
        );

        $this->seedPageSections($caseStudiesPage->id, 'CASE STUDIES', 'Client Success Stories', 'Detailed outcomes of our software and development projects.');
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
        $this->createSection($pageId, 'header', 'items', [
            'tag' => 'RESOURCES',
            'subheading1' => 'Our Collection',
            'subheading2' => 'Of Expert Articles',
            'subtext' => 'Learn how we design, build, and optimize products.',
        ]);

        // Content section (Empty default items)
        $this->createSection($pageId, 'content', 'items', []);

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

    private function createSection(int $pageId, string $sectionKey, string $sectionType, array $data): ArticleSection
    {
        return ArticleSection::query()->updateOrCreate(
            [
                'article_page_id' => $pageId,
                'section_key' => $sectionKey,
            ],
            [
                'section_type' => $sectionType,
                'is_visible' => true,
                'sort_order' => match($sectionKey) {
                    'hero' => 0,
                    'header' => 1,
                    'content' => 2,
                    'cta' => 3,
                    default => 4
                },
                'data' => $data,
            ]
        );
    }
}
