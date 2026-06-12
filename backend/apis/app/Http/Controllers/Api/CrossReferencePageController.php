<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCrossReferenceRequest;
use App\Http\Requests\UpdateCrossReferencePageRequest;
use App\Http\Resources\CrossReferencePageResource;
use App\Models\CrossReferencePage;
use App\Models\CrossRefSection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CrossReferencePageController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = CrossReferencePage::query()->with(['sections', 'entityA', 'entityB', 'entityC']);

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        if (! $request->boolean('include_archived')) {
            $query->where('status', '!=', 'archived');
        }

        $perPage = min(max($request->integer('per_page', 15), 1), 100);

        return $this->success(
            CrossReferencePageResource::collection($query->orderByDesc('id')->paginate($perPage)),
            'Cross-reference pages fetched.'
        );
    }

    public function show(CrossReferencePage $crossReferencePage): JsonResponse
    {
        $crossReferencePage->load(['sections', 'entityA', 'entityB', 'entityC']);

        return $this->success(
            new CrossReferencePageResource($crossReferencePage),
            'Cross-reference page fetched.'
        );
    }

    public function store(StoreCrossReferenceRequest $request): JsonResponse
    {
        $payload  = $request->validated();
        $sections = $payload['sections'] ?? [];
        unset($payload['sections']);

        $slugBase       = $payload['slug'] ?? Str::slug(
            ($payload['entity_a_type'] ?? 'entity') . '-' .
            ($payload['entity_a_id']   ?? 0)        . '-vs-' .
            ($payload['entity_b_type'] ?? 'entity') . '-' .
            ($payload['entity_b_id']   ?? 0)
        );
        $payload['slug']     = $this->uniqueSlug($slugBase);
        $payload['url_path'] = $payload['url_path'] ?? '/compare/' . $payload['slug'];

        $page = DB::transaction(function () use ($payload, $sections) {
            $page = CrossReferencePage::create($payload);

            foreach ($sections as $index => $section) {
                CrossRefSection::create([
                    'cross_reference_page_id' => $page->id,
                    'section_key'  => $section['section_key'],
                    'title'        => $section['title']      ?? null,
                    'content'      => $section['content']    ?? null,
                    'data'         => $section['data']       ?? null,
                    'sort_order'   => $section['sort_order'] ?? $index,
                    'is_visible'   => $section['is_visible'] ?? true,
                    'ai_generated' => false,
                ]);
            }

            return $page;
        });

        return $this->success(
            new CrossReferencePageResource($page->load('sections')),
            'Cross-reference page created.',
            201
        );
    }

    public function update(UpdateCrossReferencePageRequest $request, CrossReferencePage $crossReferencePage): JsonResponse
    {
        $payload = $request->validated();

        $sections = $payload['sections'] ?? [];
        unset($payload['sections']);

        DB::transaction(function () use ($crossReferencePage, $payload, $sections) {
            $crossReferencePage->update($payload);

            if (! empty($sections)) {
                $crossReferencePage->sections()->delete();

                foreach ($sections as $index => $section) {
                    CrossRefSection::create([
                        'cross_reference_page_id' => $crossReferencePage->id,
                        'section_key' => $section['section_key'],
                        'title' => $section['title'] ?? null,
                        'content' => $section['content'] ?? null,
                        'data' => $section['data'] ?? null,
                        'sort_order' => $section['sort_order'] ?? $index,
                        'is_visible' => $section['is_visible'] ?? true,
                        'ai_generated' => false,
                    ]);
                }
            }
        });

        return $this->success(
            new CrossReferencePageResource($crossReferencePage->fresh()->load('sections')),
            'Cross-reference page updated.'
        );
    }

    public function destroy(CrossReferencePage $crossReferencePage): JsonResponse
    {
        $crossReferencePage->delete();

        return $this->success(null, 'Cross-reference page deleted.');
    }

    public function publish(CrossReferencePage $crossReferencePage): JsonResponse
    {
        $crossReferencePage->update(['status' => 'published', 'published_at' => now()]);

        return $this->success(
            new CrossReferencePageResource($crossReferencePage->fresh()),
            'Cross-reference page published.'
        );
    }

    public function draft(CrossReferencePage $crossReferencePage): JsonResponse
    {
        $crossReferencePage->update(['status' => 'draft']);

        return $this->success(
            new CrossReferencePageResource($crossReferencePage->fresh()),
            'Cross-reference page reverted to draft.'
        );
    }

    public function findByEntities(string $entityA, string $entityB): JsonResponse
    {
        $page = CrossReferencePage::query()
            ->where('status', 'published')
            ->whereHasMorph(
                'entityA',
                ['App\Models\Tool', 'App\Models\Industry'],
                fn ($q) => $q->where('slug', $entityA)
            )
            ->whereHasMorph(
                'entityB',
                ['App\Models\Tool', 'App\Models\Industry'],
                fn ($q) => $q->where('slug', $entityB)
            )
            ->with('sections', 'entityA', 'entityB')
            ->first();

        if (! $page) {
            abort(404, 'Cross-reference page not found.');
        }

        return $this->success(
            new CrossReferencePageResource($page),
            'Cross-reference page fetched.'
        );
    }

    private function uniqueSlug(string $base): string
    {
        $slug      = Str::slug($base);
        $candidate = $slug;
        $i         = 1;

        while (CrossReferencePage::withTrashed()->where('slug', $candidate)->exists()) {
            $candidate = $slug . '-' . $i;
            $i++;
        }

        return $candidate;
    }
}
