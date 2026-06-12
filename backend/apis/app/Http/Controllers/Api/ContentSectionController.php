<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContentSectionRequest;
use App\Http\Requests\UpdateContentSectionRequest;
use App\Models\ContentPage;
use App\Models\ContentSection;
use App\Models\ContentSectionVersion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ContentSectionController extends Controller
{
    public function __construct(private readonly \App\Services\AuditLogService $auditLogService) {}

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

        $section = DB::transaction(function () use ($validated, $request, $contentPage) {
            return ContentSection::query()->create([
                'content_page_id' => $contentPage->id,
                'section_key' => $validated['section_key'],
                'section_type' => $validated['section_type'],
                'name' => $validated['name'] ?? null,
                'title' => $validated['title'],
                'content' => $validated['content'] ?? null,
                'is_visible' => (bool) ($validated['is_visible'] ?? true),
                'sort_order' => $validated['sort_order'] ?? ($contentPage->sectionItems()->max('sort_order') + 1),
                'fields' => $validated['fields'] ?? [],
                'sync_version' => 1,
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
            'sync_version' => $section->sync_version + 1,
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

    public function history(ContentPage $contentPage, Request $request)
    {
        $validated = $request->validate([
            'stage' => ['nullable', 'string', 'in:draft,published'],
        ]);
        $stage = $validated['stage'] ?? 'draft';

        $history = ContentSectionVersion::query()
            ->where('content_page_id', $contentPage->id)
            ->where('stage', $stage)
            ->orderByDesc('id')
            ->limit(50)
            ->with('creator:id,name,email')
            ->get();

        return $this->success([
            'page' => [
                'id' => $contentPage->id,
                'title' => $contentPage->title,
                'slug' => $contentPage->slug,
            ],
            'stage' => $stage,
            'items' => $history,
        ], 'Content section history fetched.');
    }

    public function rollback(Request $request, ContentPage $contentPage)
    {
        $validated = $request->validate([
            'version_id' => ['required', 'integer', 'exists:content_section_versions,id'],
            'publish' => ['nullable', 'boolean'],
        ]);

        $version = ContentSectionVersion::query()
            ->where('content_page_id', $contentPage->id)
            ->findOrFail((int) $validated['version_id']);

        $beforeSnapshot = $this->snapshot($contentPage->id);

        DB::transaction(function () use ($contentPage, $version, $validated, $request) {
            $contentPage->sectionItems()->delete();

            foreach (($version->snapshot['sections'] ?? []) as $sectionData) {
                $section = ContentSection::query()->create([
                    'content_page_id' => $contentPage->id,
                    'section_key' => $sectionData['section_key'],
                    'section_type' => $sectionData['section_type'],
                    'name' => $sectionData['name'] ?? null,
                    'title' => $sectionData['title'],
                    'content' => $sectionData['content'] ?? null,
                    'is_visible' => (bool) ($sectionData['is_visible'] ?? true),
                    'sort_order' => $sectionData['sort_order'] ?? 0,
                    'fields' => $sectionData['fields'] ?? [],
                    'sync_version' => ($sectionData['sync_version'] ?? 0) + 1,
                    'updated_by' => $request->user()?->id,
                ]);

                if (! empty($sectionData['items'])) {
                    foreach ($sectionData['items'] as $itemIndex => $itemData) {
                        $section->items()->create([
                            'item_key' => $itemData['item_key'] ?? null,
                            'title' => $itemData['title'],
                            'content' => $itemData['content'] ?? null,
                            'category' => $itemData['category'] ?? null,
                            'url' => $itemData['url'] ?? null,
                            'description' => $itemData['description'] ?? null,
                            'results' => $itemData['results'] ?? null,
                            'tags' => $itemData['tags'] ?? null,
                            'badge' => $itemData['badge'] ?? null,
                            'avatar' => $itemData['avatar'] ?? null,
                            'client_name' => $itemData['client_name'] ?? null,
                            'client_role' => $itemData['client_role'] ?? null,
                            'company' => $itemData['company'] ?? null,
                            'rating' => $itemData['rating'] ?? null,
                            'sort_order' => $itemIndex,
                            'is_featured' => (bool) ($itemData['is_featured'] ?? false),
                            'is_active' => (bool) ($itemData['is_active'] ?? true),
                        ]);
                    }
                }
            }

            if ((bool) ($validated['publish'] ?? false)) {
                $this->createVersion($contentPage->id, 'published', 'rollback_publish', $request->user()?->id);
            }
        });

        $afterSnapshot = $this->snapshot($contentPage->id);
        $this->auditLogService->log(
            'content_sections.rolled_back',
            'content_page',
            $contentPage->id,
            $request->user(),
            $contentPage->id,
            $beforeSnapshot,
            $afterSnapshot,
            null,
            $request
        );

        return $this->success([
            'page' => [
                'id' => $contentPage->id,
                'title' => $contentPage->title,
                'slug' => $contentPage->slug,
            ],
            'draft' => $afterSnapshot,
            'published' => $this->snapshotPublished($contentPage->id),
        ], 'Content sections rolled back successfully.');
    }

    private function createVersion(int $pageId, string $stage, string $changeType, ?int $userId): void
    {
        $nextVersion = (int) ContentSectionVersion::query()
            ->where('content_page_id', $pageId)
            ->where('stage', $stage)
            ->max('version_number') + 1;

        ContentSectionVersion::query()->create([
            'content_page_id' => $pageId,
            'version_number' => $nextVersion,
            'stage' => $stage,
            'change_type' => $changeType,
            'snapshot' => $this->snapshot($pageId),
            'created_by' => $userId,
        ]);
    }

    private function snapshot(int $pageId): array
    {
        $sections = ContentSection::query()
            ->where('content_page_id', $pageId)
            ->with('items')
            ->orderBy('sort_order')
            ->get();

        return [
            'sections' => $sections->map(fn ($section) => [
                'section_key' => $section->section_key,
                'section_type' => $section->section_type,
                'name' => $section->name,
                'title' => $section->title,
                'content' => $section->content,
                'is_visible' => $section->is_visible,
                'sort_order' => $section->sort_order,
                'fields' => $section->fields,
                'sync_version' => $section->sync_version,
                'items' => $section->items->map(fn ($item) => [
                    'item_key' => $item->item_key,
                    'title' => $item->title,
                    'content' => $item->content,
                    'category' => $item->category,
                    'url' => $item->url,
                    'description' => $item->description,
                    'results' => $item->results,
                    'tags' => $item->tags,
                    'badge' => $item->badge,
                    'avatar' => $item->avatar,
                    'client_name' => $item->client_name,
                    'client_role' => $item->client_role,
                    'company' => $item->company,
                    'rating' => $item->rating,
                    'is_featured' => $item->is_featured,
                    'is_active' => $item->is_active,
                ])->toArray(),
            ])->toArray(),
        ];
    }

    private function snapshotPublished(int $pageId): array
    {
        return $this->snapshot($pageId);
    }
}
