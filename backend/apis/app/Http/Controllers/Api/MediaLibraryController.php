<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\BulkMediaAssetActionRequest;
use App\Http\Requests\BulkUpsertMediaAssetsRequest;
use App\Http\Requests\StoreMediaFolderRequest;
use App\Http\Requests\UpdateMediaFolderRequest;
use App\Models\MediaAsset;
use App\Models\MediaFolder;
use App\Services\AuditLogService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MediaLibraryController extends Controller
{
    public function __construct(private readonly AuditLogService $auditLogService) {}

    public function foldersTree()
    {
        $folders = MediaFolder::query()
            ->orderBy('display_order')
            ->orderBy('id')
            ->get(['id', 'parent_id', 'name', 'slug', 'full_path', 'display_order']);

        $nodes = $folders->map(fn (MediaFolder $folder) => [
            'id' => $folder->id,
            'parent_id' => $folder->parent_id,
            'name' => $folder->name,
            'slug' => $folder->slug,
            'full_path' => $folder->full_path,
            'display_order' => $folder->display_order,
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

        return $this->success($tree, 'Media folders fetched.');
    }

    public function createFolder(StoreMediaFolderRequest $request)
    {
        $validated = $request->validated();
        $parent = ! empty($validated['parent_id'])
            ? MediaFolder::query()->find($validated['parent_id'])
            : null;

        $fullPath = $this->buildFullPath($parent?->full_path, $validated['slug']);
        if (MediaFolder::query()->where('full_path', $fullPath)->exists()) {
            return $this->error('Folder path already exists.', ['slug' => ['Folder path already exists.']], 422);
        }

        $folder = MediaFolder::query()->create([
            ...$validated,
            'full_path' => $fullPath,
            'display_order' => $validated['display_order'] ?? 0,
        ]);

        return $this->success($folder, 'Media folder created.', 201);
    }

    public function updateFolder(UpdateMediaFolderRequest $request, MediaFolder $mediaFolder)
    {
        $validated = $request->validated();
        $parent = array_key_exists('parent_id', $validated)
            ? ($validated['parent_id'] ? MediaFolder::query()->find($validated['parent_id']) : null)
            : $mediaFolder->parent;
        $nextSlug = $validated['slug'] ?? $mediaFolder->slug;
        $fullPath = $this->buildFullPath($parent?->full_path, $nextSlug);

        if (
            MediaFolder::query()
                ->where('id', '!=', $mediaFolder->id)
                ->where('full_path', $fullPath)
                ->exists()
        ) {
            return $this->error('Folder path already exists.', ['slug' => ['Folder path already exists.']], 422);
        }

        DB::transaction(function () use ($mediaFolder, $validated, $fullPath) {
            $mediaFolder->update([
                ...$validated,
                'full_path' => $fullPath,
            ]);

            $this->refreshDescendantPaths($mediaFolder);
        });

        return $this->success($mediaFolder->fresh(), 'Media folder updated.');
    }

    public function deleteFolder(MediaFolder $mediaFolder)
    {
        DB::transaction(function () use ($mediaFolder) {
            MediaFolder::query()
                ->where('parent_id', $mediaFolder->id)
                ->update(['parent_id' => $mediaFolder->parent_id]);

            MediaAsset::query()
                ->where('media_folder_id', $mediaFolder->id)
                ->update(['media_folder_id' => $mediaFolder->parent_id]);

            $mediaFolder->delete();
        });

        MediaFolder::query()->whereNull('parent_id')->get()->each(function (MediaFolder $root) {
            $this->refreshDescendantPaths($root);
        });

        return $this->success(null, 'Media folder deleted.');
    }

    public function assets(Request $request)
    {
        $query = MediaAsset::query()->with(['folder:id,name,full_path', 'service:id,name,slug', 'category:id,name,full_slug']);

        if ($search = trim((string) $request->query('search', ''))) {
            $query->where(function ($inner) use ($search) {
                $inner->where('title', 'like', "%{$search}%")
                    ->orWhere('alt_text', 'like', "%{$search}%")
                    ->orWhere('file_name', 'like', "%{$search}%")
                    ->orWhere('url', 'like', "%{$search}%");
            });
        }

        if ($request->query('media_folder_id') !== null) {
            $query->where('media_folder_id', $request->query('media_folder_id'));
        }
        if ($request->query('service_id') !== null) {
            $query->where('service_id', $request->query('service_id'));
        }
        if ($request->query('service_category_id') !== null) {
            $query->where('service_category_id', $request->query('service_category_id'));
        }
        if ($request->query('is_optimized') !== null) {
            $query->where('is_optimized', filter_var($request->query('is_optimized'), FILTER_VALIDATE_BOOLEAN));
        }

        $assets = $query
            ->orderBy('display_order')
            ->orderByDesc('id')
            ->paginate(min(max((int) $request->query('per_page', 20), 1), 100));

        return $this->success($assets, 'Media assets fetched.');
    }

    public function bulkUpsertAssets(BulkUpsertMediaAssetsRequest $request)
    {
        $items = $request->validated('items', []);

        DB::transaction(function () use ($items, $request) {
            foreach ($items as $index => $item) {
                $id = $item['id'] ?? null;
                $payload = [
                    'media_folder_id' => $item['media_folder_id'] ?? null,
                    'service_id' => $item['service_id'] ?? null,
                    'service_category_id' => $item['service_category_id'] ?? null,
                    'title' => $item['title'] ?? null,
                    'alt_text' => $item['alt_text'] ?? null,
                    'caption' => $item['caption'] ?? null,
                    'file_name' => $item['file_name'],
                    'disk' => $item['disk'] ?? 'public',
                    'path' => $item['path'],
                    'url' => $item['url'],
                    'mime_type' => $item['mime_type'] ?? null,
                    'size_bytes' => $item['size_bytes'] ?? 0,
                    'width' => $item['width'] ?? null,
                    'height' => $item['height'] ?? null,
                    'tags' => $item['tags'] ?? null,
                    'optimization_meta' => $item['optimization_meta'] ?? null,
                    'is_optimized' => (bool) ($item['is_optimized'] ?? false),
                    'display_order' => $item['display_order'] ?? $index,
                    'uploaded_by' => $request->user()?->id,
                ];

                if ($id) {
                    MediaAsset::query()->where('id', $id)->update($payload);
                } else {
                    MediaAsset::query()->create($payload);
                }
            }
        });

        $this->auditLogService->log(
            'media_asset.bulk_upsert',
            'media_asset',
            null,
            $request->user(),
            null,
            null,
            ['count' => count($items)],
            null,
            $request
        );

        return $this->success(['affected' => count($items)], 'Media assets synchronized.');
    }

    public function bulkAssetAction(BulkMediaAssetActionRequest $request)
    {
        $validated = $request->validated();
        $query = MediaAsset::query()->whereIn('id', $validated['ids']);

        if ($validated['action'] === 'delete') {
            $count = $query->count();
            $query->delete();

            return $this->success(['affected' => $count], 'Media assets deleted.');
        }

        if ($validated['action'] === 'move') {
            $count = $query->update(['media_folder_id' => $validated['media_folder_id']]);

            return $this->success(['affected' => $count], 'Media assets moved.');
        }

        $count = $query->update([
            'is_optimized' => true,
            'optimization_meta' => [
                'optimized_at' => now()->toISOString(),
                'optimizer' => 'admin_bulk',
            ],
        ]);

        return $this->success(['affected' => $count], 'Media assets marked as optimized.');
    }

    private function buildFullPath(?string $parentPath, string $slug): string
    {
        return $parentPath ? "{$parentPath}/{$slug}" : $slug;
    }

    private function refreshDescendantPaths(MediaFolder $folder): void
    {
        $folder->loadMissing('children');
        foreach ($folder->children as $child) {
            $fullPath = $this->buildFullPath($folder->full_path, $child->slug);
            $child->update(['full_path' => $fullPath]);
            $this->refreshDescendantPaths($child);
        }
    }
}
