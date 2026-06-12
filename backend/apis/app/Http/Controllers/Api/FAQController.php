<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FAQ;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FAQController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = FAQ::query();

        if ($request->filled('entity_type')) {
            $query->where('entity_type', $request->string('entity_type'));
        }

        if ($request->filled('entity_id')) {
            $query->where('entity_id', $request->integer('entity_id'));
        }

        if (! $request->boolean('include_inactive')) {
            $query->where('is_active', true);
        }

        return response()->json($query->orderBy('sort_order')->paginate($request->integer('per_page', 20)));
    }

    public function show(FAQ $faq): JsonResponse
    {
        return response()->json($faq);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'entity_type' => ['required', 'string', 'max:100'],
            'entity_id' => ['required', 'integer', 'min:1'],
            'question' => ['required', 'string', 'max:1000'],
            'answer' => ['required', 'string'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
            'ai_generated' => ['nullable', 'boolean'],
        ]);

        return response()->json(FAQ::create($data), 201);
    }

    public function update(Request $request, FAQ $faq): JsonResponse
    {
        $data = $request->validate([
            'question' => ['sometimes', 'string', 'max:1000'],
            'answer' => ['sometimes', 'string'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
            'ai_generated' => ['nullable', 'boolean'],
        ]);

        $faq->update($data);

        return response()->json($faq);
    }

    public function destroy(FAQ $faq): JsonResponse
    {
        $faq->delete();

        return response()->json(['message' => 'Deleted']);
    }

    public function reorder(Request $request): JsonResponse
    {
        $data = $request->validate([
            'items' => ['required', 'array'],
            'items.*.id' => ['required', 'integer', 'exists:faqs,id'],
            'items.*.sort_order' => ['required', 'integer', 'min:0'],
        ]);

        foreach ($data['items'] as $item) {
            FAQ::whereKey($item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        return response()->json(['message' => 'Reordered']);
    }
}
