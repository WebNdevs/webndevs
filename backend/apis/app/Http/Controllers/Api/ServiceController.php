<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\BulkServiceActionRequest;
use App\Http\Requests\StoreServiceRequest;
use App\Http\Requests\UpdateServiceRequest;
use App\Models\Service;
use App\Models\ServicePageContent;
use App\Services\AuditLogService;
use App\Services\ServicePlanSyncService;
use App\Services\SettingsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ServiceController extends Controller
{
    public function __construct(
        private readonly ServicePlanSyncService $planSyncService,
        private readonly AuditLogService $auditLogService
    ) {}

    public function index(Request $request)
    {
        $query = Service::query();

        if ($search = trim((string) $request->query('search', ''))) {
            $query->where(function ($inner) use ($search) {
                $inner->where('name', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%")
                    ->orWhere('category', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        if ($category = $request->query('category')) {
            $query->where('category', $category);
        }

        $sortBy = (string) $request->query('sort_by', 'name');
        $sortDirection = strtolower((string) $request->query('sort_dir', 'asc')) === 'desc' ? 'desc' : 'asc';
        $allowedSort = ['name', 'base_price', 'projects_completed', 'created_at', 'updated_at'];
        if (! in_array($sortBy, $allowedSort, true)) {
            $sortBy = 'name';
        }
        $query->orderBy($sortBy, $sortDirection);

        $include = collect(explode(',', (string) $request->query('include', '')))
            ->map(fn (string $item) => trim($item))
            ->filter()
            ->values()
            ->all();
        $allowedIncludes = ['plans', 'templateFields', 'templateValues', 'packageRelations', 'categories', 'pageContents', 'packageOffers', 'mediaAssets'];
        $load = collect($include)->filter(fn (string $item) => in_array($item, $allowedIncludes, true))->values()->all();
        if ($load !== []) {
            $query->with($load);
        }

        $perPage = min(max((int) $request->query('per_page', 20), 1), 20);
        $services = $query->paginate($perPage);

        return $this->success($services, 'Services fetched.');
    }

    public function store(StoreServiceRequest $request)
    {
        $validated = $request->validated();
        $pricingTable = $validated['pricing_table'] ?? [];
        $categoryIds = array_values(array_unique($validated['category_ids'] ?? []));
        $primaryCategoryId = $validated['primary_category_id'] ?? null;

        $service = DB::transaction(function () use ($validated, $pricingTable, $categoryIds, $primaryCategoryId, $request) {
            $service = Service::create([
                ...collect($validated)->except('pricing_table', 'category_ids', 'primary_category_id')->toArray(),
                'created_by' => $request->user()?->id,
                'booking_enabled' => $validated['booking_enabled'] ?? true,
            ]);

            if ($categoryIds !== []) {
                $service->categories()->sync(
                    collect($categoryIds)->mapWithKeys(fn (int $id) => [
                        $id => ['is_primary' => $primaryCategoryId === $id],
                    ])->all()
                );
            }

            if (count($pricingTable) > 0) {
                $this->planSyncService->sync($service, $this->normalizePricingTable($pricingTable), null, $request->user());
            }

            // Create default page sections for the new service
            $this->createDefaultPageSections($service, $request->user()?->id);

            return $service;
        });

        $this->auditLogService->log(
            'service.created',
            'service',
            $service->id,
            $request->user(),
            $service->id,
            null,
            $service->toArray(),
            ['category_ids' => $categoryIds],
            $request
        );

        // Dispatch webhook for service created
        \Illuminate\Support\Facades\Log::info('Webhook dispatch triggered: service.created', [
            'service_id' => $service->id,
            'service_name' => $service->name,
        ]);
        SettingsService::dispatchWebhook('service.created', [
            'service_id' => $service->id,
            'service_name' => $service->name,
            'service_slug' => $service->slug,
            'user_id' => $request->user()?->id,
        ]);

        return $this->success($service->fresh()->load(['plans', 'categories', 'pageContents']), 'Service created.', 201);
    }

    public function show(Service $service)
    {
        $service->load([
            'plans.parentPlan',
            'plans.childPlans',
            'templateFields',
            'templateValues.field',
            'packageRelations',
            'categories',
            'pageContents',
            'packageOffers',
            'mediaAssets',
        ]);

        return $this->success($service, 'Service fetched.');
    }

    public function update(UpdateServiceRequest $request, Service $service)
    {
        $before = $service->toArray();
        $validated = $request->validated();
        $pricingTable = $validated['pricing_table'] ?? null;
        $categoryIds = array_values(array_unique($validated['category_ids'] ?? []));
        $primaryCategoryId = $validated['primary_category_id'] ?? null;
        $payload = collect($validated)->except('pricing_table', 'category_ids', 'primary_category_id')->toArray();
        if (array_key_exists('booking_enabled', $validated)) {
            $payload['booking_enabled'] = (bool) $validated['booking_enabled'];
        }

        DB::transaction(function () use ($service, $payload, $pricingTable, $categoryIds, $primaryCategoryId, $request, $validated) {
            if ($payload !== []) {
                $service->update($payload);
            }

            if (array_key_exists('category_ids', $validated)) {
                $service->categories()->sync(
                    collect($categoryIds)->mapWithKeys(fn (int $id) => [
                        $id => ['is_primary' => $primaryCategoryId === $id],
                    ])->all()
                );
            }

            if (is_array($pricingTable)) {
                $this->planSyncService->sync($service, $this->normalizePricingTable($pricingTable), null, $request->user());
            }
        });

        $after = $service->fresh()->load(['plans', 'categories']);
        $this->auditLogService->log(
            'service.updated',
            'service',
            $service->id,
            $request->user(),
            $service->id,
            $before,
            $after->toArray(),
            null,
            $request
        );

        // Dispatch webhook for service updated
        SettingsService::dispatchWebhook('service.updated', [
            'service_id' => $service->id,
            'service_name' => $service->name,
            'service_slug' => $service->slug,
            'user_id' => $request->user()?->id,
        ]);

        return $this->success($after, 'Service updated.');
    }

    public function destroy(Service $service)
    {
        $serviceId = $service->id;
        $serviceName = $service->name;
        $serviceSlug = $service->slug;

        DB::transaction(function () use ($service) {
            // Delete related plans
            $service->plans()->delete();

            // Delete related page content (sections)
            $service->pageContents()->delete();

            // Delete related package offers
            $service->packageOffers()->delete();

            // Delete related template fields and values
            $service->templateFields()->delete();
            $service->templateValues()->delete();

            // Delete related media assets
            $service->mediaAssets()->delete();

            // Detach categories
            $service->categories()->detach();

            // Finally delete the service
            $service->delete();
        });

        // Dispatch webhook for service deleted
        SettingsService::dispatchWebhook('service.deleted', [
            'service_id' => $serviceId,
            'service_name' => $serviceName,
            'service_slug' => $serviceSlug,
        ]);

        return $this->success(null, 'Service deleted.');
    }

    public function bulk(BulkServiceActionRequest $request)
    {
        $validated = $request->validated();

        $query = Service::query()->whereIn('slug', $validated['slugs']);

        if ($validated['action'] === 'delete') {
            $count = $query->count();
            $query->delete();

            return $this->success(['affected' => $count], 'Services deleted.');
        }

        $status = $validated['action'] === 'activate' ? 'active' : 'inactive';
        $count = $query->update(['status' => $status]);

        return $this->success(['affected' => $count], 'Services updated.');
    }

    private function normalizePricingTable(array $pricingTable): array
    {
        return collect($pricingTable)->values()->map(function (array $plan, int $index) {
            return [
                'plan_key' => $plan['plan_key'],
                'name' => $plan['name'],
                'price' => $plan['price'],
                'billing_cycle' => $plan['billing_cycle'] ?? 'one_time',
                'delivery_days' => $plan['delivery_days'] ?? null,
                'max_duration_days' => $plan['max_duration_days'] ?? null,
                'description' => $plan['description'] ?? null,
                'features' => $plan['features'] ?? [],
                'custom_config' => $plan['custom_config'] ?? null,
                'max_revisions' => $plan['max_revisions'] ?? null,
                'comparison_points' => $plan['comparison_points'] ?? null,
                'parent_plan_id' => $plan['parent_plan_id'] ?? null,
                'parent_plan_key' => $plan['parent_plan_key'] ?? null,
                'is_featured' => (bool) ($plan['is_featured'] ?? $plan['is_popular'] ?? false),
                'is_active' => (bool) ($plan['is_active'] ?? true),
                'display_order' => $plan['display_order'] ?? $plan['sort_order'] ?? $index,
            ];
        })->toArray();
    }

    /**
     * Create default page sections for a new service
     */
    private function createDefaultPageSections(Service $service, ?int $userId): void
    {
        $locale = 'en';
        $defaultSections = [
            [
                'section_key' => 'hero',
                'heading' => $service->name,
                'subheading' => $service->category,
                'is_active' => true,
                'items' => [
                    [
                        'eyebrow' => 'Our Services',
                        'headline' => $service->name,
                        'subheadline' => $service->description ?? '',
                        'description' => 'Professional ' . strtolower($service->name) . ' services tailored to your needs.',
                        'cta_primary' => 'Get Started',
                        'cta_secondary' => 'Learn More',
                        'hero_image_url' => null,
                        'badge' => null,
                    ],
                ],
            ],
            [
                'section_key' => 'how_we_work',
                'heading' => 'How We Work',
                'subheading' => 'Our Process',
                'is_active' => true,
                'items' => [],
            ],
            [
                'section_key' => 'who_is_this_for',
                'heading' => 'Who Is This For?',
                'subheading' => 'Perfect For',
                'is_active' => true,
                'items' => [],
            ],
            [
                'section_key' => 'what_you_get',
                'heading' => 'What You Get',
                'subheading' => 'Included Features',
                'is_active' => true,
                'items' => [],
            ],
            [
                'section_key' => 'real_results_delivered',
                'heading' => 'Real Results We\'ve Delivered',
                'subheading' => 'Our Portfolio',
                'is_active' => true,
                'items' => [],
            ],
            [
                'section_key' => 'client_testimonials',
                'heading' => 'What Our Clients Say',
                'subheading' => 'Testimonials',
                'is_active' => true,
                'items' => [],
            ],
            [
                'section_key' => 'frequently_asked_questions',
                'heading' => 'Frequently Asked Questions',
                'subheading' => 'FAQ',
                'is_active' => true,
                'items' => [],
            ],
            [
                'section_key' => 'technologies_we_use',
                'heading' => 'Technologies We Use',
                'subheading' => 'Tools & Stack',
                'is_active' => true,
                'items' => [],
            ],
            [
                'section_key' => 'why_choose_our_service',
                'heading' => 'Why Choose Our Service?',
                'subheading' => 'Benefits',
                'is_active' => true,
                'items' => [],
            ],
        ];

        foreach ($defaultSections as $sectionIndex => $section) {
            $items = $section['items'] ?? [];
            foreach ($items as $itemIndex => $item) {
                ServicePageContent::query()->create([
                    'service_id' => $service->id,
                    'section_key' => $section['section_key'],
                    'content_key' => $section['section_key'] . '_item_' . $itemIndex,
                    'label' => $section['heading'],
                    'subheading' => $section['subheading'] ?? null,
                    'content_type' => 'json',
                    'value' => $item,
                    'locale' => $locale,
                    'status' => 'draft',
                    'is_active' => (bool) $section['is_active'],
                    'display_order' => ($sectionIndex * 100) + $itemIndex,
                    'updated_by' => $userId,
                ]);
            }

            if ($items === []) {
                ServicePageContent::query()->create([
                    'service_id' => $service->id,
                    'section_key' => $section['section_key'],
                    'content_key' => $section['section_key'] . '_item_0',
                    'label' => $section['heading'],
                    'subheading' => $section['subheading'] ?? null,
                    'content_type' => 'json',
                    'value' => [],
                    'locale' => $locale,
                    'status' => 'draft',
                    'is_active' => (bool) $section['is_active'],
                    'display_order' => $sectionIndex * 100,
                    'updated_by' => $userId,
                ]);
            }
        }
    }
}
