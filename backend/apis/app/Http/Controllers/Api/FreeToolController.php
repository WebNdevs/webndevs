<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FreeTool;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class FreeToolController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = FreeTool::query();
        if (! $request->boolean('include_inactive')) {
            $query->where('is_active', true);
        }

        return response()->json($query->orderBy('name')->paginate($request->integer('per_page', 20)));
    }

    public function show(FreeTool $freeTool): JsonResponse
    {
        return response()->json($freeTool);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:300'],
            'slug' => ['required', 'string', 'max:200', 'unique:free_tools,slug'],
            'type' => ['required', Rule::in(['calculator', 'quiz', 'audit', 'estimator'])],
            'description' => ['nullable', 'string'],
            'config' => ['required', 'array'],
            'is_active' => ['nullable', 'boolean'],
            'cta_text' => ['nullable', 'string', 'max:300'],
            'thank_you_message' => ['nullable', 'string'],
        ]);

        return response()->json(FreeTool::create($data), 201);
    }

    public function update(Request $request, FreeTool $freeTool): JsonResponse
    {
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:300'],
            'slug' => ['sometimes', 'string', 'max:200', Rule::unique('free_tools', 'slug')->ignore($freeTool->id)],
            'type' => ['nullable', Rule::in(['calculator', 'quiz', 'audit', 'estimator'])],
            'description' => ['nullable', 'string'],
            'config' => ['nullable', 'array'],
            'is_active' => ['nullable', 'boolean'],
            'cta_text' => ['nullable', 'string', 'max:300'],
            'thank_you_message' => ['nullable', 'string'],
        ]);

        $freeTool->update($data);

        return response()->json($freeTool);
    }

    public function destroy(FreeTool $freeTool): JsonResponse
    {
        $freeTool->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
