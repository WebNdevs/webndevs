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
    public function index(Request $request)
    {
        $pages = ContentPage::query()
            ->with(['sectionItems.items'])
            ->orderBy('title')
            ->get();

        if ($request->query('format') === 'compiled') {
            $formatted = [];
            foreach ($pages as $page) {
                $slug = $page->slug ?? '';
                $pathKey = $slug;
                if ($pathKey === 'home' || $pathKey === 'homepage') {
                    $pathKey = '/';
                }
                if ($pathKey !== '/' && !str_starts_with($pathKey, '/')) {
                    $pathKey = '/' . $pathKey;
                }

                $sections = [];
                foreach ($page->sectionItems as $section) {
                    if (!$section->is_visible) {
                        continue;
                    }
                    $serialized = $this->serializeSection($section);
                    $secKey = $section->section_key;
                    $sections[$secKey] = $serialized;
                }

                $formatted[$pathKey] = $sections;
            }
            return $this->success($formatted, 'Compiled content pages fetched.');
        }

        return $this->success($pages->map(fn (ContentPage $page) => $this->serializePage($page)), 'Content pages fetched.');
    }

    public function store(StoreContentPageRequest $request)
    {
        $validated = $request->validated();
        $sections = $validated['sections'] ?? [];

        $page = DB::transaction(function () use ($validated, $sections, $request) {
            $page = ContentPage::query()->create([
                ...collect($validated)->except('sections')->toArray(),
                'updated_by' => $request->user()?->id
            ]);

            foreach ($sections as $index => $section) {
                ContentSection::query()->create([
                    'content_page_id' => $page->id,
                    'section_key' => $section['section_key'],
                    'section_type' => $section['section_type'],
                    'is_visible' => (bool) ($section['is_visible'] ?? true),
                    'sort_order' => $section['sort_order'] ?? $index,
                    'data' => $section['data'] ?? [],
                    'updated_by' => $request->user()?->id,
                ]);
            }

            return $page;
        });

        return $this->success($this->serializePage($page->load(['sectionItems.items'])), 'Content page created.', 201);
    }

    public function show(ContentPage $contentPage)
    {
        return $this->success($this->serializePage($contentPage->load(['sectionItems.items'])), 'Content page fetched.');
    }

    public function update(UpdateContentPageRequest $request, ContentPage $contentPage)
    {
        $validated = $request->validated();
        $sections = $validated['sections'] ?? null;

        DB::transaction(function () use ($contentPage, $validated, $sections, $request) {
            $contentPage->update([
                ...collect($validated)->except('sections')->toArray(),
                'updated_by' => $request->user()?->id
            ]);

            if (is_array($sections)) {
                $contentPage->sectionItems()->delete();
                foreach ($sections as $index => $section) {
                    ContentSection::query()->create([
                        'content_page_id' => $contentPage->id,
                        'section_key' => $section['section_key'],
                        'section_type' => $section['section_type'],
                        'is_visible' => (bool) ($section['is_visible'] ?? true),
                        'sort_order' => $section['sort_order'] ?? $index,
                        'data' => $section['data'] ?? [],
                        'updated_by' => $request->user()?->id,
                    ]);
                }
            }
        });

        return $this->success($this->serializePage($contentPage->fresh()->load(['sectionItems.items'])), 'Content page updated.');
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
            'sections' => $sections,
            'sync_token' => $page->sectionItems->max('updated_at')?->toISOString() ?? $page->updated_at?->toISOString(),
            'updated_at' => $page->updated_at,
        ];
    }

    private function serializeSection(ContentSection $section): array
    {
        return [
            'id' => $section->id,
            'content_page_id' => $section->content_page_id,
            'section_key' => $section->section_key,
            'section_type' => $section->section_type,
            'is_visible' => $section->is_visible,
            'sort_order' => $section->sort_order,
            'created_at' => $section->created_at?->toISOString(),
            'updated_at' => $section->updated_at?->toISOString(),
            'data' => $section->data ?? [],
            'items' => $section->items->map(fn ($item) => $this->serializeItem($item))->values()->toArray(),
        ];
    }

    private function serializeItem(ContentItem $item): array
    {
        return [
            'id' => $item->id,
            'content_section_id' => $item->content_section_id,
            'sort_order' => $item->sort_order,
            'is_featured' => $item->is_featured,
            'is_active' => $item->is_active,
            'data' => $item->data ?? [],
            'updated_at' => $item->updated_at?->toISOString(),
        ];
    }
}