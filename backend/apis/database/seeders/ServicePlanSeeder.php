<?php

namespace Database\Seeders;

use App\Models\Service;
use App\Models\ServicePlan;
use App\Models\User;
use Illuminate\Database\Seeder;

class ServicePlanSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::query()->where('email', 'admin@wnd.local')->first();
        $services = Service::query()->get();

        foreach ($services as $service) {
            $planMap = [
                [
                    'plan_key' => 'starter',
                    'name' => 'Starter',
                    'price' => (float) $service->base_price,
                    'billing_cycle' => 'one_time',
                    'delivery_days' => 7,
                    'description' => "Essentials package for {$service->name}.",
                    'features' => array_slice($service->features ?? [], 0, 2),
                    'is_featured' => false,
                    'is_active' => true,
                    'display_order' => 0,
                ],
                [
                    'plan_key' => 'growth',
                    'name' => 'Growth',
                    'price' => (float) $service->base_price * 1.75,
                    'billing_cycle' => 'one_time',
                    'delivery_days' => 14,
                    'description' => "Balanced delivery and scale for {$service->name}.",
                    'features' => array_slice($service->features ?? [], 0, 4),
                    'is_featured' => true,
                    'is_active' => true,
                    'display_order' => 1,
                ],
                [
                    'plan_key' => 'scale',
                    'name' => 'Scale',
                    'price' => (float) $service->base_price * 2.4,
                    'billing_cycle' => 'one_time',
                    'delivery_days' => 21,
                    'description' => "Advanced package for complex {$service->name} needs.",
                    'features' => $service->features ?? [],
                    'is_featured' => false,
                    'is_active' => true,
                    'display_order' => 2,
                ],
            ];

            foreach ($planMap as $plan) {
                ServicePlan::query()->updateOrCreate(
                    [
                        'service_id' => $service->id,
                        'plan_key' => $plan['plan_key'],
                    ],
                    [
                        ...$plan,
                        'sync_version' => 1,
                        'updated_by' => $admin?->id,
                    ]
                );
            }
        }
    }
}
