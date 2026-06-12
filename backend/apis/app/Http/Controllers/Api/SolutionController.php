<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSolutionRequest;
use App\Http\Requests\UpdateSolutionRequest;
use App\Models\CaseStudyEntityPivot;
use App\Models\ProcessStep;
use App\Models\Solution;
use App\Models\Tool;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SolutionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Solution::query()->with(['industry', 'businessSize', 'tools']);

        if ($request->filled('industry_id')) {
            $query->where('industry_id', $request->integer('industry_id'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        if ($request->filled('tool_id')) {
            $toolId = $request->integer('tool_id');
            $query->whereHas('tools', fn ($q) => $q->where('tools.id', $toolId));
        }

        return $this->success(
            $query->orderByDesc('id')->paginate($request->integer('per_page', 15)),
            'Solutions fetched.'
        );
    }

    public function show(Solution $solution): JsonResponse
    {
        $solution->load(['industry', 'businessSize', 'tools']);
        $solution->setRelation(
            'process_steps',
            ProcessStep::query()
                ->where('entity_type', Solution::class)
                ->where('entity_id', $solution->id)
                ->orderBy('step_number')
                ->get()
        );

        $caseStudyIds = CaseStudyEntityPivot::query()
            ->where('entity_type', Solution::class)
            ->where('entity_id', $solution->id)
            ->pluck('case_study_id');
        $solution->setAttribute('case_study_ids', $caseStudyIds);

        return $this->success($solution, 'Solution fetched.');
    }

    public function store(StoreSolutionRequest $request): JsonResponse
    {
        $data    = $request->validated();
        $toolIds = $data['tool_ids'] ?? [];
        unset($data['tool_ids']);

        $solution = Solution::create($data);
        if ($toolIds !== []) {
            $solution->tools()->sync($toolIds);
        }

        return $this->success($solution->load(['industry', 'businessSize', 'tools']), 'Solution created.', 201);
    }

    public function update(UpdateSolutionRequest $request, Solution $solution): JsonResponse
    {
        $data    = $request->validated();
        $toolIds = $data['tool_ids'] ?? null;
        unset($data['tool_ids']);

        $solution->update($data);
        if (is_array($toolIds)) {
            $solution->tools()->sync($toolIds);
        }

        return $this->success($solution->fresh()->load(['industry', 'businessSize', 'tools']), 'Solution updated.');
    }

    public function destroy(Solution $solution): JsonResponse
    {
        $solution->delete();

        return $this->success(null, 'Solution deleted.');
    }

    public function attachTool(Request $request, Solution $solution): JsonResponse
    {
        $data = $request->validate(['tool_id' => ['required', 'integer', 'exists:tools,id']]);
        $solution->tools()->syncWithoutDetaching([$data['tool_id']]);

        return $this->success($solution->fresh('tools'), 'Tool attached.');
    }

    public function detachTool(Solution $solution, Tool $tool): JsonResponse
    {
        $solution->tools()->detach($tool->id);

        return $this->success($solution->fresh('tools'), 'Tool detached.');
    }
}
