<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreServiceItemRequest;
use App\Http\Requests\UpdateServiceItemRequest;
use App\Http\Resources\ServiceItemResource;
use App\Models\ServiceItem;
use App\Models\ServiceSection;
use Illuminate\Http\JsonResponse;

class ServiceItemController extends Controller
{
    public function index(ServiceSection $section): JsonResponse
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
            'items' => ServiceItemResource::collection($items),
        ], 'Service items fetched.');
    }

    public function store(StoreServiceItemRequest $request, ServiceSection $section): JsonResponse
    {
        $validated = $request->validated();
        $nextOrder = ($section->items()->max('sort_order') ?? 0) + 1;

        $data = [
            'service_section_id' => $section->id,
            'data' => $validated['data'] ?? [],
            'sort_order' => $validated['sort_order'] ?? $nextOrder,
            'is_featured' => (bool) ($validated['is_featured'] ?? false),
            'is_active' => (bool) ($validated['is_active'] ?? true),
            'updated_by' => $request->user()?->id,
        ];

        $item = $section->items()->create($data);

        return $this->success([
            'item' => new ServiceItemResource($item),
        ], 'Service item created.', 201);
    }

    public function show(ServiceSection $section, ServiceItem $item): JsonResponse
    {
        if ($item->service_section_id !== $section->id) {
            return $this->error('Item does not belong to this section.', [], 404);
        }

        return $this->success(new ServiceItemResource($item), 'Service item fetched.');
    }

    public function update(UpdateServiceItemRequest $request, ServiceSection $section, ServiceItem $item): JsonResponse
    {
        if ($item->service_section_id !== $section->id) {
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
            'item' => new ServiceItemResource($item->fresh()),
        ], 'Service item updated.');
    }

    public function destroy(ServiceSection $section, ServiceItem $item): JsonResponse
    {
        if ($item->service_section_id !== $section->id) {
            return $this->error('Item does not belong to this section.', [], 404);
        }

        $item->delete();

        return $this->success([
            'item_id' => $item->id,
            'section_id' => $section->id,
        ], 'Service item deleted.');
    }

    public function reorder(ServiceSection $section): JsonResponse
    {
        $items = request()->validate([
            'items' => ['required', 'array'],
            'items.*.id' => ['required', 'integer', 'exists:service_section_items,id'],
            'items.*.sort_order' => ['required', 'integer'],
        ]);

        foreach ($items['items'] as $orderData) {
            ServiceItem::where('id', $orderData['id'])
                ->where('service_section_id', $section->id)
                ->update(['sort_order' => $orderData['sort_order']]);
        }

        return $this->success([
            'section_id' => $section->id,
        ], 'Items reordered.');
    }

    public function bulkAction(ServiceSection $section): JsonResponse
    {
        $data = request()->validate([
            'action' => ['required', 'string', 'in:activate,deactivate,delete,feature,unfeature'],
            'item_ids' => ['required', 'array'],
            'item_ids.*' => ['required', 'integer'],
        ]);

        $items = ServiceItem::whereIn('id', $data['item_ids'])
            ->where('service_section_id', $section->id)
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
                ServiceItem::whereIn('id', $data['item_ids'])
                    ->where('service_section_id', $section->id)
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