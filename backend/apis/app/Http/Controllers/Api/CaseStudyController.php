<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ReplaceCaseStudyMetricsRequest;
use App\Http\Requests\StoreCaseStudyRequest;
use App\Http\Requests\UpdateCaseStudyRequest;
use App\Models\CaseStudy;
use App\Models\CaseStudyEntityPivot;
use App\Models\CaseStudyMetric;
use App\Models\Industry;
use App\Models\Service;
use App\Models\Tool;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class CaseStudyController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = CaseStudy::query()->with(['metrics', 'entityLinks']);

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        if ($request->boolean('featured_only')) {
            $query->where('is_featured', true);
        }

        if ($request->filled('tool_id')) {
            $toolId = $request->integer('tool_id');
            $query->whereHas('entityLinks', fn ($q) => $q
                ->where('entity_type', Tool::class)
                ->where('entity_id', $toolId));
        }

        if ($request->filled('industry_id')) {
            $industryId = $request->integer('industry_id');
            $query->whereHas('entityLinks', fn ($q) => $q
                ->where('entity_type', Industry::class)
                ->where('entity_id', $industryId));
        }

        if ($request->filled('service_id')) {
            $serviceId = $request->integer('service_id');
            $query->whereHas('entityLinks', fn ($q) => $q
                ->where('entity_type', Service::class)
                ->where('entity_id', $serviceId));
        }

        return $this->success(
            $query->orderByDesc('published_at')->orderByDesc('id')->paginate($request->integer('per_page', 15)),
            'Case studies fetched.'
        );
    }

    public function show(CaseStudy $caseStudy): JsonResponse
    {
        return $this->success($caseStudy->load(['metrics', 'entityLinks']), 'Case study fetched.');
    }

    public function store(StoreCaseStudyRequest $request): JsonResponse
    {
        $data        = $request->validated();
        $metrics     = $data['metrics'] ?? [];
        $entityLinks = $data['entity_links'] ?? [];
        unset($data['metrics'], $data['entity_links']);

        $caseStudy = DB::transaction(function () use ($data, $metrics, $entityLinks) {
            $model = CaseStudy::create($data);

            foreach ($metrics as $i => $metric) {
                CaseStudyMetric::create([
                    'case_study_id' => $model->id,
                    'label'         => $metric['label'],
                    'before_value'  => $metric['before_value'],
                    'after_value'   => $metric['after_value'],
                    'unit'          => $metric['unit'] ?? null,
                    'improvement'   => $metric['improvement'] ?? null,
                    'sort_order'    => $metric['sort_order'] ?? $i,
                ]);
            }

            foreach ($entityLinks as $link) {
                CaseStudyEntityPivot::create([
                    'case_study_id' => $model->id,
                    'entity_type'   => $link['entity_type'],
                    'entity_id'     => $link['entity_id'],
                ]);
            }

            return $model;
        });

        return $this->success($caseStudy->load(['metrics', 'entityLinks']), 'Case study created.', 201);
    }

    public function update(UpdateCaseStudyRequest $request, CaseStudy $caseStudy): JsonResponse
    {
        $caseStudy->update($request->validated());
        

        return $this->success($caseStudy->fresh()->load(['metrics', 'entityLinks']), 'Case study updated.');
    }

    public function destroy(CaseStudy $caseStudy): JsonResponse
    {
        $caseStudy->delete();

        return $this->success(null, 'Case study deleted.');
    }

    public function replaceMetrics(ReplaceCaseStudyMetricsRequest $request, CaseStudy $caseStudy): JsonResponse
    {
        DB::transaction(function () use ($caseStudy, $request) {
            $caseStudy->metrics()->delete();

            foreach ($request->validated()['metrics'] as $i => $metric) {
                CaseStudyMetric::create([
                    'case_study_id' => $caseStudy->id,
                    'label'         => $metric['label'],
                    'before_value'  => $metric['before_value'],
                    'after_value'   => $metric['after_value'],
                    'unit'          => $metric['unit'] ?? null,
                    'improvement'   => $metric['improvement'] ?? null,
                    'sort_order'    => $metric['sort_order'] ?? $i,
                ]);
            }
        });

        return $this->success($caseStudy->fresh()->load('metrics'), 'Metrics replaced.');
    }
}
