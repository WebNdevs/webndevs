<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SyncServicePageContentRequest;
use App\Models\Service;
use App\Models\ServicePageContent;
use App\Services\AuditLogService;
use Illuminate\Support\Facades\DB;

class ServicePageContentController extends Controller
{
    public function __construct(private readonly AuditLogService $auditLogService) {}

    public function index(Service $service)
    {
        $items = ServicePageContent::query()
            ->where('service_id', $service->id)
            ->where('section_key', 'legacy')
            ->where('locale', 'en')
            ->where('status', 'draft')
            ->orderBy('display_order')
            ->orderBy('id')
            ->get();

        return $this->success([
            'service' => [
                'id' => $service->id,
                'name' => $service->name,
                'slug' => $service->slug,
            ],
            'items' => $items,
        ], 'Service page content fetched.');
    }

    public function sync(SyncServicePageContentRequest $request, Service $service)
    {
        $items = $request->validated('items', []);
        $before = ServicePageContent::query()
            ->where('service_id', $service->id)
            ->where('section_key', 'legacy')
            ->where('locale', 'en')
            ->where('status', 'draft')
            ->orderBy('display_order')
            ->get()
            ->toArray();

        DB::transaction(function () use ($service, $items, $request) {
            $keys = [];
            foreach ($items as $index => $item) {
                $keys[] = $item['content_key'];
                ServicePageContent::query()->updateOrCreate(
                    [
                        'service_id' => $service->id,
                        'section_key' => 'legacy',
                        'content_key' => $item['content_key'],
                        'locale' => 'en',
                        'status' => 'draft',
                    ],
                    [
                        'label' => $item['label'],
                        'content_type' => $item['content_type'],
                        'value' => $item['value'] ?? null,
                        'is_active' => (bool) ($item['is_active'] ?? true),
                        'display_order' => $item['display_order'] ?? $index,
                        'updated_by' => $request->user()?->id,
                    ]
                );
            }

            if ($keys !== []) {
                ServicePageContent::query()
                    ->where('service_id', $service->id)
                    ->where('section_key', 'legacy')
                    ->where('locale', 'en')
                    ->where('status', 'draft')
                    ->whereNotIn('content_key', $keys)
                    ->delete();
            } else {
                ServicePageContent::query()
                    ->where('service_id', $service->id)
                    ->where('section_key', 'legacy')
                    ->where('locale', 'en')
                    ->where('status', 'draft')
                    ->delete();
            }
        });

        $after = ServicePageContent::query()
            ->where('service_id', $service->id)
            ->where('section_key', 'legacy')
            ->where('locale', 'en')
            ->where('status', 'draft')
            ->orderBy('display_order')
            ->orderBy('id')
            ->get()
            ->toArray();

        $this->auditLogService->log(
            'service_page_content.synced',
            'service',
            $service->id,
            $request->user(),
            $service->id,
            $before,
            $after,
            null,
            $request
        );

        return $this->success([
            'service' => [
                'id' => $service->id,
                'name' => $service->name,
                'slug' => $service->slug,
            ],
            'items' => $after,
        ], 'Service page content synchronized.');
    }
}
