<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreServiceSectionRequest;
use App\Http\Requests\UpdateServiceSectionRequest;
use App\Models\ServicePage;
use App\Models\ServiceSection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ServiceSectionController extends Controller
{
    public function index(ServicePage $servicePage)
    {
        $servicePage->loadMissing('sectionItems.items');

        return $this->success([
            'page_id' => $servicePage->id,
            'page_slug' => $servicePage->slug,
            'sync_token' => $servicePage->sectionItems->max('updated_at')?->toISOString(),
            'sections' => $servicePage->sectionItems,
        ], 'Service sections fetched.');
    }

    public function store(StoreServiceSectionRequest $request, ServicePage $servicePage)
    {
        $validated = $request->validated();

        $section = DB::transaction(function () use ($validated, $servicePage, $request) {
            $nextOrder = ($servicePage->sectionItems()->max('sort_order') ?? 0) + 1;
            return ServiceSection::query()->create([
                'service_page_id' => $servicePage->id,
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
        ], 'Service section created.', 201);
    }

    public function show(ServicePage $servicePage, ServiceSection $section)
    {
        if ($section->service_page_id !== $servicePage->id) {
            return $this->error('Section does not belong to this page.', [], 404);
        }

        return $this->success($section, 'Service section fetched.');
    }

    public function update(UpdateServiceSectionRequest $request, ServicePage $servicePage, ServiceSection $section)
    {
        if ($section->service_page_id !== $servicePage->id) {
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
        ], 'Service section updated.');
    }

    public function destroy(ServicePage $servicePage, ServiceSection $section)
    {
        if ($section->service_page_id !== $servicePage->id) {
            return $this->error('Section does not belong to this page.', [], 404);
        }

        $section->delete();

        return $this->success([
            'section_id' => $section->id,
            'page_id' => $servicePage->id,
        ], 'Service section deleted.');
    }

    public function reorder(ServicePage $servicePage)
    {
        $data = request()->validate([
            'sections' => ['required', 'array'],
            'sections.*.id' => ['required', 'integer', 'exists:service_sections,id'],
            'sections.*.sort_order' => ['required', 'integer'],
        ]);

        foreach ($data['sections'] as $sectionData) {
            ServiceSection::where('id', $sectionData['id'])
                ->where('service_page_id', $servicePage->id)
                ->update(['sort_order' => $sectionData['sort_order']]);
        }

        return $this->success([
            'page_id' => $servicePage->id,
        ], 'Sections reordered.');
    }
}
