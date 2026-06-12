<?php

namespace App\Services;

use App\Models\Service;
use App\Models\ServicePackageRelation;
use App\Models\ServicePlan;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class ServicePlanSyncService
{
    public function snapshot(Service $service): array
    {
        $service->loadMissing(['plans', 'packageRelations']);

        $plans = $service->plans
            ->sortBy(fn (ServicePlan $plan) => [$plan->display_order, $plan->id])
            ->values();

        $syncToken = $plans->max('updated_at')?->toISOString() ?? $service->updated_at?->toISOString() ?? now()->toISOString();

        return [
            'service' => [
                'id' => $service->id,
                'name' => $service->name,
                'slug' => $service->slug,
            ],
            'sync_token' => $syncToken,
            'plans' => $plans,
            'relations' => $service->packageRelations
                ->map(fn (ServicePackageRelation $relation) => [
                    'id' => $relation->id,
                    'from_plan_id' => $relation->from_plan_id,
                    'to_plan_id' => $relation->to_plan_id,
                    'relation_type' => $relation->relation_type,
                ])
                ->values(),
        ];
    }

    public function sync(Service $service, array $plans, ?string $syncToken, ?User $actor, array $relations = []): array
    {
        return DB::transaction(function () use ($service, $plans, $syncToken, $actor, $relations) {
            $service->loadMissing('plans');

            $currentToken = $service->plans->max('updated_at')?->toISOString();
            if ($syncToken && $currentToken && $syncToken !== $currentToken) {
                throw new \RuntimeException('Plans were updated by another user. Refresh and retry.', 409);
            }

            $keys = [];
            foreach ($plans as $index => $planInput) {
                $planKey = $planInput['plan_key'];
                $keys[] = $planKey;

                $existing = $service->plans->firstWhere('plan_key', $planKey);

                ServicePlan::query()->updateOrCreate(
                    [
                        'service_id' => $service->id,
                        'plan_key' => $planKey,
                    ],
                    [
                        'name' => $planInput['name'],
                        'price' => $planInput['price'],
                        'billing_cycle' => $planInput['billing_cycle'],
                        'delivery_days' => $planInput['delivery_days'] ?? null,
                        'max_duration_days' => $planInput['max_duration_days'] ?? null,
                        'description' => $planInput['description'] ?? null,
                        'features' => $planInput['features'] ?? [],
                        'custom_config' => $planInput['custom_config'] ?? null,
                        'max_revisions' => $planInput['max_revisions'] ?? null,
                        'comparison_points' => $planInput['comparison_points'] ?? null,
                        'parent_plan_id' => null,
                        'is_featured' => (bool) ($planInput['is_featured'] ?? false),
                        'is_active' => (bool) ($planInput['is_active'] ?? true),
                        'display_order' => $planInput['display_order'] ?? $index,
                        'sync_version' => ($existing?->sync_version ?? 0) + 1,
                        'updated_by' => $actor?->id,
                    ]
                );
            }

            $planIdByKey = ServicePlan::query()
                ->where('service_id', $service->id)
                ->pluck('id', 'plan_key')
                ->all();

            foreach ($plans as $planInput) {
                $planKey = $planInput['plan_key'];
                $planId = $planIdByKey[$planKey] ?? null;
                if (! $planId) {
                    continue;
                }

                $parentPlanId = null;
                if (! empty($planInput['parent_plan_key'])) {
                    $parentPlanId = $planIdByKey[$planInput['parent_plan_key']] ?? null;
                } elseif (! empty($planInput['parent_plan_id'])) {
                    $candidate = (int) $planInput['parent_plan_id'];
                    if (in_array($candidate, array_values($planIdByKey), true)) {
                        $parentPlanId = $candidate;
                    }
                }

                if ($parentPlanId === $planId) {
                    $parentPlanId = null;
                }

                ServicePlan::query()
                    ->where('id', $planId)
                    ->update(['parent_plan_id' => $parentPlanId]);
            }

            if (count($keys) > 0) {
                ServicePlan::query()
                    ->where('service_id', $service->id)
                    ->whereNotIn('plan_key', $keys)
                    ->delete();
            }

            $servicePlanIds = ServicePlan::query()
                ->where('service_id', $service->id)
                ->pluck('id')
                ->all();

            ServicePackageRelation::query()->where('service_id', $service->id)->delete();

            $allowedTypes = ['upgrade', 'downgrade', 'alternative'];
            $allowedPlanIds = array_flip($servicePlanIds);
            $allowedPlanIdsByKey = ServicePlan::query()
                ->where('service_id', $service->id)
                ->pluck('id', 'plan_key')
                ->all();
            foreach ($relations as $relation) {
                $type = $relation['relation_type'] ?? null;
                $fromPlanId = (int) ($relation['from_plan_id'] ?? 0);
                $toPlanId = (int) ($relation['to_plan_id'] ?? 0);
                if ($fromPlanId <= 0 && ! empty($relation['from_plan_key'])) {
                    $fromPlanId = (int) ($allowedPlanIdsByKey[$relation['from_plan_key']] ?? 0);
                }
                if ($toPlanId <= 0 && ! empty($relation['to_plan_key'])) {
                    $toPlanId = (int) ($allowedPlanIdsByKey[$relation['to_plan_key']] ?? 0);
                }
                if (! in_array($type, $allowedTypes, true)) {
                    continue;
                }
                if (! isset($allowedPlanIds[$fromPlanId]) || ! isset($allowedPlanIds[$toPlanId])) {
                    continue;
                }
                if ($fromPlanId === $toPlanId) {
                    continue;
                }
                ServicePackageRelation::query()->create([
                    'service_id' => $service->id,
                    'from_plan_id' => $fromPlanId,
                    'to_plan_id' => $toPlanId,
                    'relation_type' => $type,
                ]);
            }

            $service->unsetRelation('plans');
            $service->unsetRelation('packageRelations');

            return $this->snapshot($service);
        });
    }
}
