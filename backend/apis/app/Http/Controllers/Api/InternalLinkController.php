<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AutoScanInternalLinksRequest;
use App\Models\InternalLink;
use App\Services\InternalLinkService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InternalLinkController extends Controller
{
    public function __construct(private readonly InternalLinkService $internalLinkService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $query = InternalLink::query();

        if (! $request->boolean('include_confirmed')) {
            $query->where('is_confirmed', false);
        }

        return $this->success(
            $query->orderByDesc('id')->paginate($request->integer('per_page', 20)),
            'Internal links fetched.'
        );
    }

    public function confirm(InternalLink $internalLink): JsonResponse
    {
        $internalLink->update([
            'is_confirmed' => true,
            'confirmed_at' => now(),
        ]);

        return $this->success($internalLink, 'Internal link confirmed.');
    }

    public function reject(InternalLink $internalLink): JsonResponse
    {
        $internalLink->delete();

        return $this->success(null, 'Internal link rejected.');
    }

    public function autoScan(AutoScanInternalLinksRequest $request): JsonResponse
    {
        $data    = $request->validated();
        $created = $this->internalLinkService->scanEntity($data['entity_type'], $data['entity_id']);

        return $this->success(['created' => $created], "Created {$created} internal link suggestion(s).");
    }
}
