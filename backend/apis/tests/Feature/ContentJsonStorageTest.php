<?php

namespace Tests\Feature;

use App\Models\ContentItem;
use App\Models\ContentPage;
use App\Models\ContentSection;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContentJsonStorageTest extends TestCase
{
    use RefreshDatabase;

    public function test_content_page_api_returns_json_data_for_sections_and_items(): void
    {
        $page = ContentPage::create([
            'title' => 'Home',
            'slug' => 'home',
            'status' => 'published',
        ]);

        $section = ContentSection::create([
            'content_page_id' => $page->id,
            'section_key' => 'hero',
            'section_type' => 'hero',
            'title' => 'Hero',
            'is_visible' => true,
            'sort_order' => 0,
            'data' => [
                'tag' => 'Hello',
                'title1' => 'Build',
                'title2' => 'Fast',
            ],
        ]);

        ContentItem::create([
            'content_section_id' => $section->id,
            'title' => 'Example item',
            'sort_order' => 0,
            'is_featured' => false,
            'is_active' => true,
            'data' => [
                'title' => 'Example item',
                'description' => 'A sample item',
            ],
        ]);

        $response = $this->getJson('/api/v1/content-pages/home');

        $response->assertOk();
        $response->assertJsonPath('data.sections.0.data.tag', 'Hello');
        $response->assertJsonPath('data.sections.0.items.0.data.title', 'Example item');
        $response->assertJsonPath('data.sections.0.items.0.data.description', 'A sample item');
    }

    public function test_content_page_api_supports_slug_with_slash(): void
    {
        $page = ContentPage::create([
            'title' => 'Data Hub',
            'slug' => '/datahub',
            'status' => 'published',
        ]);

        $response = $this->getJson('/api/v1/content-pages/' . urlencode('/datahub'));

        $response->assertOk();
        $response->assertJsonPath('data.slug', '/datahub');
    }

    public function test_content_page_sections_route_supports_slug_with_slash(): void
    {
        $page = ContentPage::create([
            'title' => 'Data Hub',
            'slug' => '/datahub',
            'status' => 'published',
        ]);

        $section = ContentSection::create([
            'content_page_id' => $page->id,
            'section_key' => 'hero',
            'section_type' => 'hero',
            'title' => 'Hero',
            'is_visible' => true,
            'sort_order' => 0,
        ]);

        // Test fetching sections list
        $responseList = $this->getJson('/api/v1/content-pages/' . urlencode('/datahub') . '/sections');
        $responseList->assertOk();

        // Test fetching single section
        $responseShow = $this->getJson('/api/v1/content-pages/' . urlencode('/datahub') . '/sections/' . $section->id);
        $responseShow->assertOk();
    }

    public function test_service_page_sections_sync_retains_nested_metadata(): void
    {
        $service = \App\Models\Service::create([
            'name' => 'Web Design',
            'slug' => 'web-design',
            'category' => 'Design',
            'status' => 'active',
            'base_price' => 100,
        ]);

        $payload = [
            'locale' => 'en',
            'publish' => true,
            'sections' => [
                [
                    'section_key' => 'solutions',
                    'heading' => 'Solutions Heading',
                    'subheading' => 'Solutions Subheading',
                    'is_active' => true,
                    'items' => [
                        [
                            'tag' => 'My Solution Tag',
                            'heading' => 'Nested Heading',
                            'subheading' => 'Nested Subheading',
                            'subtext' => 'Nested Subtext',
                        ]
                    ]
                ]
            ]
        ];

        $user = \App\Models\User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
            'is_admin' => true,
        ]);

        $response = $this->actingAs($user, 'sanctum')->putJson("/api/v1/services/{$service->slug}/sections", $payload);

        $response->assertOk();
        
        $stored = \App\Models\ServicePageContent::where('service_id', $service->id)
            ->where('section_key', 'solutions')
            ->first();

        $this->assertNotNull($stored);
        $this->assertEquals('My Solution Tag', $stored->value['tag'] ?? null);
        $this->assertEquals('Nested Heading', $stored->value['heading'] ?? null);
    }

    public function test_content_section_creation_falls_back_on_null_title(): void
    {
        $page = ContentPage::create([
            'title' => 'Sample Page',
            'slug' => 'sample-page',
            'status' => 'published',
        ]);

        $payload = [
            'section_key' => 'custom-sec',
            'section_type' => 'hero',
            'name' => 'Custom Name',
            'title' => null,
        ];

        $user = \App\Models\User::create([
            'name' => 'Admin User',
            'email' => 'admin2@example.com',
            'password' => bcrypt('password'),
            'is_admin' => true,
        ]);

        $response = $this->actingAs($user, 'sanctum')->postJson("/api/v1/content-pages/{$page->slug}/sections", $payload);

        $response->assertStatus(201);
        $response->assertJsonPath('data.section.title', 'Custom Name');
    }
}
