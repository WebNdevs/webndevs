<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreArticleSectionRequest;
use App\Http\Requests\UpdateArticleSectionRequest;
use App\Models\ArticlePage;
use App\Models\ArticleSection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ArticleSectionController extends Controller
{
    public function index(ArticlePage $articlePage)
    {
        $articlePage->loadMissing('sectionItems.items');

        return $this->success([
            'page_id' => $articlePage->id,
            'page_slug' => $articlePage->slug,
            'sync_token' => $articlePage->sectionItems->max('updated_at')?->toISOString(),
            'sections' => $articlePage->sectionItems,
        ], 'Article sections fetched.');
    }

    public function store(StoreArticleSectionRequest $request, ArticlePage $articlePage)
    {
        $validated = $request->validated();

        $section = DB::transaction(function () use ($validated, $articlePage, $request) {
            $nextOrder = ($articlePage->sectionItems()->max('sort_order') ?? 0) + 1;
            return ArticleSection::query()->create([
                'article_page_id' => $articlePage->id,
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
        ], 'Article section created.', 201);
    }

    public function show(ArticlePage $articlePage, ArticleSection $section)
    {
        if ($section->article_page_id !== $articlePage->id) {
            return $this->error('Section does not belong to this page.', [], 404);
        }

        return $this->success($section, 'Article section fetched.');
    }

    public function update(UpdateArticleSectionRequest $request, ArticlePage $articlePage, ArticleSection $section)
    {
        if ($section->article_page_id !== $articlePage->id) {
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
        ], 'Article section updated.');
    }

    public function destroy(ArticlePage $articlePage, ArticleSection $section)
    {
        if ($section->article_page_id !== $articlePage->id) {
            return $this->error('Section does not belong to this page.', [], 404);
        }

        $section->delete();

        return $this->success([
            'section_id' => $section->id,
            'page_id' => $articlePage->id,
        ], 'Article section deleted.');
    }

    public function reorder(ArticlePage $articlePage)
    {
        $data = request()->validate([
            'sections' => ['required', 'array'],
            'sections.*.id' => ['required', 'integer', 'exists:article_sections,id'],
            'sections.*.sort_order' => ['required', 'integer'],
        ]);

        foreach ($data['sections'] as $sectionData) {
            ArticleSection::where('id', $sectionData['id'])
                ->where('article_page_id', $articlePage->id)
                ->update(['sort_order' => $sectionData['sort_order']]);
        }

        return $this->success([
            'page_id' => $articlePage->id,
        ], 'Sections reordered.');
    }
}
