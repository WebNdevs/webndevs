<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\BulkServiceCategoryActionRequest;
use App\Http\Requests\ReorderServiceCategoriesRequest;
use App\Http\Requests\UpsertServiceCategoryRequest;
use App\Models\ServiceCategory;
use App\Services\AuditLogService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ServiceCategoryController extends Controller
{
    public function __construct(private readonly AuditLogService $auditLogService) {}

    public function index(Request $request)
    {
        $query = ServiceCategory::query()->withCount('services');

        if ($search = trim((string) $request->query('search', ''))) {
            $query->where(function ($inner) use ($search) {
                $inner->where('name', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%")
                    ->orWhere('full_slug', 'like', "%{$search}%");
            });
        }

        if ($request->query('is_active') !== null) {
            $query->where('is_active', filter_var($request->query('is_active'), FILTER_VALIDATE_BOOLEAN));
        }

        if ($request->query('parent_id') !== null) {
            $query->where('parent_id', $request->query('parent_id'));
        }

        $items = $query
            ->orderBy('display_order')
            ->orderBy('id')
            ->get();

        return $this->success($items, 'Service categories fetched.');
    }

    public function tree()
    {
        $categories = ServiceCategory::query()
            ->orderBy('display_order')
            ->orderBy('id')
            ->get(['id', 'parent_id', 'name', 'slug', 'full_slug', 'is_active', 'template_key', 'display_order']);

        $nodes = $categories->map(fn (ServiceCategory $category) => [
            'id' => $category->id,
            'parent_id' => $category->parent_id,
            'name' => $category->name,
            'slug' => $category->slug,
            'full_slug' => $category->full_slug,
            'is_active' => $category->is_active,
            'template_key' => $category->template_key,
            'display_order' => $category->display_order,
            'children' => [],
        ])->keyBy('id')->toArray();

        $tree = [];
        foreach ($nodes as $id => $node) {
            $parentId = $node['parent_id'];
            if ($parentId && isset($nodes[$parentId])) {
                $nodes[$parentId]['children'][] = $node;
                continue;
            }
            $tree[] = $node;
        }

        return $this->success($tree, 'Service category tree fetched.');
    }

    public function store(UpsertServiceCategoryRequest $request)
    {
        $validated = $request->validated();
        $parent = ! empty($validated['parent_id'])
            ? ServiceCategory::query()->find($validated['parent_id'])
            : null;

        $fullSlug = $this->buildFullSlug($parent?->full_slug, $validated['slug']);
        if (ServiceCategory::query()->where('full_slug', $fullSlug)->exists()) {
            return $this->error('Category slug path already exists.', ['slug' => ['Category slug path already exists.']], 422);
        }

        $category = ServiceCategory::query()->create([
            ...$validated,
            'full_slug' => $fullSlug,
            'is_active' => $validated['is_active'] ?? true,
            'display_order' => $validated['display_order'] ?? 0,
        ]);

        $this->auditLogService->log(
            'service_category.created',
            'service_category',
            $category->id,
            $request->user(),
            null,
            null,
            $category->toArray(),
            null,
            $request
        );

        return $this->success($category, 'Service category created.', 201);
    }

    public function update(UpsertServiceCategoryRequest $request, ServiceCategory $serviceCategory)
    {
        $before = $serviceCategory->toArray();
        $validated = $request->validated();
        $parent = array_key_exists('parent_id', $validated)
            ? ($validated['parent_id'] ? ServiceCategory::query()->find($validated['parent_id']) : null)
            : $serviceCategory->parent;

        $nextSlug = $validated['slug'] ?? $serviceCategory->slug;
        $fullSlug = $this->buildFullSlug($parent?->full_slug, $nextSlug);
        if (
            ServiceCategory::query()
                ->where('id', '!=', $serviceCategory->id)
                ->where('full_slug', $fullSlug)
                ->exists()
        ) {
            return $this->error('Category slug path already exists.', ['slug' => ['Category slug path already exists.']], 422);
        }

        DB::transaction(function () use ($serviceCategory, $validated, $fullSlug) {
            $serviceCategory->update([
                ...$validated,
                'full_slug' => $fullSlug,
            ]);

            $this->refreshDescendantFullSlugs($serviceCategory);
        });

        $serviceCategory->refresh();
        $this->auditLogService->log(
            'service_category.updated',
            'service_category',
            $serviceCategory->id,
            $request->user(),
            null,
            $before,
            $serviceCategory->toArray(),
            null,
            $request
        );

        return $this->success($serviceCategory, 'Service category updated.');
    }

    public function destroy(Request $request, ServiceCategory $serviceCategory)
    {
        $before = $serviceCategory->toArray();
        DB::transaction(function () use ($serviceCategory) {
            ServiceCategory::query()
                ->where('parent_id', $serviceCategory->id)
                ->update(['parent_id' => $serviceCategory->parent_id]);

            $serviceCategory->delete();
        });

        ServiceCategory::query()->whereNull('parent_id')->get()->each(function (ServiceCategory $root) {
            $this->refreshDescendantFullSlugs($root);
        });

        $this->auditLogService->log(
            'service_category.deleted',
            'service_category',
            $before['id'] ?? null,
            $request->user(),
            null,
            $before,
            null,
            null,
            $request
        );

        return $this->success(null, 'Service category deleted.');
    }

    public function reorder(ReorderServiceCategoriesRequest $request)
    {
        $items = collect($request->validated('items'));

        DB::transaction(function () use ($items) {
            foreach ($items as $item) {
                ServiceCategory::query()
                    ->where('id', $item['id'])
                    ->update([
                        'parent_id' => $item['parent_id'] ?? null,
                        'display_order' => $item['display_order'],
                    ]);
            }

            ServiceCategory::query()->whereNull('parent_id')->get()->each(function (ServiceCategory $root) {
                $this->refreshDescendantFullSlugs($root);
            });
        });

        return $this->success(null, 'Service categories reordered.');
    }

    public function bulk(BulkServiceCategoryActionRequest $request)
    {
        $validated = $request->validated();
        $query = ServiceCategory::query()->whereIn('id', $validated['ids']);

        if ($validated['action'] === 'delete') {
            $count = $query->count();
            $query->delete();

            return $this->success(['affected' => $count], 'Service categories deleted.');
        }

        $isActive = $validated['action'] === 'activate';
        $count = $query->update(['is_active' => $isActive]);

        return $this->success(['affected' => $count], 'Service categories updated.');
    }

    private function buildFullSlug(?string $parentFullSlug, string $slug): string
    {
        return $parentFullSlug ? "{$parentFullSlug}/{$slug}" : $slug;
    }

    private function refreshDescendantFullSlugs(ServiceCategory $category): void
    {
        $category->loadMissing('children');

        foreach ($category->children as $child) {
            $fullSlug = $this->buildFullSlug($category->full_slug, $child->slug);
            $child->update(['full_slug' => $fullSlug]);
            $this->refreshDescendantFullSlugs($child);
        }
    }
}
