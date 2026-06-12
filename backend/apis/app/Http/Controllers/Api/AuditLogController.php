<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        $query = AuditLog::query()->with(['user:id,name,email', 'service:id,name,slug']);

        if ($action = trim((string) $request->query('action', ''))) {
            $query->where('action', 'like', "%{$action}%");
        }
        if ($entityType = trim((string) $request->query('entity_type', ''))) {
            $query->where('entity_type', $entityType);
        }
        if ($request->query('service_id') !== null) {
            $query->where('service_id', $request->query('service_id'));
        }
        if ($request->query('user_id') !== null) {
            $query->where('user_id', $request->query('user_id'));
        }

        $logs = $query
            ->orderByDesc('id')
            ->paginate(min(max((int) $request->query('per_page', 20), 1), 20));

        return $this->success($logs, 'Audit logs fetched.');
    }
}
