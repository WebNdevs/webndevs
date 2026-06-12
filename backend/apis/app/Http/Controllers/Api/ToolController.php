<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreToolRequest;
use App\Http\Requests\UpdateToolRequest;
use App\Http\Resources\ToolResource;
use App\Models\CaseStudy;
use App\Models\CrossReferencePage;
use App\Models\FAQ;
use App\Models\ProcessStep;
use App\Models\Tool;
use App\Models\UseCase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ToolController extends Controller
{
    public function index(Request $request)
    {
        $query = Tool::query()->with(['category:id,name,slug']);

        if ($search = trim((string) $request->query('search', ''))) {
            $query->where(function ($inner) use ($search) {
                $inner->where('name', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%")
                    ->orWhere('tagline', 'like', "%{$search}%")
                    ->orWhere('overview', 'like', "%{$search}%");
            });
        }

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        if ($categoryId = $request->query('category_id')) {
            $query->where('tool_category_id', (int) $categoryId);
        }

        if ($request->has('featured')) {
            $query->where('is_featured', filter_var($request->query('featured'), FILTER_VALIDATE_BOOLEAN));
        }

        $sortBy = (string) $request->query('sort_by', 'sort_order');
        $sortDirection = strtolower((string) $request->query('sort_dir', 'asc')) === 'desc' ? 'desc' : 'asc';
        $allowedSort = ['name', 'sort_order', 'published_at', 'created_at', 'updated_at'];
        if (! \in_array($sortBy, $allowedSort, true)) {
            $sortBy = 'sort_order';
        }
        $query->orderBy($sortBy, $sortDirection)->orderBy('id');

        $include = collect(explode(',', (string) $request->query('include', '')))
            ->map(fn (string $item) => trim($item))
            ->filter()
            ->values()
            ->all();
        $allowedIncludes = ['features', 'solutions'];
        $load = collect($include)->filter(fn (string $item) => \in_array($item, $allowedIncludes, true))->values()->all();
        if ($load !== []) {
            $query->with($load);
        }

        $perPage = min(max((int) $request->query('per_page', 20), 1), 20);

        return $this->success(
            ToolResource::collection($query->paginate($perPage)),
            'Tools fetched.'
        );
    }

    public function featured(Request $request)
    {
        $limit = min(max((int) $request->query('limit', 8), 1), 50);

        $tools = Tool::query()
            ->with(['category:id,name,slug', 'features:id,name,slug'])
            ->where('is_featured', true)
            ->where('status', 'published')
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->limit($limit)
            ->get();

        return $this->success(ToolResource::collection($tools), 'Featured tools fetched.');
    }

    public function store(StoreToolRequest $request)
    {
        $validated = $request->validated();
        $featureIds = array_values(array_unique($validated['feature_ids'] ?? []));

        $tool = DB::transaction(function () use ($validated, $featureIds) {
            $tool = Tool::query()->create(
                collect($validated)->except('feature_ids')->toArray()
            );

            if ($featureIds !== []) {
                $tool->features()->sync($featureIds);
            }

            return $tool;
        });

        return $this->success(
            new ToolResource($tool->fresh()->load(['category', 'features', 'solutions'])),
            'Tool created.',
            201
        );
    }

    public function show(Tool $tool)
    {
        $tool->load(['category', 'features', 'solutions.industry']);

        $tool->setRelation('useCases', UseCase::query()
            ->where('entity_type', Tool::class)
            ->where('entity_id', $tool->id)
            ->orderBy('sort_order')
            ->get());

        $tool->setRelation('processSteps', ProcessStep::query()
            ->where('entity_type', Tool::class)
            ->where('entity_id', $tool->id)
            ->orderBy('step_number')
            ->get());

        $tool->setRelation('faqs', FAQ::query()
            ->where('entity_type', Tool::class)
            ->where('entity_id', $tool->id)
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get());

        $tool->setRelation('crossReferences', $this->toolCrossReferenceQuery($tool)->get());

        $caseStudyIds = DB::table('case_study_entity_pivot')
            ->where('entity_type', Tool::class)
            ->where('entity_id', $tool->id)
            ->pluck('case_study_id');

        $tool->setRelation('caseStudies', CaseStudy::query()
            ->whereIn('id', $caseStudyIds)
            ->where('status', 'published')
            ->orderByDesc('published_at')
            ->get());

        return $this->success(new ToolResource($tool), 'Tool fetched.');
    }

    public function crossReferences(Tool $tool)
    {
        $crossReferences = $this->toolCrossReferenceQuery($tool)->get();

        return $this->success(
            \App\Http\Resources\CrossReferencePageResource::collection($crossReferences),
            'Tool cross references fetched.'
        );
    }

    public function update(UpdateToolRequest $request, Tool $tool)
    {
        $validated = $request->validated();
        $featureIds = array_values(array_unique($validated['feature_ids'] ?? []));

        DB::transaction(function () use ($validated, $featureIds, $tool) {
            $payload = collect($validated)->except('feature_ids')->toArray();
            if ($payload !== []) {
                $tool->update($payload);
            }

            if (\array_key_exists('feature_ids', $validated)) {
                $tool->features()->sync($featureIds);
            }
        });

        return $this->success(
            new ToolResource($tool->fresh()->load(['category', 'features', 'solutions'])),
            'Tool updated.'
        );
    }

    public function destroy(Tool $tool)
    {
        $tool->delete();

        return $this->success(null, 'Tool deleted.');
    }

    private function toolCrossReferenceQuery(Tool $tool)
    {
        return CrossReferencePage::query()
            ->with([
                'entityA',
                'entityB',
                'entityC',
            ])
            ->where(function ($query) use ($tool) {
                $query->where(function ($inner) use ($tool) {
                    $inner->where('entity_a_type', Tool::class)->where('entity_a_id', $tool->id);
                })->orWhere(function ($inner) use ($tool) {
                    $inner->where('entity_b_type', Tool::class)->where('entity_b_id', $tool->id);
                })->orWhere(function ($inner) use ($tool) {
                    $inner->where('entity_c_type', Tool::class)->where('entity_c_id', $tool->id);
                });
            })
            ->where('status', 'published')
            ->orderByDesc('published_at');
    }
}
