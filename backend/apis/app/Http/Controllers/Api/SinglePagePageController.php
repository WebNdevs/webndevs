<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSinglePagePageRequest;
use App\Http\Requests\UpdateSinglePagePageRequest;
use App\Models\SinglePagePage;
use App\Models\SinglePageSection;
use App\Models\SinglePageItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SinglePagePageController extends Controller
{
    public function index(Request $request)
    {
        $pages = SinglePagePage::query()
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
            return $this->success($formatted, 'Compiled singlepage pages fetched.');
        }

        return $this->success($pages->map(fn (SinglePagePage $page) => $this->serializePage($page)), 'SinglePage pages fetched.');
    }

    public function store(StoreSinglePagePageRequest $request)
    {
        $validated = $request->validated();
        $sections = $validated['sections'] ?? [];

        $page = DB::transaction(function () use ($validated, $sections, $request) {
            $page = SinglePagePage::query()->create([
                ...collect($validated)->except('sections')->toArray(),
                'updated_by' => $request->user()?->id
            ]);

            foreach ($sections as $index => $section) {
                SinglePageSection::query()->create([
                    'singlepage_page_id' => $page->id,
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

        return $this->success($this->serializePage($page->load(['sectionItems.items'])), 'SinglePage page created.', 201);
    }

    public function show(SinglePagePage $singlepagePage)
    {
        return $this->success($this->serializePage($singlepagePage->load(['sectionItems.items'])), 'SinglePage page fetched.');
    }

    public function update(UpdateSinglePagePageRequest $request, SinglePagePage $singlepagePage)
    {
        $validated = $request->validated();
        $sections = $validated['sections'] ?? null;

        DB::transaction(function () use ($singlepagePage, $validated, $sections, $request) {
            $singlepagePage->update([
                ...collect($validated)->except('sections')->toArray(),
                'updated_by' => $request->user()?->id
            ]);

            if (is_array($sections)) {
                $singlepagePage->sectionItems()->delete();
                foreach ($sections as $index => $section) {
                    SinglePageSection::query()->create([
                        'singlepage_page_id' => $singlepagePage->id,
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

        return $this->success($this->serializePage($singlepagePage->fresh()->load(['sectionItems.items'])), 'SinglePage page updated.');
    }

    public function destroy(SinglePagePage $singlepagePage)
    {
        $singlepagePage->delete();

        return $this->success(null, 'SinglePage page deleted.');
    }

    public function bulk(Request $request)
    {
        $validated = $request->validate([
            'action' => ['required', 'string', 'in:publish,unpublish,delete'],
            'slugs' => ['required', 'array', 'min:1'],
            'slugs.*' => ['required', 'string', 'exists:singlepage_pages,slug'],
        ]);

        $affected = 0;

        if ($validated['action'] === 'delete') {
            $affected = SinglePagePage::query()->whereIn('slug', $validated['slugs'])->delete();
        } elseif ($validated['action'] === 'publish') {
            $affected = SinglePagePage::query()->whereIn('slug', $validated['slugs'])->update(['status' => 'published']);
        } elseif ($validated['action'] === 'unpublish') {
            $affected = SinglePagePage::query()->whereIn('slug', $validated['slugs'])->update(['status' => 'draft']);
        }

        return $this->success(['affected' => $affected], "Bulk action '{$validated['action']}' completed.");
    }

    private function serializePage(SinglePagePage $page): array
    {
        $sections = $page->sectionItems
            ->map(fn (SinglePageSection $section) => $this->serializeSection($section))
            ->values()
            ->toArray();

        return [
            'id' => $page->id,
            'title' => $page->title,
            'slug' => $page->slug,
            'category_slug' => $page->category_slug,
            'status' => $page->status,
            'seo_title' => $page->seo_title,
            'seo_description' => $page->seo_description,
            'meta_keywords' => $page->meta_keywords,
            'sections' => $sections,
            'sync_token' => $page->sectionItems->max('updated_at')?->toISOString() ?? $page->updated_at?->toISOString(),
            'updated_at' => $page->updated_at,
        ];
    }

    private function serializeSection(SinglePageSection $section): array
    {
        return [
            'id' => $section->id,
            'singlepage_page_id' => $section->singlepage_page_id,
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

    private function serializeItem(SinglePageItem $item): array
    {
        return [
            'id' => $item->id,
            'singlepage_section_id' => $item->singlepage_section_id,
            'sort_order' => $item->sort_order,
            'is_featured' => $item->is_featured,
            'is_active' => $item->is_active,
            'data' => $item->data ?? [],
            'updated_at' => $item->updated_at?->toISOString(),
        ];
    }
}