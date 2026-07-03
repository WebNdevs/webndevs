<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContentItemRequest;
use App\Http\Requests\UpdateContentItemRequest;
use App\Http\Resources\ContentItemResource;
use App\Models\ContentItem;
use App\Models\ContentSection;
use Illuminate\Http\JsonResponse;

class ContentItemController extends Controller
{
    public function index(ContentSection $section): JsonResponse
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
            'items' => ContentItemResource::collection($items),
        ], 'Content items fetched.');
    }

    public function store(StoreContentItemRequest $request, ContentSection $section): JsonResponse
    {
        $validated = $request->validated();
        
        // Build base data
        $data = [
            'content_section_id' => $section->id,
            'item_key' => $validated['item_key'] ?? null,
            'sort_order' => $validated['sort_order'] ?? ($section->items()->max('sort_order') + 1),
            'is_featured' => $validated['is_featured'] ?? false,
            'is_active' => $validated['is_active'] ?? true,
            'custom_fields' => $validated['custom_fields'] ?? null,
            'external_id' => $validated['external_id'] ?? null,
            'updated_by' => $request->user()?->id,
            'avatar' => $validated['avatar'] ?? null,
        ];

        // Q&A fields
        if (isset($validated['question'])) {
            $data['question'] = $validated['question'];
            $data['answer'] = $validated['answer'] ?? null;
            $data['title'] = $validated['question'];
        }

        // Project (Pro) fields
        if (isset($validated['pro_name'])) {
            $data['pro_name'] = $validated['pro_name'];
            $data['pro_category'] = $validated['pro_category'] ?? null;
            $data['pro_url'] = $validated['pro_url'] ?? null;
            $data['pro_description'] = $validated['pro_description'] ?? null;
            // pro_results: split by new line, pro_tag: split by comma
            $proResultsRaw = $validated['pro_results'] ?? '';
            $proTagRaw = $validated['pro_tag'] ?? '';
            
            // Handle pro_results - split by new lines
            $proResultsArray = [];
            if (!empty($proResultsRaw) && is_string($proResultsRaw)) {
                $lines = preg_split('/\n+/', $proResultsRaw);
                if ($lines !== false) {
                    foreach ($lines as $line) {
                        $trimmed = trim($line);
                        if (!empty($trimmed)) {
                            $proResultsArray[] = $trimmed;
                        }
                    }
                }
            }
            $data['pro_results'] = !empty($proResultsArray) ? json_encode($proResultsArray) : null;
            
            // Handle pro_tag - split by commas
            $proTagArray = [];
            if (!empty($proTagRaw) && is_string($proTagRaw)) {
                $parts = preg_split('/,+/', $proTagRaw);
                if ($parts !== false) {
                    foreach ($parts as $part) {
                        $trimmed = trim($part);
                        if (!empty($trimmed)) {
                            $proTagArray[] = $trimmed;
                        }
                    }
                }
            }
            $data['pro_tag'] = !empty($proTagArray) ? json_encode($proTagArray) : null;
            $data['pro_badge'] = $validated['pro_badge'] ?? null;
            $data['title'] = $validated['pro_name'];
        }

        // Testimonial (Test) fields
        if (isset($validated['test_name'])) {
            $data['test_name'] = $validated['test_name'];
            $data['test_company'] = $validated['test_company'] ?? null;
            $data['test_role'] = $validated['test_role'] ?? null;
            $data['test_description'] = $validated['test_description'] ?? null;
            $data['test_url'] = $validated['test_url'] ?? null;
            $data['test_rate'] = $validated['test_rate'] ?? null;
            $data['title'] = $validated['test_name'];
        }

        // Data Tile fields
        if (isset($validated['tile_name'])) {
            $data['tile_name'] = $validated['tile_name'];
            $data['tile_url'] = $validated['tile_url'] ?? null;
            $data['tile_description'] = $validated['tile_description'] ?? null;
            $data['title'] = $validated['tile_name'];
        }

        // Service Card (Ser) fields
        if (isset($validated['ser_name'])) {
            $data['ser_name'] = $validated['ser_name'];
            $data['ser_url'] = $validated['ser_url'] ?? null;
            $data['ser_description'] = $validated['ser_description'] ?? null;
            $data['ser_icon'] = $validated['ser_icon'] ?? null;
            $data['ser_tag'] = $validated['ser_tag'] ?? null;
            $data['title'] = $validated['ser_name'];
        }

        // Choose Card (cc) fields
        if (isset($validated['cc_name'])) {
            $data['cc_name'] = $validated['cc_name'];
            $data['cc_description'] = $validated['cc_description'] ?? null;
            $data['cc_icon'] = $validated['cc_icon'] ?? null;
            $data['title'] = $validated['cc_name'];
        }

        // Process Card (pc) fields
        if (isset($validated['pc_name'])) {
            $data['pc_name'] = $validated['pc_name'];
            $data['pc_number'] = $validated['pc_number'] ?? null;
            $data['pc_description'] = $validated['pc_description'] ?? null;
            $data['pc_icon'] = $validated['pc_icon'] ?? null;
            $data['pc_timeline'] = $validated['pc_timeline'] ?? null;
            $data['title'] = $validated['pc_name'];
        }

        $item = $section->items()->create($data);

        return $this->success([
            'item' => new ContentItemResource($item),
        ], 'Content item created.', 201);
    }

    public function show(ContentSection $section, ContentItem $item): JsonResponse
    {
        if ($item->content_section_id !== $section->id) {
            return $this->error('Item does not belong to this section.', [], 404);
        }

        return $this->success(new ContentItemResource($item), 'Content item fetched.');
    }

    public function update(UpdateContentItemRequest $request, ContentSection $section, ContentItem $item): JsonResponse
    {
        if ($item->content_section_id !== $section->id) {
            return $this->error('Item does not belong to this section.', [], 404);
        }

        $validated = $request->validated();
        
        // Build update data with prefixed fields
        $data = [];

        // Q&A fields
        if (isset($validated['question'])) {
            $data['question'] = $validated['question'];
            $data['answer'] = $validated['answer'] ?? null;
            $data['title'] = $validated['question'];
        }

        // Project (Pro) fields
        if (isset($validated['pro_name'])) {
            $data['pro_name'] = $validated['pro_name'];
            $data['pro_category'] = $validated['pro_category'] ?? null;
            $data['pro_url'] = $validated['pro_url'] ?? null;
            $data['pro_description'] = $validated['pro_description'] ?? null;
            // pro_results: split by new line, pro_tag: split by comma
            $proResultsRaw = $validated['pro_results'] ?? '';
            $proTagRaw = $validated['pro_tag'] ?? '';
            
            // Handle pro_results - split by new lines
            $proResultsArray = [];
            if (!empty($proResultsRaw) && is_string($proResultsRaw)) {
                $lines = preg_split('/\n+/', $proResultsRaw);
                if ($lines !== false) {
                    foreach ($lines as $line) {
                        $trimmed = trim($line);
                        if (!empty($trimmed)) {
                            $proResultsArray[] = $trimmed;
                        }
                    }
                }
            }
            $data['pro_results'] = !empty($proResultsArray) ? json_encode($proResultsArray) : null;
            
            // Handle pro_tag - split by commas
            $proTagArray = [];
            if (!empty($proTagRaw) && is_string($proTagRaw)) {
                $parts = preg_split('/,+/', $proTagRaw);
                if ($parts !== false) {
                    foreach ($parts as $part) {
                        $trimmed = trim($part);
                        if (!empty($trimmed)) {
                            $proTagArray[] = $trimmed;
                        }
                    }
                }
            }
            $data['pro_tag'] = !empty($proTagArray) ? json_encode($proTagArray) : null;
            $data['pro_badge'] = $validated['pro_badge'] ?? null;
            $data['title'] = $validated['pro_name'];
        }

        // Testimonial (Test) fields
        if (isset($validated['test_name'])) {
            $data['test_name'] = $validated['test_name'];
            $data['test_company'] = $validated['test_company'] ?? null;
            $data['test_role'] = $validated['test_role'] ?? null;
            $data['test_description'] = $validated['test_description'] ?? null;
            $data['test_url'] = $validated['test_url'] ?? null;
            $data['test_rate'] = $validated['test_rate'] ?? null;
            $data['title'] = $validated['test_name'];
        }

        // Data Tile fields
        if (isset($validated['tile_name'])) {
            $data['tile_name'] = $validated['tile_name'];
            $data['tile_url'] = $validated['tile_url'] ?? null;
            $data['tile_description'] = $validated['tile_description'] ?? null;
            $data['title'] = $validated['tile_name'];
        }

        // Service Card (Ser) fields
        if (isset($validated['ser_name'])) {
            $data['ser_name'] = $validated['ser_name'];
            $data['ser_url'] = $validated['ser_url'] ?? null;
            $data['ser_description'] = $validated['ser_description'] ?? null;
            $data['ser_icon'] = $validated['ser_icon'] ?? null;
            $data['ser_tag'] = $validated['ser_tag'] ?? null;
            $data['title'] = $validated['ser_name'];
        }

        // Choose Card (cc) fields
        if (isset($validated['cc_name'])) {
            $data['cc_name'] = $validated['cc_name'];
            $data['cc_description'] = $validated['cc_description'] ?? null;
            $data['cc_icon'] = $validated['cc_icon'] ?? null;
            $data['title'] = $validated['cc_name'];
        }

        // Process Card (pc) fields
        if (isset($validated['pc_name'])) {
            $data['pc_name'] = $validated['pc_name'];
            $data['pc_number'] = $validated['pc_number'] ?? null;
            $data['pc_description'] = $validated['pc_description'] ?? null;
            $data['pc_icon'] = $validated['pc_icon'] ?? null;
            $data['pc_timeline'] = $validated['pc_timeline'] ?? null;
            $data['title'] = $validated['pc_name'];
        }

        // Add common fields
        if (array_key_exists('avatar', $validated)) {
            $data['avatar'] = $validated['avatar'];
        }
        if (isset($validated['item_key'])) {
            $data['item_key'] = $validated['item_key'];
        }
        if (isset($validated['sort_order'])) {
            $data['sort_order'] = $validated['sort_order'];
        }
        if (isset($validated['is_featured'])) {
            $data['is_featured'] = $validated['is_featured'];
        }
        if (isset($validated['is_active'])) {
            $data['is_active'] = $validated['is_active'];
        }
        if (isset($validated['custom_fields'])) {
            $data['custom_fields'] = $validated['custom_fields'];
        }
        if (isset($validated['external_id'])) {
            $data['external_id'] = $validated['external_id'];
        }

        $data['updated_by'] = $request->user()?->id;

        $item->update($data);

        return $this->success([
            'item' => new ContentItemResource($item->fresh()),
        ], 'Content item updated.');
    }

    public function destroy(ContentSection $section, ContentItem $item): JsonResponse
    {
        if ($item->content_section_id !== $section->id) {
            return $this->error('Item does not belong to this section.', [], 404);
        }

        $item->delete();

        return $this->success([
            'item_id' => $item->id,
            'section_id' => $section->id,
        ], 'Content item deleted.');
    }

    public function reorder(ContentSection $section): JsonResponse
    {
        $items = request()->validate([
            'items' => ['required', 'array'],
            'items.*.id' => ['required', 'integer', 'exists:content_items,id'],
            'items.*.sort_order' => ['required', 'integer'],
        ]);

        foreach ($items['items'] as $orderData) {
            ContentItem::where('id', $orderData['id'])
                ->where('content_section_id', $section->id)
                ->update(['sort_order' => $orderData['sort_order']]);
        }

        return $this->success([
            'section_id' => $section->id,
        ], 'Items reordered.');
    }

    public function bulkAction(ContentSection $section): JsonResponse
    {
        $data = request()->validate([
            'action' => ['required', 'string', 'in:activate,deactivate,delete,feature,unfeature'],
            'item_ids' => ['required', 'array'],
            'item_ids.*' => ['required', 'integer'],
        ]);

        $items = ContentItem::whereIn('id', $data['item_ids'])
            ->where('content_section_id', $section->id)
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
                ContentItem::whereIn('id', $data['item_ids'])
                    ->where('content_section_id', $section->id)
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