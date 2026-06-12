<?php

namespace Database\Seeders;

use App\Models\BlogPost;
use App\Models\BusinessSize;
use App\Models\CaseStudy;
use App\Models\CaseStudyEntityPivot;
use App\Models\CaseStudyMetric;
use App\Models\ComparisonEntity;
use App\Models\ComparisonFeature;
use App\Models\ComparisonPage;
use App\Models\CrossRefSection;
use App\Models\CrossReferencePage;
use App\Models\FAQ;
use App\Models\Feature;
use App\Models\Industry;
use App\Models\ProcessStep;
use App\Models\Solution;
use App\Models\Tool;
use App\Models\ToolCategory;
use App\Models\UseCase;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProgrammaticContentSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::query()->where('email', 'admin@wnd.local')->first();

        $categories = $this->seedCategories();
        $features = $this->seedFeatures($categories);
        $tools = $this->seedTools($categories, $features);
        $industries = $this->seedIndustries();
        $sizes = $this->seedBusinessSizes();

        $this->seedCrossReferences($tools, $industries);
        $solutions = $this->seedSolutions($tools, $industries, $sizes);
        $this->seedComparisons($tools);
        $this->seedCaseStudies($tools, $industries);
        $this->seedGuideBlogs($admin?->id);
        $this->seedEntityFaqs($tools, $industries, $solutions);
        $this->seedUseCases($tools, $industries, $solutions);
        $this->seedProcessSteps($solutions);
    }

    private function seedCategories(): array
    {
        $rows = [
            ['name' => 'Communication', 'slug' => 'communication', 'description' => 'Messaging, voice, and omnichannel communication APIs.', 'sort_order' => 1],
            ['name' => 'Email', 'slug' => 'email', 'description' => 'Transactional and marketing email delivery platforms.', 'sort_order' => 2],
            ['name' => 'Automation', 'slug' => 'automation', 'description' => 'Workflow automation and integration platforms.', 'sort_order' => 3],
            ['name' => 'CRM', 'slug' => 'crm', 'description' => 'Customer relationship management and sales automation.', 'sort_order' => 4],
            ['name' => 'E-Commerce', 'slug' => 'e-commerce', 'description' => 'Commerce platforms and storefront systems.', 'sort_order' => 5],
            ['name' => 'Web Builders', 'slug' => 'web-builders', 'description' => 'No-code and low-code website builders.', 'sort_order' => 6],
            ['name' => 'Payments', 'slug' => 'payments', 'description' => 'Payment processing and subscription tooling.', 'sort_order' => 7],
            ['name' => 'AI Platforms', 'slug' => 'ai-platforms', 'description' => 'AI model APIs and agent workflows.', 'sort_order' => 8],
        ];

        $map = [];
        foreach ($rows as $row) {
            $category = ToolCategory::query()->updateOrCreate(['slug' => $row['slug']], $row);
            $map[$row['slug']] = $category;
        }

        return $map;
    }

    private function seedFeatures(array $categories): array
    {
        $rows = [
            ['name' => 'SMS API', 'slug' => 'sms-api', 'description' => 'Programmatic SMS sending and delivery tracking.', 'tool_category_id' => $categories['communication']->id],
            ['name' => 'Voice API', 'slug' => 'voice-api', 'description' => 'Programmable voice calling and IVR support.', 'tool_category_id' => $categories['communication']->id],
            ['name' => 'Workflow Builder', 'slug' => 'workflow-builder', 'description' => 'Visual workflow automation and orchestration.', 'tool_category_id' => $categories['automation']->id],
            ['name' => 'CRM Pipelines', 'slug' => 'crm-pipelines', 'description' => 'Lead and deal pipeline lifecycle management.', 'tool_category_id' => $categories['crm']->id],
            ['name' => 'Checkout & Payments', 'slug' => 'checkout-payments', 'description' => 'Checkout experiences and payment capture.', 'tool_category_id' => $categories['payments']->id],
            ['name' => 'Storefront Management', 'slug' => 'storefront-management', 'description' => 'Online storefront and product catalog operations.', 'tool_category_id' => $categories['e-commerce']->id],
            ['name' => 'Visual Site Building', 'slug' => 'visual-site-building', 'description' => 'Drag-and-drop design and publishing workflows.', 'tool_category_id' => $categories['web-builders']->id],
            ['name' => 'AI API Access', 'slug' => 'ai-api-access', 'description' => 'Model APIs for generation, agents, and embeddings.', 'tool_category_id' => $categories['ai-platforms']->id],
        ];

        $map = [];
        foreach ($rows as $row) {
            $feature = Feature::query()->updateOrCreate(['slug' => $row['slug']], $row);
            $map[$row['slug']] = $feature;
        }

        return $map;
    }

    private function seedTools(array $categories, array $features): array
    {
        $rows = [
            ['name' => 'Twilio', 'slug' => 'twilio', 'cat' => 'communication', 'tagline' => 'Programmable communication APIs for SMS, voice, and WhatsApp.', 'pricing_model' => 'usage_based', 'points' => ['SMS and voice APIs', 'Global delivery', 'Webhook-driven events'], 'featured' => true, 'feature_slugs' => ['sms-api', 'voice-api']],
            ['name' => 'SendGrid', 'slug' => 'sendgrid', 'cat' => 'email', 'tagline' => 'Reliable transactional and marketing email at scale.', 'pricing_model' => 'tiered', 'points' => ['Deliverability tooling', 'Templates and segmentation', 'API-first architecture'], 'featured' => true, 'feature_slugs' => ['ai-api-access']],
            ['name' => 'Vonage', 'slug' => 'vonage', 'cat' => 'communication', 'tagline' => 'Communications APIs for voice, messaging, and verification.', 'pricing_model' => 'usage_based', 'points' => ['Voice and messaging APIs', 'Verification flows', 'Regional routing controls'], 'featured' => false, 'feature_slugs' => ['sms-api', 'voice-api']],
            ['name' => 'Zapier', 'slug' => 'zapier', 'cat' => 'automation', 'tagline' => 'No-code automation for apps and business workflows.', 'pricing_model' => 'tiered', 'points' => ['Large app ecosystem', 'Fast setup', 'Reusable automations'], 'featured' => true, 'feature_slugs' => ['workflow-builder']],
            ['name' => 'Make', 'slug' => 'make', 'cat' => 'automation', 'tagline' => 'Visual scenarios for complex process automation.', 'pricing_model' => 'tiered', 'points' => ['Visual scenario builder', 'Deep branching logic', 'Ops visibility'], 'featured' => false, 'feature_slugs' => ['workflow-builder']],
            ['name' => 'n8n', 'slug' => 'n8n', 'cat' => 'automation', 'tagline' => 'Workflow automation with self-hosting flexibility.', 'pricing_model' => 'hybrid', 'points' => ['Self-host option', 'Code steps', 'Custom integrations'], 'featured' => false, 'feature_slugs' => ['workflow-builder']],
            ['name' => 'Zoho CRM', 'slug' => 'zoho-crm', 'cat' => 'crm', 'tagline' => 'CRM platform for sales and customer lifecycle automation.', 'pricing_model' => 'seat_based', 'points' => ['Lead lifecycle views', 'Automation rules', 'Omnichannel inbox'], 'featured' => true, 'feature_slugs' => ['crm-pipelines']],
            ['name' => 'GoHighLevel', 'slug' => 'gohighlevel', 'cat' => 'crm', 'tagline' => 'All-in-one CRM and marketing automation for agencies.', 'pricing_model' => 'subscription', 'points' => ['Agency-focused workflows', 'Funnels and messaging', 'Snapshot deployment'], 'featured' => true, 'feature_slugs' => ['crm-pipelines', 'workflow-builder']],
            ['name' => 'HubSpot', 'slug' => 'hubspot', 'cat' => 'crm', 'tagline' => 'Unified CRM with marketing, sales, and service hubs.', 'pricing_model' => 'tiered', 'points' => ['Contact intelligence', 'Sales pipeline automation', 'Content and campaigns'], 'featured' => true, 'feature_slugs' => ['crm-pipelines']],
            ['name' => 'Salesforce', 'slug' => 'salesforce', 'cat' => 'crm', 'tagline' => 'Enterprise-grade CRM and workflow platform.', 'pricing_model' => 'seat_based', 'points' => ['Enterprise customizations', 'Advanced reporting', 'Extensible ecosystem'], 'featured' => false, 'feature_slugs' => ['crm-pipelines']],
            ['name' => 'Shopify', 'slug' => 'shopify', 'cat' => 'e-commerce', 'tagline' => 'Hosted e-commerce platform for modern storefronts.', 'pricing_model' => 'subscription', 'points' => ['Fast storefront launch', 'Payments and checkout', 'App ecosystem'], 'featured' => true, 'feature_slugs' => ['storefront-management', 'checkout-payments']],
            ['name' => 'WooCommerce', 'slug' => 'woocommerce', 'cat' => 'e-commerce', 'tagline' => 'WordPress-native commerce stack with deep flexibility.', 'pricing_model' => 'open_source', 'points' => ['WordPress integration', 'Plugin extensibility', 'Theme flexibility'], 'featured' => false, 'feature_slugs' => ['storefront-management']],
            ['name' => 'Wix', 'slug' => 'wix', 'cat' => 'web-builders', 'tagline' => 'No-code website builder with built-in commerce options.', 'pricing_model' => 'subscription', 'points' => ['Template-first setup', 'Managed hosting', 'Marketing add-ons'], 'featured' => false, 'feature_slugs' => ['visual-site-building']],
            ['name' => 'Framer', 'slug' => 'framer', 'cat' => 'web-builders', 'tagline' => 'Design-forward website builder with rapid iteration.', 'pricing_model' => 'subscription', 'points' => ['Design and publish speed', 'Interactive layouts', 'Team collaboration'], 'featured' => false, 'feature_slugs' => ['visual-site-building']],
            ['name' => 'Webflow', 'slug' => 'webflow', 'cat' => 'web-builders', 'tagline' => 'Visual development platform for scalable websites.', 'pricing_model' => 'tiered', 'points' => ['CMS and collections', 'Custom interactions', 'Deployment controls'], 'featured' => true, 'feature_slugs' => ['visual-site-building']],
            ['name' => 'Stripe', 'slug' => 'stripe', 'cat' => 'payments', 'tagline' => 'Payments infrastructure for online businesses.', 'pricing_model' => 'usage_based', 'points' => ['Global payment methods', 'Subscription billing', 'Fraud prevention'], 'featured' => true, 'feature_slugs' => ['checkout-payments']],
            ['name' => 'OpenAI / Claude API', 'slug' => 'openai-claude-api', 'cat' => 'ai-platforms', 'tagline' => 'AI model APIs for content, automation, and assistants.', 'pricing_model' => 'usage_based', 'points' => ['LLM text generation', 'Tool usage and function calling', 'Embeddings and retrieval'], 'featured' => true, 'feature_slugs' => ['ai-api-access', 'workflow-builder']],
        ];

        $toolMap = [];
        foreach ($rows as $index => $row) {
            $tool = Tool::query()->updateOrCreate(
                ['slug' => $row['slug']],
                [
                    'tool_category_id' => $categories[$row['cat']]->id,
                    'name' => $row['name'],
                    'slug' => $row['slug'],
                    'tagline' => $row['tagline'],
                    'logo_url' => null,
                    'website_url' => 'https://www.'.str_replace([' ', '/'], ['', ''], Str::slug($row['name'])).'.com',
                    'docs_url' => null,
                    'overview' => $row['tagline'].' This platform is commonly included in integration projects for growth, automation, and customer experience.',
                    'key_points' => $row['points'],
                    'pricing_model' => $row['pricing_model'],
                    'is_featured' => $row['featured'],
                    'is_active' => true,
                    'sort_order' => $index + 1,
                    'status' => 'published',
                    'published_at' => now()->subDays(15),
                ]
            );

            $tool->features()->sync(
                collect($row['feature_slugs'])
                    ->map(fn (string $slug) => $features[$slug]->id)
                    ->values()
                    ->all()
            );

            $toolMap[$row['slug']] = $tool;
        }

        return $toolMap;
    }

    private function seedIndustries(): array
    {
        $rows = [
            ['name' => 'Healthcare', 'slug' => 'healthcare', 'tagline' => 'Patient communication and compliance-first workflows.', 'pain_points' => ['Missed appointments', 'Manual intake', 'Disconnected messaging'], 'key_stats' => ['No-show rates can exceed 20%', 'Response time impacts care quality']],
            ['name' => 'Finance & Fintech', 'slug' => 'finance-fintech', 'tagline' => 'Secure customer journeys and compliant automation.', 'pain_points' => ['Slow onboarding', 'Regulatory friction', 'Support backlog'], 'key_stats' => ['Faster KYC improves conversion', 'Automation reduces support overhead']],
            ['name' => 'Real Estate', 'slug' => 'real-estate', 'tagline' => 'Lead response automation and pipeline visibility.', 'pain_points' => ['Lead leakage', 'Slow follow-ups', 'Manual qualification'], 'key_stats' => ['Speed-to-lead drives win rates', 'Automated nurture improves close rate']],
            ['name' => 'E-Commerce', 'slug' => 'e-commerce', 'tagline' => 'Conversion, retention, and order lifecycle optimization.', 'pain_points' => ['Cart abandonment', 'Support load', 'Inventory visibility gaps'], 'key_stats' => ['Lifecycle messaging boosts repeat orders', 'Checkout friction lowers conversion']],
            ['name' => 'Education', 'slug' => 'education', 'tagline' => 'Student communication and enrollment operations.', 'pain_points' => ['Low student engagement', 'Manual reminders', 'Fragmented systems'], 'key_stats' => ['Automated reminders improve attendance', 'CRM improves enrollment pipeline']],
            ['name' => 'Legal', 'slug' => 'legal', 'tagline' => 'Client communication and intake automation for law firms.', 'pain_points' => ['Delayed callbacks', 'Manual case intake', 'Poor matter visibility'], 'key_stats' => ['Lead response speed impacts signed retainers', 'Automation cuts admin overhead']],
            ['name' => 'Hospitality', 'slug' => 'hospitality', 'tagline' => 'Guest communication and booking workflow automation.', 'pain_points' => ['Booking abandonment', 'Delayed confirmations', 'Disconnected messaging'], 'key_stats' => ['Real-time messaging improves booking confidence', 'Automation increases upsell rates']],
        ];

        $map = [];
        foreach ($rows as $row) {
            $industry = Industry::query()->updateOrCreate(
                ['slug' => $row['slug']],
                [
                    'name' => $row['name'],
                    'slug' => $row['slug'],
                    'icon' => null,
                    'tagline' => $row['tagline'],
                    'description' => $row['tagline'].' We tailor tool stacks, workflows, and integrations around this sector.',
                    'hero_image_url' => null,
                    'pain_points' => $row['pain_points'],
                    'key_stats' => $row['key_stats'],
                    'is_featured' => true,
                    'status' => 'published',
                ]
            );
            $map[$row['slug']] = $industry;
        }

        return $map;
    }

    private function seedBusinessSizes(): array
    {
        $rows = [
            ['name' => 'Startup', 'slug' => 'startup', 'employee_range' => '1-10', 'description' => 'Fast-moving teams validating product-market fit.', 'sort_order' => 1],
            ['name' => 'SMB', 'slug' => 'smb', 'employee_range' => '11-100', 'description' => 'Growing businesses optimizing operations.', 'sort_order' => 2],
            ['name' => 'Mid-Market', 'slug' => 'mid-market', 'employee_range' => '101-1000', 'description' => 'Scaling organizations with multi-team coordination.', 'sort_order' => 3],
            ['name' => 'Enterprise', 'slug' => 'enterprise', 'employee_range' => '1000+', 'description' => 'Large organizations with advanced governance and integrations.', 'sort_order' => 4],
        ];

        $map = [];
        foreach ($rows as $row) {
            $size = BusinessSize::query()->updateOrCreate(['slug' => $row['slug']], $row);
            $map[$row['slug']] = $size;
        }

        return $map;
    }

    private function seedCrossReferences(array $tools, array $industries): void
    {
        $pairs = [
            ['title' => 'Twilio for Healthcare Communication', 'a_type' => Industry::class, 'a' => 'healthcare', 'b_type' => Tool::class, 'b' => 'twilio'],
            ['title' => 'Twilio for Finance Customer Notifications', 'a_type' => Industry::class, 'a' => 'finance-fintech', 'b_type' => Tool::class, 'b' => 'twilio'],
            ['title' => 'Twilio for Real Estate Lead Nurture', 'a_type' => Industry::class, 'a' => 'real-estate', 'b_type' => Tool::class, 'b' => 'twilio'],
            ['title' => 'Twilio + Zapier Integration', 'a_type' => Tool::class, 'a' => 'twilio', 'b_type' => Tool::class, 'b' => 'zapier'],
            ['title' => 'Twilio + Make Integration', 'a_type' => Tool::class, 'a' => 'twilio', 'b_type' => Tool::class, 'b' => 'make'],
            ['title' => 'Twilio + Zoho CRM Integration', 'a_type' => Tool::class, 'a' => 'twilio', 'b_type' => Tool::class, 'b' => 'zoho-crm'],
            ['title' => 'Twilio + GoHighLevel Integration', 'a_type' => Tool::class, 'a' => 'twilio', 'b_type' => Tool::class, 'b' => 'gohighlevel'],
            ['title' => 'Zoho CRM for Healthcare', 'a_type' => Industry::class, 'a' => 'healthcare', 'b_type' => Tool::class, 'b' => 'zoho-crm'],
            ['title' => 'Zoho CRM for Real Estate', 'a_type' => Industry::class, 'a' => 'real-estate', 'b_type' => Tool::class, 'b' => 'zoho-crm'],
            ['title' => 'GoHighLevel for Real Estate', 'a_type' => Industry::class, 'a' => 'real-estate', 'b_type' => Tool::class, 'b' => 'gohighlevel'],
            ['title' => 'GoHighLevel for Healthcare', 'a_type' => Industry::class, 'a' => 'healthcare', 'b_type' => Tool::class, 'b' => 'gohighlevel'],
            ['title' => 'Zapier + Shopify Automation', 'a_type' => Tool::class, 'a' => 'zapier', 'b_type' => Tool::class, 'b' => 'shopify'],
            ['title' => 'Make + Shopify Automation', 'a_type' => Tool::class, 'a' => 'make', 'b_type' => Tool::class, 'b' => 'shopify'],
            ['title' => 'n8n + Zoho CRM Automation', 'a_type' => Tool::class, 'a' => 'n8n', 'b_type' => Tool::class, 'b' => 'zoho-crm'],
            ['title' => 'Shopify for E-Commerce Brands', 'a_type' => Industry::class, 'a' => 'e-commerce', 'b_type' => Tool::class, 'b' => 'shopify'],
            ['title' => 'Framer + AI Integration', 'a_type' => Tool::class, 'a' => 'framer', 'b_type' => Tool::class, 'b' => 'openai-claude-api'],
            ['title' => 'Webflow for Healthcare', 'a_type' => Industry::class, 'a' => 'healthcare', 'b_type' => Tool::class, 'b' => 'webflow'],
            ['title' => 'Stripe for E-Commerce Payments', 'a_type' => Industry::class, 'a' => 'e-commerce', 'b_type' => Tool::class, 'b' => 'stripe'],
            ['title' => 'HubSpot for Finance Teams', 'a_type' => Industry::class, 'a' => 'finance-fintech', 'b_type' => Tool::class, 'b' => 'hubspot'],
            ['title' => 'Salesforce for Healthcare Operations', 'a_type' => Industry::class, 'a' => 'healthcare', 'b_type' => Tool::class, 'b' => 'salesforce'],
        ];

        foreach ($pairs as $pair) {
            $entityA = $pair['a_type'] === Tool::class ? $tools[$pair['a']] : $industries[$pair['a']];
            $entityB = $pair['b_type'] === Tool::class ? $tools[$pair['b']] : $industries[$pair['b']];
            $slug = Str::slug($pair['title']);
            $urlPath = '/cross-reference/'.$slug;

            $page = CrossReferencePage::query()->updateOrCreate(
                ['slug' => $slug],
                [
                    'entity_a_type' => $pair['a_type'],
                    'entity_a_id' => $entityA->id,
                    'entity_b_type' => $pair['b_type'],
                    'entity_b_id' => $entityB->id,
                    'entity_c_type' => null,
                    'entity_c_id' => null,
                    'url_path' => $urlPath,
                    'title' => $pair['title'],
                    'subtitle' => "How {$entityA->name} works with {$entityB->name} in a production-ready workflow.",
                    'quick_answer' => "{$entityA->name} and {$entityB->name} work well together when integrated with event-based automation and clear ownership of data flows.",
                    'meta_title' => $pair['title'].' | WebNDevs',
                    'meta_description' => "Integration guide for {$entityA->name} and {$entityB->name} including use cases, implementation steps, and outcomes.",
                    'og_image_url' => null,
                    'status' => 'published',
                    'published_at' => now()->subDays(7),
                ]
            );

            $sections = [
                ['section_key' => 'overview', 'title' => 'Integration Overview', 'content' => "This setup combines {$entityA->name} and {$entityB->name} to improve response times and reduce manual work."],
                ['section_key' => 'implementation', 'title' => 'Implementation Plan', 'content' => 'Define event triggers, map source and target data, then deploy with monitoring and retry handling.'],
                ['section_key' => 'results', 'title' => 'Expected Results', 'content' => 'Teams typically see faster cycle time, fewer missed handoffs, and better customer visibility.'],
            ];

            foreach ($sections as $i => $section) {
                CrossRefSection::query()->updateOrCreate(
                    [
                        'cross_reference_page_id' => $page->id,
                        'section_key' => $section['section_key'],
                    ],
                    [
                        'title' => $section['title'],
                        'content' => $section['content'],
                        'data' => null,
                        'sort_order' => $i + 1,
                        'is_visible' => true,
                        'ai_generated' => false,
                    ]
                );
            }
        }
    }

    private function seedSolutions(array $tools, array $industries, array $sizes): array
    {
        $rows = [
            [
                'name' => 'Appointment Reminder System',
                'slug' => 'appointment-reminder-system',
                'industry' => 'healthcare',
                'size' => 'smb',
                'tools' => [
                    ['slug' => 'twilio', 'role' => 'primary'],
                    ['slug' => 'zoho-crm', 'role' => 'supporting'],
                    ['slug' => 'make', 'role' => 'supporting'],
                ],
            ],
            [
                'name' => 'Lead Generation Pipeline',
                'slug' => 'lead-generation-pipeline',
                'industry' => 'finance-fintech',
                'size' => 'mid-market',
                'tools' => [
                    ['slug' => 'hubspot', 'role' => 'primary'],
                    ['slug' => 'make', 'role' => 'supporting'],
                    ['slug' => 'twilio', 'role' => 'supporting'],
                ],
            ],
            [
                'name' => 'Customer Support System',
                'slug' => 'customer-support-system',
                'industry' => 'real-estate',
                'size' => 'smb',
                'tools' => [
                    ['slug' => 'twilio', 'role' => 'primary'],
                    ['slug' => 'zoho-crm', 'role' => 'supporting'],
                    ['slug' => 'zapier', 'role' => 'supporting'],
                ],
            ],
            [
                'name' => 'E-Commerce Order Automation',
                'slug' => 'ecommerce-order-automation',
                'industry' => 'e-commerce',
                'size' => 'smb',
                'tools' => [
                    ['slug' => 'shopify', 'role' => 'primary'],
                    ['slug' => 'zapier', 'role' => 'supporting'],
                    ['slug' => 'twilio', 'role' => 'optional'],
                ],
            ],
            [
                'name' => 'Patient Communication Platform',
                'slug' => 'patient-communication-platform',
                'industry' => 'healthcare',
                'size' => 'mid-market',
                'tools' => [
                    ['slug' => 'twilio', 'role' => 'primary'],
                    ['slug' => 'gohighlevel', 'role' => 'supporting'],
                    ['slug' => 'n8n', 'role' => 'supporting'],
                ],
            ],
        ];

        $map = [];
        foreach ($rows as $row) {
            $solution = Solution::query()->updateOrCreate(
                ['slug' => $row['slug']],
                [
                    'industry_id' => $industries[$row['industry']]->id,
                    'business_size_id' => $sizes[$row['size']]->id,
                    'name' => $row['name'],
                    'slug' => $row['slug'],
                    'tagline' => "{$row['name']} with measurable operational outcomes.",
                    'problem_statement' => 'Teams struggle with disconnected systems and delayed response cycles.',
                    'solution_summary' => 'This solution coordinates communication, automation, and CRM actions in one workflow.',
                    'workflow_description' => 'Capture event, validate payload, route to the correct system, and notify teams with audit-friendly logs.',
                    'key_benefits' => ['Faster response time', 'Higher process consistency', 'Better operational visibility'],
                    'technical_requirements' => 'API credentials, webhook endpoints, and environment-level secrets management.',
                    'status' => 'published',
                ]
            );

            $toolSync = [];
            foreach ($row['tools'] as $i => $toolSpec) {
                $toolSync[$tools[$toolSpec['slug']]->id] = [
                    'tool_role' => $toolSpec['role'],
                    'sort_order' => $i + 1,
                    'notes' => ucfirst($toolSpec['role']).' role in the implementation.',
                ];
            }
            $solution->tools()->sync($toolSync);
            $map[$row['slug']] = $solution;
        }

        return $map;
    }

    private function seedComparisons(array $tools): void
    {
        $rows = [
            [
                'slug' => 'make-vs-zapier-vs-n8n',
                'title' => 'Make vs Zapier vs n8n',
                'entities' => ['make', 'zapier', 'n8n'],
                'features' => [
                    ['feature_name' => 'Best For', 'values' => ['Complex workflows', 'Quick setup', 'Self-hosted control']],
                    ['feature_name' => 'Hosting Model', 'values' => ['Cloud', 'Cloud', 'Cloud or Self-hosted']],
                    ['feature_name' => 'Technical Depth', 'values' => ['Medium', 'Low', 'High']],
                ],
            ],
            [
                'slug' => 'zoho-crm-vs-hubspot-vs-salesforce',
                'title' => 'Zoho CRM vs HubSpot vs Salesforce',
                'entities' => ['zoho-crm', 'hubspot', 'salesforce'],
                'features' => [
                    ['feature_name' => 'Best For', 'values' => ['Cost-conscious teams', 'Growth marketing teams', 'Enterprise scale']],
                    ['feature_name' => 'Customization Depth', 'values' => ['Medium', 'Medium', 'High']],
                    ['feature_name' => 'Learning Curve', 'values' => ['Moderate', 'Low', 'High']],
                ],
            ],
            [
                'slug' => 'twilio-vs-vonage',
                'title' => 'Twilio vs Vonage',
                'entities' => ['twilio', 'vonage'],
                'features' => [
                    ['feature_name' => 'Core Strength', 'values' => ['Developer ecosystem', 'Comms package flexibility']],
                    ['feature_name' => 'Global Coverage', 'values' => ['Strong', 'Strong']],
                    ['feature_name' => 'API Breadth', 'values' => ['Very broad', 'Broad']],
                ],
            ],
            [
                'slug' => 'shopify-vs-woocommerce-vs-wix',
                'title' => 'Shopify vs WooCommerce vs Wix',
                'entities' => ['shopify', 'woocommerce', 'wix'],
                'features' => [
                    ['feature_name' => 'Setup Speed', 'values' => ['Fast', 'Moderate', 'Fast']],
                    ['feature_name' => 'Customization', 'values' => ['Medium', 'High', 'Medium']],
                    ['feature_name' => 'Maintenance Overhead', 'values' => ['Low', 'High', 'Low']],
                ],
            ],
        ];

        foreach ($rows as $row) {
            $page = ComparisonPage::query()->updateOrCreate(
                ['slug' => $row['slug']],
                [
                    'title' => $row['title'],
                    'subtitle' => "A practical side-by-side guide to choosing between {$row['title']}.",
                    'quick_verdict' => 'Choose based on implementation constraints, team skills, and required extensibility.',
                    'recommendation' => 'Start with a pilot flow and select the option that meets both current speed and future scale.',
                    'intro_content' => 'This comparison focuses on operational fit, implementation effort, and long-term maintainability.',
                    'status' => 'published',
                ]
            );

            ComparisonEntity::query()->where('comparison_page_id', $page->id)->delete();
            ComparisonFeature::query()->where('comparison_page_id', $page->id)->delete();

            foreach ($row['entities'] as $i => $slug) {
                ComparisonEntity::query()->create([
                    'comparison_page_id' => $page->id,
                    'entity_type' => Tool::class,
                    'entity_id' => $tools[$slug]->id,
                    'position' => $i,
                    'tag' => $i === 0 ? 'recommended' : null,
                ]);
            }

            foreach ($row['features'] as $i => $feature) {
                ComparisonFeature::query()->create([
                    'comparison_page_id' => $page->id,
                    'feature_name' => $feature['feature_name'],
                    'category' => 'overview',
                    'values' => $feature['values'],
                    'is_highlighted' => $i === 0,
                    'sort_order' => $i + 1,
                ]);
            }
        }
    }

    private function seedCaseStudies(array $tools, array $industries): void
    {
        $rows = [
            [
                'slug' => 'healthcare-reminder-no-show-reduction',
                'title' => 'Healthcare Reminder Automation Reduced No-Shows by 31%',
                'client_name' => 'North Ridge Clinic Group',
                'client_industry' => 'Healthcare',
                'challenge' => 'Manual reminders caused frequent missed appointments and staff overload.',
                'solution' => 'Implemented Twilio messaging, Zoho CRM synchronization, and Make automation for appointment workflows.',
                'results_summary' => 'The clinic reduced no-shows, improved patient response time, and streamlined front-desk workload.',
                'timeline' => '8 weeks',
                'tool_slugs' => ['twilio', 'zoho-crm', 'make'],
                'industry_slug' => 'healthcare',
                'metrics' => [
                    ['label' => 'No-show Rate', 'before' => '22', 'after' => '15', 'unit' => '%', 'improvement' => '-31.8%'],
                    ['label' => 'Average Response Time', 'before' => '5.2', 'after' => '2.8', 'unit' => 'hours', 'improvement' => '-46.1%'],
                ],
            ],
            [
                'slug' => 'fintech-lead-pipeline-acceleration',
                'title' => 'Fintech Lead Pipeline Improved Conversion by 24%',
                'client_name' => 'Summit Finance Network',
                'client_industry' => 'Finance & Fintech',
                'challenge' => 'Leads from ads and forms were not routed quickly to the correct account executives.',
                'solution' => 'Connected HubSpot pipelines with Make scenarios and Twilio alerts for SLA-based lead routing.',
                'results_summary' => 'Sales teams improved first-response consistency and closed more qualified opportunities.',
                'timeline' => '10 weeks',
                'tool_slugs' => ['hubspot', 'make', 'twilio'],
                'industry_slug' => 'finance-fintech',
                'metrics' => [
                    ['label' => 'Lead-to-Meeting Rate', 'before' => '18', 'after' => '27', 'unit' => '%', 'improvement' => '+50.0%'],
                    ['label' => 'Qualified Conversion', 'before' => '21', 'after' => '26', 'unit' => '%', 'improvement' => '+23.8%'],
                ],
            ],
            [
                'slug' => 'ecommerce-order-flow-automation',
                'title' => 'E-Commerce Automation Cut Order Handling Time by 39%',
                'client_name' => 'Arc Lane Commerce',
                'client_industry' => 'E-Commerce',
                'challenge' => 'Order updates, abandoned cart follow-up, and support handoffs were managed manually.',
                'solution' => 'Integrated Shopify, Zapier, and Twilio to automate order lifecycle communication and support triggers.',
                'results_summary' => 'Operations gained faster order handling and customers received clearer status updates.',
                'timeline' => '6 weeks',
                'tool_slugs' => ['shopify', 'zapier', 'twilio'],
                'industry_slug' => 'e-commerce',
                'metrics' => [
                    ['label' => 'Order Processing Time', 'before' => '18', 'after' => '11', 'unit' => 'minutes', 'improvement' => '-38.9%'],
                    ['label' => 'Support Ticket Volume', 'before' => '740', 'after' => '560', 'unit' => '/month', 'improvement' => '-24.3%'],
                ],
            ],
        ];

        foreach ($rows as $row) {
            $caseStudy = CaseStudy::query()->updateOrCreate(
                ['slug' => $row['slug']],
                [
                    'title' => $row['title'],
                    'client_name' => $row['client_name'],
                    'client_industry' => $row['client_industry'],
                    'client_logo_url' => null,
                    'challenge' => $row['challenge'],
                    'solution' => $row['solution'],
                    'results_summary' => $row['results_summary'],
                    'timeline' => $row['timeline'],
                    'featured_image_url' => null,
                    'is_featured' => true,
                    'status' => 'published',
                    'published_at' => now()->subDays(3),
                ]
            );

            CaseStudyMetric::query()->where('case_study_id', $caseStudy->id)->delete();
            foreach ($row['metrics'] as $i => $metric) {
                CaseStudyMetric::query()->create([
                    'case_study_id' => $caseStudy->id,
                    'label' => $metric['label'],
                    'before_value' => $metric['before'],
                    'after_value' => $metric['after'],
                    'unit' => $metric['unit'],
                    'improvement' => $metric['improvement'],
                    'sort_order' => $i + 1,
                ]);
            }

            CaseStudyEntityPivot::query()->where('case_study_id', $caseStudy->id)->delete();
            foreach ($row['tool_slugs'] as $slug) {
                CaseStudyEntityPivot::query()->create([
                    'case_study_id' => $caseStudy->id,
                    'entity_type' => Tool::class,
                    'entity_id' => $tools[$slug]->id,
                ]);
            }
            CaseStudyEntityPivot::query()->create([
                'case_study_id' => $caseStudy->id,
                'entity_type' => Industry::class,
                'entity_id' => $industries[$row['industry_slug']]->id,
            ]);
        }
    }

    private function seedGuideBlogs(?int $adminId): void
    {
        $guides = [
            [
                'title' => 'Complete Guide to Twilio Integration for Business',
                'slug' => 'complete-guide-to-twilio-integration-for-business',
                'excerpt' => 'Architecture patterns, rollout strategy, and practical guardrails for Twilio implementations.',
                'content' => str_repeat('Twilio integration success depends on clear event modeling, reliable webhook processing, retries, observability, and staged rollout planning. ', 80),
                'tags' => ['twilio', 'communication api', 'integration'],
            ],
            [
                'title' => 'Healthcare Technology Stack Guide 2025',
                'slug' => 'healthcare-technology-stack-guide-2025',
                'excerpt' => 'How healthcare teams combine CRM, messaging, and workflow automation for better outcomes.',
                'content' => str_repeat('Healthcare stack design should align patient journey touchpoints with secure data exchange, proactive communication workflows, and measurable service-level targets. ', 55),
                'tags' => ['healthcare', 'crm', 'automation'],
            ],
            [
                'title' => 'Make vs Zapier vs n8n — Full Comparison Guide 2025',
                'slug' => 'make-vs-zapier-vs-n8n-full-comparison-guide-2025',
                'excerpt' => 'An in-depth framework for selecting the right automation platform.',
                'content' => str_repeat('Automation platform choice should consider integration depth, governance constraints, throughput requirements, troubleshooting visibility, and team skill profile. ', 70),
                'tags' => ['make', 'zapier', 'n8n', 'automation'],
            ],
        ];

        foreach ($guides as $guide) {
            BlogPost::query()->updateOrCreate(
                ['slug' => $guide['slug']],
                [
                    'title' => $guide['title'],
                    'excerpt' => $guide['excerpt'],
                    'content' => $guide['content'],
                    'featured_image' => null,
                    'author_name' => 'WND Editorial Team',
                    'status' => 'published',
                    'tags' => $guide['tags'],
                    'published_at' => now()->subDays(2),
                    'created_by' => $adminId,
                    'updated_by' => $adminId,
                ]
            );
        }
    }

    private function seedEntityFaqs(array $tools, array $industries, array $solutions): void
    {
        foreach ($tools as $tool) {
            $this->upsertFaqSet(
                Tool::class,
                $tool->id,
                [
                    "What is {$tool->name} best used for?" => "{$tool->name} is best used when teams need reliable integrations and automation around communication or operations.",
                    "How long does {$tool->name} integration take?" => 'Most integrations launch in 2-6 weeks depending on system complexity and data mapping requirements.',
                    "Can {$tool->name} connect with CRM and automation tools?" => 'Yes, it can be connected through APIs, native connectors, and workflow orchestration.',
                ]
            );
        }

        foreach ($industries as $industry) {
            $this->upsertFaqSet(
                Industry::class,
                $industry->id,
                [
                    "Why does {$industry->name} need automation?" => "Automation reduces repetitive operational load and improves consistency for {$industry->name} teams.",
                    "What stack works best for {$industry->name}?" => 'A common stack combines communication APIs, CRM workflows, and integration orchestration.',
                    "How do we measure ROI in {$industry->name} projects?" => 'Track response time, conversion lift, cost per process, and error-rate reduction.',
                ]
            );
        }

        foreach ($solutions as $solution) {
            $this->upsertFaqSet(
                Solution::class,
                $solution->id,
                [
                    "What outcome does {$solution->name} target?" => 'It targets faster service delivery, fewer handoff errors, and better customer communication.',
                    "Is {$solution->name} suitable for SMB teams?" => 'Yes, the implementation can be phased and scoped to SMB budget and process maturity.',
                    "Can this solution scale to enterprise usage?" => 'Yes, with proper API governance, queueing, and monitoring standards.',
                ]
            );
        }
    }

    private function upsertFaqSet(string $entityType, int $entityId, array $pairs): void
    {
        $i = 0;
        foreach ($pairs as $question => $answer) {
            FAQ::query()->updateOrCreate(
                [
                    'entity_type' => $entityType,
                    'entity_id' => $entityId,
                    'question' => $question,
                ],
                [
                    'answer' => $answer,
                    'sort_order' => $i++,
                    'is_active' => true,
                    'ai_generated' => false,
                ]
            );
        }
    }

    private function seedUseCases(array $tools, array $industries, array $solutions): void
    {
        foreach ($tools as $tool) {
            UseCase::query()->updateOrCreate(
                [
                    'entity_type' => Tool::class,
                    'entity_id' => $tool->id,
                    'title' => "{$tool->name} Lead Response Automation",
                ],
                [
                    'description' => "Use {$tool->name} to trigger real-time lead routing and follow-up messaging based on source and intent.",
                    'icon' => 'workflow',
                    'industry_id' => null,
                    'sort_order' => 1,
                ]
            );
        }

        foreach ($industries as $industry) {
            UseCase::query()->updateOrCreate(
                [
                    'entity_type' => Industry::class,
                    'entity_id' => $industry->id,
                    'title' => "{$industry->name} Lifecycle Messaging",
                ],
                [
                    'description' => "Create automated reminders, updates, and escalations for {$industry->name} customer journeys.",
                    'icon' => 'message-square',
                    'industry_id' => $industry->id,
                    'sort_order' => 1,
                ]
            );
        }

        foreach ($solutions as $solution) {
            UseCase::query()->updateOrCreate(
                [
                    'entity_type' => Solution::class,
                    'entity_id' => $solution->id,
                    'title' => "{$solution->name} SLA Workflow",
                ],
                [
                    'description' => 'Trigger process steps with SLA timers and fallback escalation for missed actions.',
                    'icon' => 'timer',
                    'industry_id' => $solution->industry_id,
                    'sort_order' => 1,
                ]
            );
        }
    }

    private function seedProcessSteps(array $solutions): void
    {
        foreach ($solutions as $solution) {
            $steps = [
                [1, 'Discovery & Mapping', 'Map data sources, events, and ownership before implementation.'],
                [2, 'Integration Build', 'Implement connectors, transformations, and secure credential handling.'],
                [3, 'Validation & QA', 'Run scenario testing with edge-case verification and retry coverage.'],
                [4, 'Go-Live & Monitoring', 'Launch in stages and monitor delivery, errors, and SLA metrics.'],
                [5, 'Optimization', 'Refine workflow rules based on conversion and throughput data.'],
            ];

            foreach ($steps as [$stepNumber, $title, $description]) {
                ProcessStep::query()->updateOrCreate(
                    [
                        'entity_type' => Solution::class,
                        'entity_id' => $solution->id,
                        'step_number' => $stepNumber,
                    ],
                    [
                        'title' => $title,
                        'description' => $description,
                        'icon' => null,
                        'duration' => '1-2 weeks',
                    ]
                );
            }
        }
    }
}
