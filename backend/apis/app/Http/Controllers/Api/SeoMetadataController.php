<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\BulkUpdateSeoMetadataRequest;
use App\Http\Requests\StoreSeoMetadataRequest;
use App\Http\Requests\UpdateSeoMetadataRequest;
use App\Models\SeoMetadata;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SeoMetadataController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = SeoMetadata::query();

        if ($request->filled('entity_type')) {
            $query->where('entity_type', $request->string('entity_type'));
        }

        if ($request->filled('entity_id')) {
            $query->where('entity_id', $request->integer('entity_id'));
        }

        return $this->success(
            $query->orderByDesc('id')->paginate($request->integer('per_page', 20)),
            'SEO metadata fetched.'
        );
    }

    public function show(SeoMetadata $seoMetadata): JsonResponse
    {
        return $this->success($seoMetadata, 'SEO metadata fetched.');
    }

    public function store(StoreSeoMetadataRequest $request): JsonResponse
    {
        return $this->success(SeoMetadata::create($request->validated()), 'SEO metadata created.', 201);
    }

    public function update(UpdateSeoMetadataRequest $request, SeoMetadata $seoMetadata): JsonResponse
    {
        $seoMetadata->update($request->validated());

        return $this->success($seoMetadata->fresh(), 'SEO metadata updated.');
    }

    public function destroy(SeoMetadata $seoMetadata): JsonResponse
    {
        $seoMetadata->delete();

        return $this->success(null, 'SEO metadata deleted.');
    }

    public function bulkUpdate(BulkUpdateSeoMetadataRequest $request): JsonResponse
    {
        foreach ($request->validated()['items'] as $item) {
            SeoMetadata::updateOrCreate(
                ['entity_type' => $item['entity_type'], 'entity_id' => $item['entity_id']],
                $item
            );
        }

        return $this->success(null, 'SEO metadata bulk updated.');
    }
}
