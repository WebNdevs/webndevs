<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RollbackServicePageSectionsRequest;
use App\Http\Requests\UpsertServicePageSectionsRequest;
use App\Models\Service;
use App\Models\ServicePageContent;
use App\Models\ServicePageContentVersion;
use App\Services\AuditLogService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ServicePageSectionController extends Controller
{
    public function __construct(private readonly AuditLogService $auditLogService) {}

    public function show(Service $service, Request $request)
    {
        $validated = $request->validate([
            'locale' => ['nullable', 'string', 'max:16', 'regex:/^[a-z]{2}(-[A-Z]{2})?$/'],
            'stage' => ['nullable', 'string', 'in:draft,published'],
        ]);
        $locale = (string) ($validated['locale'] ?? 'en');
        $stage = (string) ($validated['stage'] ?? 'published');

        $items = ServicePageContent::query()
            ->where('service_id', $service->id)
            ->where('locale', $locale)
            ->where('status', $stage)
            ->orderBy('section_key')
            ->orderBy('display_order')
            ->orderBy('id')
            ->get();

        return $this->success([
            'service' => [
                'id' => $service->id,
                'name' => $service->name,
                'slug' => $service->slug,
            ],
            'locale' => $locale,
            'stage' => $stage,
            'sections' => $this->groupSections($items),
        ], 'Service section content fetched.');
    }

    public function sync(UpsertServicePageSectionsRequest $request, Service $service)
    {
        $validated = $request->validated();
        $locale = $validated['locale'] ?? 'en';
        $sections = $validated['sections'];
        $beforeDraft = $this->snapshot($service->id, $locale, 'draft');

        DB::transaction(function () use ($request, $service, $locale, $sections) {
            ServicePageContent::query()
                ->where('service_id', $service->id)
                ->where('locale', $locale)
                ->where('status', 'draft')
                ->delete();

            foreach ($sections as $sectionIndex => $section) {
                $items = $section['items'] ?? [];
                foreach ($items as $itemIndex => $item) {
                    ServicePageContent::query()->create([
                        'service_id' => $service->id,
                        'section_key' => $section['section_key'],
                        'content_key' => $section['section_key'].'_item_'.$itemIndex,
                        'label' => $section['heading'] ?? $section['section_key'],
                        'subheading' => $section['subheading'] ?? null,
                        'content_type' => 'json',
                        'value' => $item,
                        'locale' => $locale,
                        'status' => 'draft',
                        'is_active' => (bool) ($section['is_active'] ?? true),
                        'display_order' => ($sectionIndex * 100) + $itemIndex,
                        'updated_by' => $request->user()?->id,
                    ]);
                }

                if ($items === []) {
                    ServicePageContent::query()->create([
                        'service_id' => $service->id,
                        'section_key' => $section['section_key'],
                        'content_key' => $section['section_key'].'_item_0',
                        'label' => $section['heading'] ?? $section['section_key'],
                        'subheading' => $section['subheading'] ?? null,
                        'content_type' => 'json',
                        'value' => [],
                        'locale' => $locale,
                        'status' => 'draft',
                        'is_active' => (bool) ($section['is_active'] ?? true),
                        'display_order' => $sectionIndex * 100,
                        'updated_by' => $request->user()?->id,
                    ]);
                }
            }

            $this->createVersion($service->id, $locale, 'draft', 'sync', $request->user()?->id);

            if ((bool) ($request->validated('publish', false))) {
                $this->publishDraft($service->id, $locale, $request->user()?->id, 'publish');
            }
        });

        $afterDraft = $this->snapshot($service->id, $locale, 'draft');
        $this->auditLogService->log(
            'service_page_sections.synced',
            'service',
            $service->id,
            $request->user(),
            $service->id,
            $beforeDraft,
            $afterDraft,
            null,
            $request
        );

        return $this->success([
            'service' => [
                'id' => $service->id,
                'name' => $service->name,
                'slug' => $service->slug,
            ],
            'locale' => $locale,
            'draft' => $afterDraft,
            'published' => $this->snapshot($service->id, $locale, 'published'),
        ], 'Service page sections synchronized.');
    }

    public function publish(Request $request, Service $service)
    {
        $validated = $request->validate([
            'locale' => ['nullable', 'string', 'max:16', 'regex:/^[a-z]{2}(-[A-Z]{2})?$/'],
        ]);
        $locale = (string) ($validated['locale'] ?? $request->query('locale', 'en'));
        $beforePublished = $this->snapshot($service->id, $locale, 'published');

        DB::transaction(function () use ($request, $service, $locale) {
            $this->publishDraft($service->id, $locale, $request->user()?->id, 'publish');
        });

        $afterPublished = $this->snapshot($service->id, $locale, 'published');
        $this->auditLogService->log(
            'service_page_sections.published',
            'service',
            $service->id,
            $request->user(),
            $service->id,
            $beforePublished,
            $afterPublished,
            null,
            $request
        );

        return $this->success([
            'service' => [
                'id' => $service->id,
                'name' => $service->name,
                'slug' => $service->slug,
            ],
            'locale' => $locale,
            'published' => $afterPublished,
        ], 'Service page sections published.');
    }

    public function history(Service $service, Request $request)
    {
        $validated = $request->validate([
            'locale' => ['nullable', 'string', 'max:16', 'regex:/^[a-z]{2}(-[A-Z]{2})?$/'],
        ]);
        $locale = (string) ($validated['locale'] ?? 'en');
        $history = ServicePageContentVersion::query()
            ->where('service_id', $service->id)
            ->where('locale', $locale)
            ->orderByDesc('id')
            ->limit(50)
            ->get();

        return $this->success([
            'service' => [
                'id' => $service->id,
                'name' => $service->name,
                'slug' => $service->slug,
            ],
            'locale' => $locale,
            'items' => $history,
        ], 'Service page section history fetched.');
    }

    public function rollback(RollbackServicePageSectionsRequest $request, Service $service)
    {
        $validated = $request->validated();
        $locale = $validated['locale'] ?? 'en';
        $version = ServicePageContentVersion::query()
            ->where('service_id', $service->id)
            ->where('locale', $locale)
            ->findOrFail((int) $validated['version_id']);

        DB::transaction(function () use ($request, $service, $locale, $version, $validated) {
            ServicePageContent::query()
                ->where('service_id', $service->id)
                ->where('locale', $locale)
                ->where('status', 'draft')
                ->delete();

            $sectionIndex = 0;
            foreach (($version->snapshot['sections'] ?? []) as $section) {
                $items = $section['items'] ?? [];
                foreach ($items as $itemIndex => $item) {
                    ServicePageContent::query()->create([
                        'service_id' => $service->id,
                        'section_key' => $section['section_key'],
                        'content_key' => $section['section_key'].'_item_'.$itemIndex,
                        'label' => $section['heading'] ?? $section['section_key'],
                        'subheading' => $section['subheading'] ?? null,
                        'content_type' => 'json',
                        'value' => $item,
                        'locale' => $locale,
                        'status' => 'draft',
                        'is_active' => (bool) ($section['is_active'] ?? true),
                        'display_order' => ($sectionIndex * 100) + $itemIndex,
                        'updated_by' => $request->user()?->id,
                    ]);
                }
                $sectionIndex++;
            }

            $this->createVersion($service->id, $locale, 'draft', 'rollback', $request->user()?->id);

            if ((bool) ($validated['publish'] ?? false)) {
                $this->publishDraft($service->id, $locale, $request->user()?->id, 'rollback_publish');
            }
        });

        return $this->success([
            'service' => [
                'id' => $service->id,
                'name' => $service->name,
                'slug' => $service->slug,
            ],
            'locale' => $locale,
            'draft' => $this->snapshot($service->id, $locale, 'draft'),
            'published' => $this->snapshot($service->id, $locale, 'published'),
        ], 'Service page sections rolled back successfully.');
    }

    private function publishDraft(int $serviceId, string $locale, ?int $userId, string $changeType): void
    {
        $draftRows = ServicePageContent::query()
            ->where('service_id', $serviceId)
            ->where('locale', $locale)
            ->where('status', 'draft')
            ->orderBy('display_order')
            ->orderBy('id')
            ->get();

        ServicePageContent::query()
            ->where('service_id', $serviceId)
            ->where('locale', $locale)
            ->where('status', 'published')
            ->delete();

        foreach ($draftRows as $row) {
            ServicePageContent::query()->create([
                'service_id' => $serviceId,
                'section_key' => $row->section_key,
                'content_key' => $row->content_key,
                'label' => $row->label,
                'subheading' => $row->subheading,
                'content_type' => $row->content_type,
                'value' => $row->value,
                'locale' => $locale,
                'status' => 'published',
                'is_active' => $row->is_active,
                'display_order' => $row->display_order,
                'updated_by' => $userId,
            ]);
        }

        $this->createVersion($serviceId, $locale, 'published', $changeType, $userId);
    }

    private function createVersion(int $serviceId, string $locale, string $stage, string $changeType, ?int $userId): void
    {
        $nextVersion = (int) ServicePageContentVersion::query()
            ->where('service_id', $serviceId)
            ->where('locale', $locale)
            ->where('stage', $stage)
            ->max('version_number') + 1;

        ServicePageContentVersion::query()->create([
            'service_id' => $serviceId,
            'locale' => $locale,
            'version_number' => $nextVersion,
            'stage' => $stage,
            'change_type' => $changeType,
            'snapshot' => $this->snapshot($serviceId, $locale, $stage),
            'created_by' => $userId,
        ]);
    }

    private function snapshot(int $serviceId, string $locale, string $stage): array
    {
        $rows = ServicePageContent::query()
            ->where('service_id', $serviceId)
            ->where('locale', $locale)
            ->where('status', $stage)
            ->orderBy('section_key')
            ->orderBy('display_order')
            ->orderBy('id')
            ->get();

        return [
            'sections' => $this->groupSections($rows),
        ];
    }

    private function groupSections($rows): array
    {
        $grouped = [];
        foreach ($rows as $row) {
            $key = $row->section_key;
            if (! array_key_exists($key, $grouped)) {
                $grouped[$key] = [
                    'section_key' => $row->section_key,
                    'heading' => $row->label,
                    'subheading' => $row->subheading,
                    'is_active' => (bool) $row->is_active,
                    'items' => [],
                ];
            }
            if ($row->value !== [] && $row->value !== null) {
                $grouped[$key]['items'][] = $row->value;
            }
        }

        return array_values($grouped);
    }
}
