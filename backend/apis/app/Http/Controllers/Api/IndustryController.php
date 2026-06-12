<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreIndustryRequest;
use App\Http\Requests\UpdateIndustryRequest;
use App\Http\Resources\IndustryResource;
use App\Http\Resources\ToolResource;
use App\Models\CaseStudy;
use App\Models\Industry;
use App\Models\Tool;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class IndustryController extends Controller
{
    public function index(Request $request)
    {
        $query = Industry::query()->withCount(['solutions', 'useCases']);

        if ($search = trim((string) $request->query('search', ''))) {
            $query->where(function ($inner) use ($search) {
                $inner->where('name', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%")
                    ->orWhere('tagline', 'like', "%{$search}%");
            });
        }

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        if ($request->has('featured')) {
            $query->where('is_featured', filter_var($request->query('featured'), FILTER_VALIDATE_BOOLEAN));
        }

        $query->orderBy('name');
        $perPage = min(max((int) $request->query('per_page', 20), 1), 20);

        return $this->success(
            IndustryResource::collection($query->paginate($perPage)),
            'Industries fetched.'
        );
    }

    public function store(StoreIndustryRequest $request)
    {
        $industry = Industry::query()->create($request->validated());

        return $this->success(new IndustryResource($industry), 'Industry created.', 201);
    }

    public function show(Industry $industry)
    {
        $industry->load(['solutions.tools', 'useCases']);

        $industry->setRelation('tools', Tool::query()
            ->whereIn('id', function ($query) use ($industry) {
                $query->from('solution_tool_pivot')
                    ->join('solutions', 'solutions.id', '=', 'solution_tool_pivot.solution_id')
                    ->where('solutions.industry_id', $industry->id)
                    ->select('solution_tool_pivot.tool_id')
                    ->distinct();
            })
            ->with('category:id,name,slug')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get());

        $caseStudyIds = DB::table('case_study_entity_pivot')
            ->where('entity_type', Industry::class)
            ->where('entity_id', $industry->id)
            ->pluck('case_study_id');

        $industry->setRelation('caseStudies', CaseStudy::query()
            ->whereIn('id', $caseStudyIds)
            ->where('status', 'published')
            ->orderByDesc('published_at')
            ->get());

        return $this->success(new IndustryResource($industry), 'Industry fetched.');
    }

    public function update(UpdateIndustryRequest $request, Industry $industry)
    {
        $industry->update($request->validated());

        return $this->success(new IndustryResource($industry->fresh()), 'Industry updated.');
    }

    public function destroy(Industry $industry)
    {
        $industry->delete();

        return $this->success(null, 'Industry deleted.');
    }

    public function tools(Industry $industry)
    {
        $toolIds = $industry->solutions()
            ->join('solution_tool_pivot', 'solutions.id', '=', 'solution_tool_pivot.solution_id')
            ->select('solution_tool_pivot.tool_id')
            ->distinct()
            ->pluck('solution_tool_pivot.tool_id');

        $tools = Tool::query()
            ->whereIn('id', $toolIds)
            ->with(['category:id,name,slug', 'features:id,name,slug'])
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        return $this->success(ToolResource::collection($tools), 'Industry tools fetched.');
    }

    public function solutions(Industry $industry)
    {
        $solutions = $industry->solutions()
            ->with(['tools:id,name,slug'])
            ->orderBy('name')
            ->get();

        return $this->success(
            \App\Http\Resources\SolutionResource::collection($solutions),
            'Industry solutions fetched.'
        );
    }
}
