<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreComparisonRequest;
use App\Models\ComparisonEntity;
use App\Models\ComparisonFeature;
use App\Models\ComparisonPage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class ComparisonPageController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = ComparisonPage::query()
            ->with(['entities', 'features'])
            ->where('status', 'published');

        return response()->json(
            $query->orderByDesc('id')
                ->paginate($request->integer('per_page', 15))
        );
    }

    public function show(string $slug): JsonResponse
    {
        $comparisonPage = ComparisonPage::query()
            ->where('slug', $slug)
            ->where('status', 'published')
            ->with(['entities', 'features'])
            ->firstOrFail();

        return response()->json([
            'id' => $comparisonPage->id,
            'title' => $comparisonPage->title,
            'slug' => $comparisonPage->slug,
            'summary' => $comparisonPage->quick_verdict,
            'subtitle' => $comparisonPage->subtitle,
            'quick_verdict' => $comparisonPage->quick_verdict,
            'recommendation' => $comparisonPage->recommendation,
            'intro_content' => $comparisonPage->intro_content,

            'entities' => $comparisonPage->entities
                ->sortBy('position')
                ->values()
                ->map(fn ($entity) => [
                    'name' => $entity->tag,
                    'type' => $entity->entity_type,
                    'description' => null,
                ]),

            'features' => $comparisonPage->features
                ->sortBy('sort_order')
                ->values()
                ->map(fn ($feature) => [
                    'name' => $feature->feature_name,
                    'values' => $feature->values,
                    'category' => $feature->category,
                    'is_highlighted' => $feature->is_highlighted,
                ]),

            'faqs' => [],
        ]);
    }

    public function store(StoreComparisonRequest $request): JsonResponse
    {
        $data = $request->validated();
        $entities = $data['entities'] ?? [];
        $features = $data['features'] ?? [];
        unset($data['entities'], $data['features']);

        $comparison = DB::transaction(function () use ($data, $entities, $features) {
            $page = ComparisonPage::create($data);
            foreach ($entities as $i => $entity) {
                ComparisonEntity::create([
                    'comparison_page_id' => $page->id,
                    'entity_type' => $entity['entity_type'],
                    'entity_id' => $entity['entity_id'],
                    'position' => $entity['position'] ?? $i,
                    'tag' => $entity['tag'] ?? null,
                ]);
            }
            foreach ($features as $i => $feature) {
                ComparisonFeature::create([
                    'comparison_page_id' => $page->id,
                    'feature_name' => $feature['feature_name'],
                    'category' => $feature['category'] ?? null,
                    'values' => $feature['values'],
                    'is_highlighted' => $feature['is_highlighted'] ?? false,
                    'sort_order' => $feature['sort_order'] ?? $i,
                ]);
            }

            return $page;
        });

        return response()->json($comparison->load(['entities', 'features']), 201);
    }

    public function update(Request $request, ComparisonPage $comparisonPage): JsonResponse
    {
        $data = $request->validate([
            'slug' => ['sometimes', 'string', 'max:300', Rule::unique('comparison_pages', 'slug')->ignore($comparisonPage->id)],
            'title' => ['sometimes', 'string', 'max:500'],
            'subtitle' => ['nullable', 'string', 'max:1000'],
            'quick_verdict' => ['nullable', 'string'],
            'recommendation' => ['nullable', 'string'],
            'intro_content' => ['nullable', 'string'],
            'status' => ['nullable', 'in:draft,published'],
        ]);

        $comparisonPage->update($data);

        $payload = $request->all();

        DB::transaction(function () use ($comparisonPage, $data, $payload) {
            $comparisonPage->update($data);

            if (isset($payload['entities'])) {
                $comparisonPage->entities()->delete();

                foreach ($payload['entities'] as $i => $entity) {
                    ComparisonEntity::create([
                        'comparison_page_id' => $comparisonPage->id,
                        'entity_type' => $entity['entity_type'],
                        'entity_id' => $entity['entity_id'] ?? ($i + 1),
                        'position' => $entity['position'] ?? $i,
                        'tag' => $entity['tag'] ?? null,
                    ]);
                }
            }

            if (isset($payload['features'])) {
                $comparisonPage->features()->delete();

                foreach ($payload['features'] as $i => $feature) {
                    ComparisonFeature::create([
                        'comparison_page_id' => $comparisonPage->id,
                        'feature_name' => $feature['feature_name'],
                        'category' => $feature['category'] ?? null,
                        'values' => $feature['values'],
                        'is_highlighted' => $feature['is_highlighted'] ?? false,
                        'sort_order' => $feature['sort_order'] ?? $i,
                    ]);
                }
            }
        });

        return response()->json($comparisonPage->fresh()->load(['entities', 'features']));
    }

    public function destroy(ComparisonPage $comparisonPage): JsonResponse
    {
        $comparisonPage->delete();

        return response()->json(['message' => 'Deleted']);
    }

    public function syncEntities(Request $request, ComparisonPage $comparisonPage): JsonResponse
    {
        $data = $request->validate([
            'entities' => ['required', 'array', 'min:2', 'max:4'],
            'entities.*.entity_type' => ['required', 'string', 'max:100'],
            'entities.*.entity_id' => ['required', 'integer', 'min:10'],
            'entities.*.position' => ['nullable', 'integer', 'min:0'],
            'entities.*.tag' => ['nullable', 'string', 'max:100'],
        ]);

        DB::transaction(function () use ($comparisonPage, $data) {
            $comparisonPage->entities()->delete();
            foreach ($data['entities'] as $i => $entity) {
                ComparisonEntity::create([
                    'comparison_page_id' => $comparisonPage->id,
                    'entity_type' => $entity['entity_type'],
                    'entity_id' => $entity['entity_id'],
                    'position' => $entity['position'] ?? $i,
                    'tag' => $entity['tag'] ?? null,
                ]);
            }
        });

        return response()->json($comparisonPage->fresh()->load('entities'));
    }
}
