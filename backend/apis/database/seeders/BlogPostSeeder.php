<?php

namespace Database\Seeders;

use App\Models\BlogPost;
use App\Models\User;
use Illuminate\Database\Seeder;

class BlogPostSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::query()->where('email', 'admin@wnd.local')->first();

        $posts = [
            [
                'title' => 'React vs Next.js in 2026: Which One Fits Your Business?',
                'slug' => 'react-vs-nextjs-2026',
                'excerpt' => 'A practical comparison of React and Next.js for startups, SMBs, and enterprise web platforms.',
                'content' => 'React gives you full flexibility while Next.js adds opinionated performance and routing defaults. For marketing websites and SEO-heavy projects, Next.js usually ships faster with fewer architectural decisions. For product teams with custom platform requirements, React can be the better foundation. The right choice depends on team maturity, deployment constraints, and growth plans.',
                'featured_image' => null,
                'author_name' => 'WND Editorial Team',
                'status' => 'published',
                'tags' => ['react', 'nextjs', 'web development'],
                'published_at' => now()->subDays(8),
            ],
            [
                'title' => 'How to Scope a Web Development Project Without Budget Surprises',
                'slug' => 'scope-web-project-without-budget-surprises',
                'excerpt' => 'Learn the requirements framework we use to keep timelines and budgets realistic.',
                'content' => 'Most budget overruns happen because requirements are too broad at kickoff. Start with business outcomes, list must-have features, and tie each feature to measurable value. Break work into milestones with acceptance criteria. This method gives stakeholders predictable checkpoints and reduces expensive rework later.',
                'featured_image' => null,
                'author_name' => 'WND Project Office',
                'status' => 'published',
                'tags' => ['project management', 'budgeting', 'web strategy'],
                'published_at' => now()->subDays(4),
            ],
            [
                'title' => 'Technical SEO Foundations Every New Website Should Include',
                'slug' => 'technical-seo-foundations-new-websites',
                'excerpt' => 'Core technical SEO checks that improve discoverability before you publish.',
                'content' => 'Before launch, every site needs a clean metadata strategy, structured headings, optimized media, and a crawl-friendly architecture. Performance matters as much as content quality, so prioritize fast rendering and stable layout. Technical SEO is easiest when it is built into development, not added afterward.',
                'featured_image' => null,
                'author_name' => 'WND Growth Team',
                'status' => 'published',
                'tags' => ['seo', 'technical seo', 'website launch'],
                'published_at' => now()->subDays(1),
            ],
        ];

        foreach ($posts as $post) {
            BlogPost::query()->updateOrCreate(
                ['slug' => $post['slug']],
                [
                    ...$post,
                    'created_by' => $admin?->id,
                    'updated_by' => $admin?->id,
                ]
            );
        }
    }
}
