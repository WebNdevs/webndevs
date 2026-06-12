<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\BulkServicePlanActionRequest;
use App\Http\Requests\SyncServicePlansRequest;
use App\Models\Service;
use App\Models\ServicePlan;
use App\Services\AuditLogService;
use App\Services\ServicePlanSyncService;
use Illuminate\Http\Request;

class ServicePlanController extends Controller
{
    public function __construct(
        private readonly ServicePlanSyncService $planSyncService,
        private readonly AuditLogService $auditLogService
    ) {}

    public function index(Service $service)
    {
        return $this->success($this->planSyncService->snapshot($service), 'Service plans fetched.');
    }

    public function sync(SyncServicePlansRequest $request, Service $service)
    {
        $before = $this->planSyncService->snapshot($service);
        try {
            $result = $this->planSyncService->sync(
                $service,
                $request->validated('plans', []),
                $request->validated('sync_token'),
                $request->user(),
                $request->validated('relations', [])
            );
        } catch (\RuntimeException $exception) {
            $status = $exception->getCode() === 409 ? 409 : 400;

            return $this->error($exception->getMessage(), [], $status);
        }

        $this->auditLogService->log(
            'service_plan.synced',
            'service',
            $service->id,
            $request->user(),
            $service->id,
            $before,
            $result,
            null,
            $request
        );

        return $this->success($result, 'Service plans synchronized.');
    }

    public function bulk(BulkServicePlanActionRequest $request, Service $service)
    {
        $validated = $request->validated();
        $planKeys = $validated['plan_keys'];

        $query = ServicePlan::query()
            ->where('service_id', $service->id)
            ->whereIn('plan_key', $planKeys);

        if ($validated['action'] === 'delete') {
            $count = $query->count();
            $query->delete();

            return $this->success(['affected' => $count], 'Plans deleted.');
        }

        $isActive = $validated['action'] === 'activate';
        $count = $query->update(['is_active' => $isActive]);

        return $this->success(['affected' => $count], 'Plans updated.');
    }

    public function compare(Request $request, Service $service)
    {
        $planKeys = collect(explode(',', (string) $request->query('plan_keys', '')))
            ->map(fn (string $key) => trim($key))
            ->filter()
            ->take(5)
            ->values();

        $plans = ServicePlan::query()
            ->where('service_id', $service->id)
            ->when($planKeys->isNotEmpty(), fn ($query) => $query->whereIn('plan_key', $planKeys->all()))
            ->orderBy('display_order')
            ->orderBy('id')
            ->get();

        return $this->success([
            'service' => [
                'id' => $service->id,
                'name' => $service->name,
                'slug' => $service->slug,
            ],
            'plans' => $plans,
            'comparison' => $plans->map(fn (ServicePlan $plan) => [
                'plan_key' => $plan->plan_key,
                'name' => $plan->name,
                'price' => $plan->price,
                'billing_cycle' => $plan->billing_cycle,
                'delivery_days' => $plan->delivery_days,
                'max_duration_days' => $plan->max_duration_days,
                'max_revisions' => $plan->max_revisions,
                'features' => $plan->features ?? [],
                'comparison_points' => $plan->comparison_points ?? [],
            ]),
        ], 'Service plans compared.');
    }
}
