<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UseCase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UseCaseController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = UseCase::query()->with('industry');

        if ($request->filled('entity_type')) {
            $query->where('entity_type', $request->string('entity_type'));
        }

        if ($request->filled('entity_id')) {
            $query->where('entity_id', $request->integer('entity_id'));
        }

        if ($request->filled('industry_id')) {
            $query->where('industry_id', $request->integer('industry_id'));
        }

        return $this->success($query->orderBy('sort_order')->paginate($request->integer('per_page', 20)), 'Use cases fetched.');
    }

    public function show(UseCase $useCase): JsonResponse
    {
        return $this->success($useCase->load('industry'), 'Use case fetched.');
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'entity_type' => ['required', 'string', 'max:100'],
            'entity_id' => ['required', 'integer', 'min:1'],
            'title' => ['required', 'string', 'max:300'],
            'description' => ['required', 'string'],
            'icon' => ['nullable', 'string', 'max:100'],
            'industry_id' => ['nullable', 'integer', 'exists:industries,id'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        return $this->success(UseCase::create($data)->load('industry'), 'Use case created.', 201);
    }

    public function update(Request $request, UseCase $useCase): JsonResponse
    {
        $data = $request->validate([
            'title' => ['sometimes', 'string', 'max:300'],
            'description' => ['sometimes', 'string'],
            'icon' => ['nullable', 'string', 'max:100'],
            'industry_id' => ['nullable', 'integer', 'exists:industries,id'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        $useCase->update($data);

        return $this->success($useCase->fresh()->load('industry'), 'Use case updated.');
    }

    public function destroy(UseCase $useCase): JsonResponse
    {
        $useCase->delete();

        return $this->success(null, 'Deleted');
    }
}
