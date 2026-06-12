<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\BulkGenerateContentGapRequest;
use App\Models\ContentGap;
use App\Services\ContentGapAnalyzerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContentGapController extends Controller
{
    public function __construct(private readonly ContentGapAnalyzerService $analyzer)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $query = ContentGap::query();

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        return $this->success(
            $query->orderByDesc('gap_score')->paginate($request->integer('per_page', 20)),
            'Content gaps fetched.'
        );
    }

    public function markCreated(ContentGap $contentGap): JsonResponse
    {
        $contentGap->update(['status' => 'created']);

        return $this->success($contentGap, 'Content gap marked as created.');
    }

    public function markIgnored(ContentGap $contentGap): JsonResponse
    {
        $contentGap->update(['status' => 'ignored']);

        return $this->success($contentGap, 'Content gap marked as ignored.');
    }

    public function bulkGenerate(BulkGenerateContentGapRequest $request): JsonResponse
    {
        $data    = $request->validated();
        $created = $this->analyzer->analyzeAndStore($data['entity_type'], $data['entity_id']);

        return $this->success(['created' => $created], "Generated {$created} content gap(s).");
    }
}
