<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDataHubPageRequest;
use App\Http\Requests\UpdateDataHubPageRequest;
use App\Models\DataHubPage;
use App\Models\DataHubSection;
use App\Models\DataHubItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DataHubPageController extends Controller
{
    public function index(Request $request)
    {
        $pages = DataHubPage::query()
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
            return $this->success($formatted, 'Compiled datahub pages fetched.');
        }

        return $this->success($pages->map(fn (DataHubPage $page) => $this->serializePage($page)), 'DataHub pages fetched.');
    }

    public function store(StoreDataHubPageRequest $request)
    {
        $validated = $request->validated();
        $sections = $validated['sections'] ?? [];

        $page = DB::transaction(function () use ($validated, $sections, $request) {
            $page = DataHubPage::query()->create([
                ...collect($validated)->except('sections')->toArray(),
                'updated_by' => $request->user()?->id
            ]);

            foreach ($sections as $index => $section) {
                DataHubSection::query()->create([
                    'datahub_page_id' => $page->id,
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

        return $this->success($this->serializePage($page->load(['sectionItems.items'])), 'DataHub page created.', 201);
    }

    public function show(DataHubPage $datahubPage)
    {
        return $this->success($this->serializePage($datahubPage->load(['sectionItems.items'])), 'DataHub page fetched.');
    }

    public function update(UpdateDataHubPageRequest $request, DataHubPage $datahubPage)
    {
        $validated = $request->validated();
        $sections = $validated['sections'] ?? null;

        DB::transaction(function () use ($datahubPage, $validated, $sections, $request) {
            $datahubPage->update([
                ...collect($validated)->except('sections')->toArray(),
                'updated_by' => $request->user()?->id
            ]);

            if (is_array($sections)) {
                $datahubPage->sectionItems()->delete();
                foreach ($sections as $index => $section) {
                    DataHubSection::query()->create([
                        'datahub_page_id' => $datahubPage->id,
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

        return $this->success($this->serializePage($datahubPage->fresh()->load(['sectionItems.items'])), 'DataHub page updated.');
    }

    public function destroy(DataHubPage $datahubPage)
    {
        $datahubPage->delete();

        return $this->success(null, 'DataHub page deleted.');
    }

    public function bulk(Request $request)
    {
        $validated = $request->validate([
            'action' => ['required', 'string', 'in:publish,unpublish,delete'],
            'slugs' => ['required', 'array', 'min:1'],
            'slugs.*' => ['required', 'string', 'exists:datahub_pages,slug'],
        ]);

        $affected = 0;

        if ($validated['action'] === 'delete') {
            $affected = DataHubPage::query()->whereIn('slug', $validated['slugs'])->delete();
        } elseif ($validated['action'] === 'publish') {
            $affected = DataHubPage::query()->whereIn('slug', $validated['slugs'])->update(['status' => 'published']);
        } elseif ($validated['action'] === 'unpublish') {
            $affected = DataHubPage::query()->whereIn('slug', $validated['slugs'])->update(['status' => 'draft']);
        }

        return $this->success(['affected' => $affected], "Bulk action '{$validated['action']}' completed.");
    }

    private function serializePage(DataHubPage $page): array
    {
        $sections = $page->sectionItems
            ->map(fn (DataHubSection $section) => $this->serializeSection($section))
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

    private function serializeSection(DataHubSection $section): array
    {
        return [
            'id' => $section->id,
            'datahub_page_id' => $section->datahub_page_id,
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

    private function serializeItem(DataHubItem $item): array
    {
        return [
            'id' => $item->id,
            'datahub_section_id' => $item->datahub_section_id,
            'sort_order' => $item->sort_order,
            'is_featured' => $item->is_featured,
            'is_active' => $item->is_active,
            'data' => $item->data ?? [],
            'updated_at' => $item->updated_at?->toISOString(),
        ];
    }
}