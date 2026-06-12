<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCrossReferenceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'entity_a_type' => ['required', 'string', 'max:100'],
            'entity_a_id' => ['required', 'integer', 'min:1'],
            'entity_b_type' => ['required', 'string', 'max:100'],
            'entity_b_id' => ['required', 'integer', 'min:1'],
            'entity_c_type' => ['nullable', 'string', 'max:100'],
            'entity_c_id' => ['nullable', 'integer', 'min:1'],
            'slug' => ['nullable', 'string', 'max:500', 'unique:cross_reference_pages,slug'],
            'url_path' => ['nullable', 'string', 'max:500', 'unique:cross_reference_pages,url_path'],
            'title' => ['required', 'string', 'max:500'],
            'subtitle' => ['nullable', 'string', 'max:1000'],
            'quick_answer' => ['nullable', 'string'],
            'meta_title' => ['nullable', 'string', 'max:200'],
            'meta_description' => ['nullable', 'string', 'max:500'],
            'og_image_url' => ['nullable', 'url', 'max:500'],
            'status' => ['nullable', 'in:draft,published,archived'],
            'published_at' => ['nullable', 'date'],
            'sections' => ['nullable', 'array'],
            'sections.*.section_key' => ['required_with:sections', 'string', 'max:100'],
            'sections.*.title' => ['nullable', 'string', 'max:500'],
            'sections.*.content' => ['nullable', 'string'],
            'sections.*.data' => ['nullable', 'array'],
            'sections.*.sort_order' => ['nullable', 'integer', 'min:0'],
            'sections.*.is_visible' => ['nullable', 'boolean'],
        ];
    }
}
