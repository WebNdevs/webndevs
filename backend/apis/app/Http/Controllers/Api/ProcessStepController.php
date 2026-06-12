<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProcessStep;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProcessStepController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = ProcessStep::query();

        if ($request->filled('entity_type')) {
            $query->where('entity_type', $request->string('entity_type'));
        }

        if ($request->filled('entity_id')) {
            $query->where('entity_id', $request->integer('entity_id'));
        }

        return $this->success($query->orderBy('step_number')->paginate($request->integer('per_page', 20)), 'Process steps fetched.');
    }

    public function show(ProcessStep $processStep): JsonResponse
    {
        return $this->success($processStep, 'Process step fetched.');
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'entity_type' => ['required', 'string', 'max:100'],
            'entity_id' => ['required', 'integer', 'min:1'],
            'step_number' => ['required', 'integer', 'min:1'],
            'title' => ['required', 'string', 'max:300'],
            'description' => ['required', 'string'],
            'icon' => ['nullable', 'string', 'max:100'],
            'duration' => ['nullable', 'string', 'max:100'],
        ]);

        return $this->success(ProcessStep::create($data), 'Process step created.', 201);
    }

    public function update(Request $request, ProcessStep $processStep): JsonResponse
    {
        $data = $request->validate([
            'step_number' => ['nullable', 'integer', 'min:1'],
            'title' => ['sometimes', 'string', 'max:300'],
            'description' => ['sometimes', 'string'],
            'icon' => ['nullable', 'string', 'max:100'],
            'duration' => ['nullable', 'string', 'max:100'],
        ]);

        $processStep->update($data);

        return $this->success($processStep->fresh(), 'Process step updated.');
    }

    public function destroy(ProcessStep $processStep): JsonResponse
    {
        $processStep->delete();

        return $this->success(null, 'Deleted');
    }

    public function reorder(Request $request): JsonResponse
    {
        $data = $request->validate([
            'items' => ['required', 'array'],
            'items.*.id' => ['required', 'integer', 'exists:process_steps,id'],
            'items.*.step_number' => ['required', 'integer', 'min:1'],
        ]);

        foreach ($data['items'] as $item) {
            ProcessStep::whereKey($item['id'])->update(['step_number' => $item['step_number']]);
        }

        return $this->success(null, 'Reordered');
    }
}
