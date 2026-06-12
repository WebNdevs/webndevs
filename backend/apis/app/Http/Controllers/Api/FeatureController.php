<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFeatureRequest;
use App\Http\Requests\UpdateFeatureRequest;
use App\Models\Feature;
use Illuminate\Http\Request;

class FeatureController extends Controller
{
    public function index(Request $request)
    {
        $query = Feature::query()->with('category:id,name,slug')->withCount('tools');

        if ($search = trim((string) $request->query('search', ''))) {
            $query->where(function ($inner) use ($search) {
                $inner->where('name', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($categoryId = $request->query('tool_category_id')) {
            $query->where('tool_category_id', (int) $categoryId);
        }

        $query->orderBy('name');
        $perPage = min(max((int) $request->query('per_page', 20), 1), 20);

        return $this->success($query->paginate($perPage), 'Features fetched.');
    }

    public function store(StoreFeatureRequest $request)
    {
        $feature = Feature::query()->create($request->validated());

        return $this->success($feature->fresh(['category']), 'Feature created.', 201);
    }

    public function show(Feature $feature)
    {
        $feature->load(['category', 'tools:id,name,slug']);

        return $this->success($feature, 'Feature fetched.');
    }

    public function update(UpdateFeatureRequest $request, Feature $feature)
    {
        $feature->update($request->validated());

        return $this->success($feature->fresh(['category']), 'Feature updated.');
    }

    public function destroy(Feature $feature)
    {
        $feature->delete();

        return $this->success(null, 'Feature deleted.');
    }
}
