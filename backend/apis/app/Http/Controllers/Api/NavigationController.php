<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreNavigationItemRequest;
use App\Models\NavigationItem;
use App\Models\NavigationMenu;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NavigationController extends Controller
{
    public function index(): JsonResponse
    {
        return $this->success(
            NavigationMenu::query()->with(['items.children'])->orderBy('location')->get()
        );
    }

    public function show(NavigationMenu $navigationMenu): JsonResponse
    {
        return $this->success($navigationMenu->load(['items.children']));
    }

    public function header(): JsonResponse
    {
        $menu = NavigationMenu::query()
            ->where('location', 'header')
            ->where('is_active', true)
            ->with(['items.children'])
            ->first();

        return $this->success($menu);
    }

    public function footer(): JsonResponse
    {
        $menu = NavigationMenu::query()
            ->where('location', 'footer')
            ->where('is_active', true)
            ->with(['items.children'])
            ->first();

        return $this->success($menu);
    }

    public function storeMenu(Request $request): JsonResponse
    {
        $data = $request->validate([
            'location' => ['required', 'in:header,footer,mobile,sidebar'],
            'name' => ['required', 'string', 'max:100'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        return $this->success(NavigationMenu::create($data), 'Menu created.', 201);
    }

    public function updateMenu(Request $request, NavigationMenu $navigationMenu): JsonResponse
    {
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:100'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $navigationMenu->update($data);

        return $this->success($navigationMenu);
    }

    public function destroyMenu(NavigationMenu $navigationMenu): JsonResponse
    {
        $navigationMenu->delete();

        return $this->success(null, 'Deleted');
    }

    public function storeItem(StoreNavigationItemRequest $request): JsonResponse
    {
        return $this->success(NavigationItem::create($request->validated()), 'Item created.', 201);
    }

    public function updateItem(Request $request, NavigationItem $navigationItem): JsonResponse
    {
        $data = $request->validate([
            'parent_id' => ['nullable', 'integer', 'exists:navigation_items,id'],
            'label' => ['sometimes', 'string', 'max:200'],
            'url' => ['nullable', 'string', 'max:500'],
            'entity_type' => ['nullable', 'string', 'max:100'],
            'entity_id' => ['nullable', 'integer', 'min:1'],
            'icon' => ['nullable', 'string', 'max:100'],
            'badge_text' => ['nullable', 'string', 'max:50'],
            'badge_color' => ['nullable', 'string', 'max:50'],
            'is_featured' => ['nullable', 'boolean'],
            'column_number' => ['nullable', 'integer', 'min:1', 'max:4'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
            'opens_new_tab' => ['nullable', 'boolean'],
        ]);

        $navigationItem->update($data);

        return $this->success($navigationItem);
    }

    public function destroyItem(NavigationItem $navigationItem): JsonResponse
    {
        $navigationItem->delete();

        return $this->success(null, 'Deleted');
    }

    public function reorderItems(Request $request): JsonResponse
    {
        $data = $request->validate([
            'items' => ['required', 'array'],
            'items.*.id' => ['required', 'integer', 'exists:navigation_items,id'],
            'items.*.parent_id' => ['nullable', 'integer', 'exists:navigation_items,id'],
            'items.*.sort_order' => ['required', 'integer', 'min:0'],
            'items.*.column_number' => ['nullable', 'integer', 'min:1', 'max:4'],
        ]);

        foreach ($data['items'] as $item) {
            NavigationItem::whereKey($item['id'])->update([
                'parent_id' => $item['parent_id'] ?? null,
                'sort_order' => $item['sort_order'],
                'column_number' => $item['column_number'] ?? 1,
            ]);
        }

        return $this->success(null, 'Reordered');
    }
}
