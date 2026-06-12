<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\BulkPackageOfferActionRequest;
use App\Http\Requests\SyncPackageOffersRequest;
use App\Models\PackageOffer;
use App\Models\Service;
use App\Services\AuditLogService;
use Illuminate\Support\Facades\DB;

class PackageOfferController extends Controller
{
    public function __construct(private readonly AuditLogService $auditLogService) {}

    public function index(Service $service)
    {
        $offers = PackageOffer::query()
            ->where('service_id', $service->id)
            ->orderBy('display_order')
            ->orderBy('id')
            ->get();

        return $this->success([
            'service' => [
                'id' => $service->id,
                'name' => $service->name,
                'slug' => $service->slug,
            ],
            'offers' => $offers,
        ], 'Package offers fetched.');
    }

    public function sync(SyncPackageOffersRequest $request, Service $service)
    {
        $offers = $request->validated('offers', []);
        $before = PackageOffer::query()
            ->where('service_id', $service->id)
            ->orderBy('display_order')
            ->get()
            ->toArray();

        DB::transaction(function () use ($service, $offers, $request) {
            $offerKeys = [];
            foreach ($offers as $index => $offer) {
                $offerKeys[] = $offer['offer_key'];
                $row = [
                    'plan_key' => $offer['plan_key'] ?? null,
                    'name' => $offer['name'],
                    'description' => $offer['description'] ?? null,
                    'offer_type' => $offer['offer_type'],
                    'discount_value' => $offer['discount_value'] ?? null,
                    'combo_plan_keys' => $offer['combo_plan_keys'] ?? null,
                    'combo_price' => $offer['combo_price'] ?? null,
                    'conditions' => $offer['conditions'] ?? null,
                    'starts_at' => $offer['starts_at'] ?? null,
                    'ends_at' => $offer['ends_at'] ?? null,
                    'is_active' => (bool) ($offer['is_active'] ?? true),
                    'display_order' => $offer['display_order'] ?? $index,
                    'updated_by' => $request->user()?->id,
                ];

                PackageOffer::query()->updateOrCreate(
                    [
                        'service_id' => $service->id,
                        'offer_key' => $offer['offer_key'],
                    ],
                    [
                        ...$row,
                        'created_by' => $request->user()?->id,
                    ]
                );
            }

            if ($offerKeys !== []) {
                PackageOffer::query()
                    ->where('service_id', $service->id)
                    ->whereNotIn('offer_key', $offerKeys)
                    ->delete();
            } else {
                PackageOffer::query()
                    ->where('service_id', $service->id)
                    ->delete();
            }
        });

        $after = PackageOffer::query()
            ->where('service_id', $service->id)
            ->orderBy('display_order')
            ->orderBy('id')
            ->get();

        $this->auditLogService->log(
            'package_offer.synced',
            'service',
            $service->id,
            $request->user(),
            $service->id,
            $before,
            $after->toArray(),
            null,
            $request
        );

        return $this->success([
            'service' => [
                'id' => $service->id,
                'name' => $service->name,
                'slug' => $service->slug,
            ],
            'offers' => $after,
        ], 'Package offers synchronized.');
    }

    public function bulk(BulkPackageOfferActionRequest $request, Service $service)
    {
        $validated = $request->validated();
        $query = PackageOffer::query()
            ->where('service_id', $service->id)
            ->whereIn('offer_key', $validated['offer_keys']);

        if ($validated['action'] === 'delete') {
            $count = $query->count();
            $query->delete();

            return $this->success(['affected' => $count], 'Package offers deleted.');
        }

        $isActive = $validated['action'] === 'activate';
        $count = $query->update(['is_active' => $isActive, 'updated_by' => $request->user()?->id]);

        return $this->success(['affected' => $count], 'Package offers updated.');
    }
}
