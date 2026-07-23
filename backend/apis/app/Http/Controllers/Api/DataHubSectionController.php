<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDataHubSectionRequest;
use App\Http\Requests\UpdateDataHubSectionRequest;
use App\Models\DataHubPage;
use App\Models\DataHubSection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DataHubSectionController extends Controller
{
    public function index(DataHubPage $datahubPage)
    {
        $datahubPage->loadMissing('sectionItems.items');

        return $this->success([
            'page_id' => $datahubPage->id,
            'page_slug' => $datahubPage->slug,
            'sync_token' => $datahubPage->sectionItems->max('updated_at')?->toISOString(),
            'sections' => $datahubPage->sectionItems,
        ], 'DataHub sections fetched.');
    }

    public function store(StoreDataHubSectionRequest $request, DataHubPage $datahubPage)
    {
        $validated = $request->validated();

        $section = DB::transaction(function () use ($validated, $datahubPage, $request) {
            $nextOrder = ($datahubPage->sectionItems()->max('sort_order') ?? 0) + 1;
            return DataHubSection::query()->create([
                'datahub_page_id' => $datahubPage->id,
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
        ], 'DataHub section created.', 201);
    }

    public function show(DataHubPage $datahubPage, DataHubSection $section)
    {
        if ($section->datahub_page_id !== $datahubPage->id) {
            return $this->error('Section does not belong to this page.', [], 404);
        }

        return $this->success($section, 'DataHub section fetched.');
    }

    public function update(UpdateDataHubSectionRequest $request, DataHubPage $datahubPage, DataHubSection $section)
    {
        if ($section->datahub_page_id !== $datahubPage->id) {
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
        ], 'DataHub section updated.');
    }

    public function destroy(DataHubPage $datahubPage, DataHubSection $section)
    {
        if ($section->datahub_page_id !== $datahubPage->id) {
            return $this->error('Section does not belong to this page.', [], 404);
        }

        $section->delete();

        return $this->success([
            'section_id' => $section->id,
            'page_id' => $datahubPage->id,
        ], 'DataHub section deleted.');
    }

    public function reorder(DataHubPage $datahubPage)
    {
        $data = request()->validate([
            'sections' => ['required', 'array'],
            'sections.*.id' => ['required', 'integer', 'exists:datahub_sections,id'],
            'sections.*.sort_order' => ['required', 'integer'],
        ]);

        foreach ($data['sections'] as $sectionData) {
            DataHubSection::where('id', $sectionData['id'])
                ->where('datahub_page_id', $datahubPage->id)
                ->update(['sort_order' => $sectionData['sort_order']]);
        }

        return $this->success([
            'page_id' => $datahubPage->id,
        ], 'Sections reordered.');
    }
}
