<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Testimonial::query();

        if ($request->filled('entity_type')) {
            $query->where('entity_type', $request->string('entity_type')->toString());
        }

        if ($request->filled('entity_id')) {
            $query->where('entity_id', $request->integer('entity_id'));
        }

        if (! $request->boolean('include_inactive')) {
            $query->where('is_active', true);
        }

        $perPage = min(max($request->integer('per_page', 20), 1), 50);

        $testimonials = $query
            ->orderBy('sort_order')
            ->orderBy('id')
            ->paginate($perPage);

        return $this->success($testimonials, 'Testimonials fetched successfully.');
    }

    public function show(Testimonial $testimonial): JsonResponse
    {
        return $this->success($testimonial, 'Testimonial fetched successfully.');
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'entity_type' => ['required', 'string', 'max:100'],
            'entity_id' => ['required', 'integer', 'min:1'],
            'author_name' => ['required', 'string', 'max:200'],
            'author_title' => ['nullable', 'string', 'max:200'],
            'company' => ['nullable', 'string', 'max:200'],
            'content' => ['required', 'string'],
            'rating' => ['nullable', 'integer', 'min:1', 'max:5'],
            'photo_url' => ['nullable', 'url', 'max:500'],
            'is_featured' => ['nullable', 'boolean'],
            'is_active' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        return $this->success(Testimonial::create($data), 'Testimonial created.', 201);
    }

    public function update(Request $request, Testimonial $testimonial): JsonResponse
    {
        $data = $request->validate([
            'author_name' => ['sometimes', 'string', 'max:200'],
            'author_title' => ['nullable', 'string', 'max:200'],
            'company' => ['nullable', 'string', 'max:200'],
            'content' => ['sometimes', 'string'],
            'rating' => ['nullable', 'integer', 'min:1', 'max:5'],
            'photo_url' => ['nullable', 'url', 'max:500'],
            'is_featured' => ['nullable', 'boolean'],
            'is_active' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        $testimonial->update($data);

        return $this->success($testimonial->fresh(), 'Testimonial updated.');
    }

    public function destroy(Testimonial $testimonial): JsonResponse
    {
        $testimonial->delete();

        return $this->success(null, 'Deleted');
    }
}
