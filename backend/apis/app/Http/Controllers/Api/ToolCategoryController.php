<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreToolCategoryRequest;
use App\Http\Requests\UpdateToolCategoryRequest;
use App\Models\ToolCategory;
use Illuminate\Http\Request;

class ToolCategoryController extends Controller
{
    public function index(Request $request)
    {
        $query = ToolCategory::query()->withCount(['tools', 'features']);

        if ($search = trim((string) $request->query('search', ''))) {
            $query->where(function ($inner) use ($search) {
                $inner->where('name', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $query->orderBy('sort_order')->orderBy('name');

        return $this->success($query->get(), 'Tool categories fetched.');
    }

    public function store(StoreToolCategoryRequest $request)
    {
        $category = ToolCategory::query()->create($request->validated());

        return $this->success($category, 'Tool category created.', 201);
    }

    public function show(ToolCategory $toolCategory)
    {
        $toolCategory->load([
            'tools' => fn ($query) => $query->orderBy('sort_order')->orderBy('name'),
            'features' => fn ($query) => $query->orderBy('name'),
        ]);

        return $this->success($toolCategory, 'Tool category fetched.');
    }

    public function update(UpdateToolCategoryRequest $request, ToolCategory $toolCategory)
    {
        $toolCategory->update($request->validated());

        return $this->success($toolCategory->fresh(), 'Tool category updated.');
    }

    public function destroy(ToolCategory $toolCategory)
    {
        $toolCategory->delete();

        return $this->success(null, 'Tool category deleted.');
    }
}
