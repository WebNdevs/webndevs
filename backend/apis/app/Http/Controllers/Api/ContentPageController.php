<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContentPageRequest;
use App\Http\Requests\UpdateContentPageRequest;
use App\Models\ContentPage;
use App\Models\ContentSection;
use App\Models\ContentItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ContentPageController extends Controller
{
    public function index()
    {
        $pages = ContentPage::query()
            ->with(['service:id,name,slug', 'sectionItems.items'])
            ->orderBy('title')
            ->get();

        return $this->success($pages->map(fn (ContentPage $page) => $this->serializePage($page)), 'Content pages fetched.');
    }

    public function store(StoreContentPageRequest $request)
    {
        $validated = $request->validated();
        $sections = $validated['sections'] ?? [];

        $page = DB::transaction(function () use ($request, $validated, $sections) {
            $page = ContentPage::query()->create([
                ...collect($validated)->except('sections')->toArray(),
                'updated_by' => $request->user()?->id,
            ]);

            foreach ($sections as $index => $section) {
                ContentSection::query()->create([
                    'content_page_id' => $page->id,
                    'section_key' => $section['section_key'],
                    'section_type' => $section['section_type'],
                    'name' => $section['name'] ?? null,
                    'title' => $section['title'],
                    'content' => $section['content'] ?? null,
                    'is_visible' => (bool) ($section['is_visible'] ?? true),
                    'sort_order' => $section['sort_order'] ?? $index,
                    'fields' => $section['fields'] ?? [],
                    'sync_version' => 1,
                    'updated_by' => $request->user()?->id,
                ]);
            }

            return $page;
        });

        return $this->success($this->serializePage($page->load(['service:id,name,slug', 'sectionItems.items'])), 'Content page created.', 201);
    }

    public function show(ContentPage $contentPage)
    {
        return $this->success($this->serializePage($contentPage->load(['service:id,name,slug', 'sectionItems.items'])), 'Content page fetched.');
    }

    public function update(UpdateContentPageRequest $request, ContentPage $contentPage)
    {
        $validated = $request->validated();
        $sections = $validated['sections'] ?? null;

        DB::transaction(function () use ($request, $contentPage, $validated, $sections) {
            $contentPage->update([
                ...collect($validated)->except('sections')->toArray(),
                'updated_by' => $request->user()?->id,
            ]);

            if (is_array($sections)) {
                $contentPage->sectionItems()->delete();
                foreach ($sections as $index => $section) {
                    ContentSection::query()->create([
                        'content_page_id' => $contentPage->id,
                        'section_key' => $section['section_key'],
                        'section_type' => $section['section_type'],
                        'name' => $section['name'] ?? null,
                        'title' => $section['title'],
                        'content' => $section['content'] ?? null,
                        'is_visible' => (bool) ($section['is_visible'] ?? true),
                        'sort_order' => $section['sort_order'] ?? $index,
                        'fields' => $section['fields'] ?? [],
                        'sync_version' => 1,
                        'updated_by' => $request->user()?->id,
                    ]);
                }
            }
        });

        return $this->success($this->serializePage($contentPage->fresh()->load(['service:id,name,slug', 'sectionItems.items'])), 'Content page updated.');
    }

    public function destroy(ContentPage $contentPage)
    {
        $contentPage->delete();

        return $this->success(null, 'Content page deleted.');
    }

    public function bulk(Request $request)
    {
        $validated = $request->validate([
            'action' => ['required', 'string', 'in:publish,unpublish,delete'],
            'slugs' => ['required', 'array', 'min:1'],
            'slugs.*' => ['required', 'string', 'exists:content_pages,slug'],
        ]);

        $affected = 0;

        if ($validated['action'] === 'delete') {
            $affected = ContentPage::query()->whereIn('slug', $validated['slugs'])->delete();
        } elseif ($validated['action'] === 'publish') {
            $affected = ContentPage::query()->whereIn('slug', $validated['slugs'])->update(['status' => 'published']);
        } elseif ($validated['action'] === 'unpublish') {
            $affected = ContentPage::query()->whereIn('slug', $validated['slugs'])->update(['status' => 'draft']);
        }

        return $this->success(['affected' => $affected], "Bulk action '{$validated['action']}' completed.");
    }

    private function serializePage(ContentPage $page): array
    {
        $sections = $page->sectionItems
            ->map(fn (ContentSection $section) => $this->serializeSection($section))
            ->values()
            ->toArray();

        return [
            'id' => $page->id,
            'title' => $page->title,
            'slug' => $page->slug,
            'status' => $page->status,
            'seo_title' => $page->seo_title,
            'seo_description' => $page->seo_description,
            'meta_keywords' => $page->meta_keywords,
            'service_id' => $page->service_id,
            'service' => $page->service,
            'sections' => $sections,
            'sync_token' => $page->sectionItems->max('updated_at')?->toISOString() ?? $page->updated_at?->toISOString(),
            'updated_at' => $page->updated_at,
        ];
    }

    private function serializeSection(ContentSection $section): array
    {
        // Base section data
        $data = [
            'id' => $section->id,
            'content_page_id' => $section->content_page_id,
            'section_key' => $section->section_key,
            'section_type' => $section->section_type,
            'name' => $section->name,
            'title' => $section->title,
            'content' => $section->content,
            'is_visible' => $section->is_visible,
            'sort_order' => $section->sort_order,
            'sync_version' => $section->sync_version,
            'updated_by' => $section->updated_by,
            'created_at' => $section->created_at?->toISOString(),
            'updated_at' => $section->updated_at?->toISOString(),
            'items' => $section->items->map(fn ($item) => $this->serializeItem($item))->toArray(),
        ];

        // Add type-specific fields based on section_type
        $fields = $section->fields ?? [];

        if ($section->section_type === 'heading-text') {
            $data = array_merge($data, [
                'description' => $fields['description'] ?? $section->description,
                'tag' => $fields['tag'] ?? $section->tag,
                'subheading1' => $fields['subheading1'] ?? $section->subheading1,
                'subheading2' => $fields['subheading2'] ?? $section->subheading2,
                'subtext' => $fields['subtext'] ?? $section->subtext,
            ]);
        } elseif ($section->section_type === 'approach-table') {
            $data = array_merge($data, [
                'left_heading' => $fields['left_heading'] ?? $section->left_heading,
                'right_heading' => $fields['right_heading'] ?? $section->right_heading,
                'left_points' => $fields['left_points'] ?? [],
                'right_points' => $fields['right_points'] ?? [],
            ]);
        }

        return $data;
    }

    private function serializeItem(ContentItem $item): array
    {
        // Common fields for all item types
        $data = [
            'id' => $item->id,
            'content_section_id' => $item->content_section_id,
            'item_key' => $item->item_key,
            'sort_order' => $item->sort_order,
            'is_featured' => $item->is_featured,
            'is_active' => $item->is_active,
            'custom_fields' => $item->custom_fields,
            'external_id' => $item->external_id,
            'updated_by' => $item->updated_by,
            'created_at' => $item->created_at?->toISOString(),
            'updated_at' => $item->updated_at?->toISOString(),
            'deleted_at' => $item->deleted_at?->toISOString(),
        ];

        // Determine item type and add type-specific fields with title/content mapping
        // Q&A: title=question, content=answer
        if (!empty($item->question)) {
            $data['title'] = $item->question;
            $data['content'] = $item->answer ?? '';
            $data['question'] = $item->question;
            $data['answer'] = $item->answer ?? '';
        }
        // Project (Pro): title=pro_name, content=pro_category
        elseif (!empty($item->pro_name)) {
            $data['title'] = $item->pro_name;
            $data['content'] = $item->pro_category ?? '';
            $data['pro_name'] = $item->pro_name;
            $data['pro_category'] = $item->pro_category;
            $data['pro_url'] = $item->pro_url;
            $data['pro_description'] = $item->pro_description;
            $data['pro_results'] = $item->pro_results;
            $data['pro_tag'] = $item->pro_tag;
            $data['pro_badge'] = $item->pro_badge;
        }
        // Service Card (Ser): title=ser_name, content=ser_url
        elseif (!empty($item->ser_name)) {
            $data['title'] = $item->ser_name;
            $data['content'] = $item->ser_url ?? '';
            $data['ser_name'] = $item->ser_name;
            $data['ser_url'] = $item->ser_url;
            $data['ser_description'] = $item->ser_description;
            $data['ser_icon'] = $item->ser_icon;
            $data['ser_tag'] = $item->ser_tag;
        }
        // Testimonial (Test): title=test_name, content=test_company
        elseif (!empty($item->test_name)) {
            $data['title'] = $item->test_name;
            $data['content'] = $item->test_company ?? '';
            $data['test_name'] = $item->test_name;
            $data['test_company'] = $item->test_company;
            $data['test_role'] = $item->test_role;
            $data['test_description'] = $item->test_description;
            $data['test_url'] = $item->test_url;
            $data['test_rate'] = $item->test_rate;
        }
        // Data Tile: title=tile_name, content=tile_description
        elseif (!empty($item->tile_name)) {
            $data['title'] = $item->tile_name;
            $data['content'] = $item->tile_description ?? '';
            $data['tile_name'] = $item->tile_name;
            $data['tile_url'] = $item->tile_url;
            $data['tile_description'] = $item->tile_description;
        }
        // Choose Card (cc): title=cc_name, content=cc_description
        elseif (!empty($item->cc_name)) {
            $data['title'] = $item->cc_name;
            $data['content'] = $item->cc_description ?? '';
            $data['cc_name'] = $item->cc_name;
            $data['cc_description'] = $item->cc_description;
            $data['cc_icon'] = $item->cc_icon;
        }
        // Process Card (pc): title=pc_name, content=pc_description
        elseif (!empty($item->pc_name)) {
            $data['title'] = $item->pc_name;
            $data['content'] = $item->pc_description ?? '';
            $data['pc_name'] = $item->pc_name;
            $data['pc_number'] = $item->pc_number;
            $data['pc_description'] = $item->pc_description;
            $data['pc_icon'] = $item->pc_icon;
            $data['pc_timeline'] = $item->pc_timeline;
        }

        return $data;
    }
}