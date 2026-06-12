<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\Request;

class AuditLogService
{
    public function log(
        string $action,
        string $entityType,
        string|int|null $entityId,
        ?User $user = null,
        ?int $serviceId = null,
        ?array $beforeData = null,
        ?array $afterData = null,
        ?array $meta = null,
        ?Request $request = null
    ): void {
        AuditLog::query()->create([
            'user_id' => $user?->id,
            'service_id' => $serviceId,
            'action' => $action,
            'entity_type' => $entityType,
            'entity_id' => $entityId !== null ? (string) $entityId : null,
            'before_data' => $beforeData,
            'after_data' => $afterData,
            'meta' => $meta,
            'ip_address' => $request?->ip(),
            'user_agent' => $request?->userAgent(),
        ]);
    }
}
