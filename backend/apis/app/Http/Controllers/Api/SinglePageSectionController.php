<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSinglePageSectionRequest;
use App\Http\Requests\UpdateSinglePageSectionRequest;
use App\Models\SinglePagePage;
use App\Models\SinglePageSection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SinglePageSectionController extends Controller
{
    public function index(SinglePagePage $singlepagePage)
    {
        $singlepagePage->loadMissing('sectionItems.items');

        return $this->success([
            'page_id' => $singlepagePage->id,
            'page_slug' => $singlepagePage->slug,
            'sync_token' => $singlepagePage->sectionItems->max('updated_at')?->toISOString(),
            'sections' => $singlepagePage->sectionItems,
        ], 'SinglePage sections fetched.');
    }

    public function store(StoreSinglePageSectionRequest $request, SinglePagePage $singlepagePage)
    {
        $validated = $request->validated();

        $section = DB::transaction(function () use ($validated, $singlepagePage, $request) {
            $nextOrder = ($singlepagePage->sectionItems()->max('sort_order') ?? 0) + 1;
            return SinglePageSection::query()->create([
                'singlepage_page_id' => $singlepagePage->id,
                'section_key' => $validated['section_key'],
                'section_type' => $validated['section_type'],
                'is_visible' => (bool) ($validated['is_visible'] ?? true),
                'sort_order' => $validated['sort_order'] ?? $nextOrder,
                'data' => $validated['data'] ?? [],
                'updated_by' => $request->user()?->id,
            ]);
        });

        return $this->success([
            'section' => $section->fresh(),
            'sync_token' => $section->updated_at?->toISOString(),
        ], 'SinglePage section created.', 201);
    }

    public function show(SinglePagePage $singlepagePage, SinglePageSection $section)
    {
        if ($section->singlepage_page_id !== $singlepagePage->id) {
            return $this->error('Section does not belong to this page.', [], 404);
        }

        return $this->success($section, 'SinglePage section fetched.');
    }

    public function update(UpdateSinglePageSectionRequest $request, SinglePagePage $singlepagePage, SinglePageSection $section)
    {
        if ($section->singlepage_page_id !== $singlepagePage->id) {
            return $this->error('Section does not belong to this page.', [], 404);
        }

        $validated = $request->validated();
        $syncToken = $validated['sync_token'] ?? null;

        if ($syncToken && $section->updated_at?->toISOString() !== $syncToken) {
            return $this->error('Section changed by another user. Refresh and retry.', [], 409);
        }

        $section->update([
            ...collect($validated)->except('sync_token')->toArray(),
            'section_key' => $validated['section_key'] ?? $section->section_key,
            'section_type' => $validated['section_type'] ?? $section->section_type,
            'data' => $validated['data'] ?? $section->data,
            'is_visible' => (bool) ($validated['is_visible'] ?? $section->is_visible),
            'sort_order' => $validated['sort_order'] ?? $section->sort_order,
            'updated_by' => $request->user()?->id,
        ]);

        return $this->success([
            'section' => $section->fresh(),
            'sync_token' => $section->fresh()->updated_at?->toISOString(),
        ], 'SinglePage section updated.');
    }

    public function destroy(SinglePagePage $singlepagePage, SinglePageSection $section)
    {
        if ($section->singlepage_page_id !== $singlepagePage->id) {
            return $this->error('Section does not belong to this page.', [], 404);
        }

        $section->delete();

        return $this->success([
            'section_id' => $section->id,
            'page_id' => $singlepagePage->id,
        ], 'SinglePage section deleted.');
    }

    public function reorder(SinglePagePage $singlepagePage)
    {
        $data = request()->validate([
            'sections' => ['required', 'array'],
            'sections.*.id' => ['required', 'integer', 'exists:singlepage_sections,id'],
            'sections.*.sort_order' => ['required', 'integer'],
        ]);

        foreach ($data['sections'] as $sectionData) {
            SinglePageSection::where('id', $sectionData['id'])
                ->where('singlepage_page_id', $singlepagePage->id)
                ->update(['sort_order' => $sectionData['sort_order']]);
        }

        return $this->success([
            'page_id' => $singlepagePage->id,
        ], 'Sections reordered.');
    }
}
