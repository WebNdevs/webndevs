<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SyncServiceTemplatesRequest;
use App\Models\Service;
use App\Services\AuditLogService;
use App\Services\ServiceTemplateSyncService;

class ServiceTemplateController extends Controller
{
    public function __construct(
        private readonly ServiceTemplateSyncService $templateSyncService,
        private readonly AuditLogService $auditLogService
    ) {}

    public function index(Service $service)
    {
        return $this->success($this->templateSyncService->snapshot($service), 'Service template fields fetched.');
    }

    public function sync(SyncServiceTemplatesRequest $request, Service $service)
    {
        $before = $this->templateSyncService->snapshot($service);
        $result = $this->templateSyncService->sync(
            $service,
            $request->validated('fields', []),
            $request->validated('values', []),
            $request->user()
        );

        $this->auditLogService->log(
            'service_template.synced',
            'service',
            $service->id,
            $request->user(),
            $service->id,
            $before,
            $result,
            null,
            $request
        );

        return $this->success($result, 'Service templates synchronized.');
    }
}
