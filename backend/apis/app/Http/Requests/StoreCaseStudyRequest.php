<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCaseStudyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:500'],
            'slug' => ['required', 'string', 'max:300', 'unique:case_studies,slug'],
            'client_name' => ['required', 'string', 'max:200'],
            'client_industry' => ['nullable', 'string', 'max:200'],
            'client_logo_url' => ['nullable', 'url', 'max:500'],
            'challenge' => ['required', 'string'],
            'solution' => ['required', 'string'],
            'results_summary' => ['required', 'string'],
            'timeline' => ['nullable', 'string', 'max:100'],
            'featured_image_url' => ['nullable', 'url', 'max:500'],
            'is_featured' => ['nullable', 'boolean'],
            'status' => ['nullable', 'in:draft,published'],
            'published_at' => ['nullable', 'date'],
            'metrics' => ['nullable', 'array'],
            'metrics.*.label' => ['required_with:metrics', 'string', 'max:200'],
            'metrics.*.before_value' => ['required_with:metrics', 'string', 'max:100'],
            'metrics.*.after_value' => ['required_with:metrics', 'string', 'max:100'],
            'metrics.*.unit' => ['nullable', 'string', 'max:50'],
            'metrics.*.improvement' => ['nullable', 'string', 'max:100'],
            'metrics.*.sort_order' => ['nullable', 'integer', 'min:0'],
            'entity_links' => ['nullable', 'array'],
            'entity_links.*.entity_type' => ['required_with:entity_links', 'string', 'max:100'],
            'entity_links.*.entity_id' => ['required_with:entity_links', 'integer', 'min:1'],
        ];
    }
}
