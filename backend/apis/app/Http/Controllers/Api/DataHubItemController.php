<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDataHubItemRequest;
use App\Http\Requests\UpdateDataHubItemRequest;
use App\Http\Resources\DataHubItemResource;
use App\Models\DataHubItem;
use App\Models\DataHubSection;
use Illuminate\Http\JsonResponse;

class DataHubItemController extends Controller
{
    public function index(DataHubSection $section): JsonResponse
    {
        $items = $section->items()
            ->orderBy('is_featured', 'desc')
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();

        return $this->success([
            'section_id' => $section->id,
            'section_key' => $section->section_key,
            'count' => $items->count(),
            'items' => DataHubItemResource::collection($items),
        ], 'DataHub items fetched.');
    }

    public function store(StoreDataHubItemRequest $request, DataHubSection $section): JsonResponse
    {
        $validated = $request->validated();
        $nextOrder = ($section->items()->max('sort_order') ?? 0) + 1;

        $data = [
            'datahub_section_id' => $section->id,
            'data' => $validated['data'] ?? [],
            'sort_order' => $validated['sort_order'] ?? $nextOrder,
            'is_featured' => (bool) ($validated['is_featured'] ?? false),
            'is_active' => (bool) ($validated['is_active'] ?? true),
            'updated_by' => $request->user()?->id,
        ];

        $item = $section->items()->create($data);

        return $this->success([
            'item' => new DataHubItemResource($item),
        ], 'DataHub item created.', 201);
    }

    public function show(DataHubSection $section, DataHubItem $item): JsonResponse
    {
        if ($item->datahub_section_id !== $section->id) {
            return $this->error('Item does not belong to this section.', [], 404);
        }

        return $this->success(new DataHubItemResource($item), 'DataHub item fetched.');
    }

    public function update(UpdateDataHubItemRequest $request, DataHubSection $section, DataHubItem $item): JsonResponse
    {
        if ($item->datahub_section_id !== $section->id) {
            return $this->error('Item does not belong to this section.', [], 404);
        }

        $validated = $request->validated();

        $data = [];

        if (array_key_exists('data', $validated)) {
            $data['data'] = $validated['data'];
        }
        if (array_key_exists('sort_order', $validated)) {
            $data['sort_order'] = $validated['sort_order'];
        }
        if (array_key_exists('is_featured', $validated)) {
            $data['is_featured'] = (bool) $validated['is_featured'];
        }
        if (array_key_exists('is_active', $validated)) {
            $data['is_active'] = (bool) $validated['is_active'];
        }

        $data['updated_by'] = $request->user()?->id;

        $item->update($data);

        return $this->success([
            'item' => new DataHubItemResource($item->fresh()),
        ], 'DataHub item updated.');
    }

    public function destroy(DataHubSection $section, DataHubItem $item): JsonResponse
    {
        if ($item->datahub_section_id !== $section->id) {
            return $this->error('Item does not belong to this section.', [], 404);
        }

        $item->delete();

        return $this->success([
            'item_id' => $item->id,
            'section_id' => $section->id,
        ], 'DataHub item deleted.');
    }

    public function reorder(DataHubSection $section): JsonResponse
    {
        $items = request()->validate([
            'items' => ['required', 'array'],
            'items.*.id' => ['required', 'integer', 'exists:datahub_section_items,id'],
            'items.*.sort_order' => ['required', 'integer'],
        ]);

        foreach ($items['items'] as $orderData) {
            DataHubItem::where('id', $orderData['id'])
                ->where('datahub_section_id', $section->id)
                ->update(['sort_order' => $orderData['sort_order']]);
        }

        return $this->success([
            'section_id' => $section->id,
        ], 'Items reordered.');
    }

    public function bulkAction(DataHubSection $section): JsonResponse
    {
        $data = request()->validate([
            'action' => ['required', 'string', 'in:activate,deactivate,delete,feature,unfeature'],
            'item_ids' => ['required', 'array'],
            'item_ids.*' => ['required', 'integer'],
        ]);

        $items = DataHubItem::whereIn('id', $data['item_ids'])
            ->where('datahub_section_id', $section->id)
            ->get();

        $affected = 0;

        switch ($data['action']) {
            case 'activate':
                $affected = $items->each(function ($item) {
                    $item->update(['is_active' => true]);
                })->count();
                break;
            case 'deactivate':
                $affected = $items->each(function ($item) {
                    $item->update(['is_active' => false]);
                })->count();
                break;
            case 'delete':
                $affected = $items->count();
                DataHubItem::whereIn('id', $data['item_ids'])
                    ->where('datahub_section_id', $section->id)
                    ->delete();
                break;
            case 'feature':
                $affected = $items->each(function ($item) {
                    $item->update(['is_featured' => true]);
                })->count();
                break;
            case 'unfeature':
                $affected = $items->each(function ($item) {
                    $item->update(['is_featured' => false]);
                })->count();
                break;
        }

        return $this->success([
            'affected' => $affected,
            'action' => $data['action'],
        ], "Bulk action '{$data['action']}' completed for {$affected} items.");
    }
}