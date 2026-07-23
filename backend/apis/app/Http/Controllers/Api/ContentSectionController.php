<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContentSectionRequest;
use App\Http\Requests\UpdateContentSectionRequest;
use App\Models\ContentPage;
use App\Models\ContentSection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ContentSectionController extends Controller
{
    public function index(ContentPage $contentPage)
    {
        $contentPage->loadMissing('sectionItems.items');

        return $this->success([
            'page_id' => $contentPage->id,
            'page_slug' => $contentPage->slug,
            'sync_token' => $contentPage->sectionItems->max('updated_at')?->toISOString(),
            'sections' => $contentPage->sectionItems,
        ], 'Content sections fetched.');
    }

    public function store(StoreContentSectionRequest $request, ContentPage $contentPage)
    {
        $validated = $request->validated();

        $section = DB::transaction(function () use ($validated, $contentPage, $request) {
            $nextOrder = ($contentPage->sectionItems()->max('sort_order') ?? 0) + 1;
            return ContentSection::query()->create([
                'content_page_id' => $contentPage->id,
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
        ], 'Content section created.', 201);
    }

    public function show(ContentPage $contentPage, ContentSection $section)
    {
        if ($section->content_page_id !== $contentPage->id) {
            return $this->error('Section does not belong to this page.', [], 404);
        }

        return $this->success($section, 'Content section fetched.');
    }

    public function update(UpdateContentSectionRequest $request, ContentPage $contentPage, ContentSection $section)
    {
        if ($section->content_page_id !== $contentPage->id) {
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
        ], 'Content section updated.');
    }

    public function destroy(ContentPage $contentPage, ContentSection $section)
    {
        if ($section->content_page_id !== $contentPage->id) {
            return $this->error('Section does not belong to this page.', [], 404);
        }

        $section->delete();

        return $this->success([
            'section_id' => $section->id,
            'page_id' => $contentPage->id,
        ], 'Content section deleted.');
    }

    public function reorder(ContentPage $contentPage)
    {
        $data = request()->validate([
            'sections' => ['required', 'array'],
            'sections.*.id' => ['required', 'integer', 'exists:content_sections,id'],
            'sections.*.sort_order' => ['required', 'integer'],
        ]);

        foreach ($data['sections'] as $sectionData) {
            ContentSection::where('id', $sectionData['id'])
                ->where('content_page_id', $contentPage->id)
                ->update(['sort_order' => $sectionData['sort_order']]);
        }

        return $this->success([
            'page_id' => $contentPage->id,
        ], 'Sections reordered.');
    }
}
