<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreComparisonRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'slug' => ['required', 'string', 'max:300', 'unique:comparison_pages,slug'],
            'title' => ['required', 'string', 'max:500'],
            'subtitle' => ['nullable', 'string', 'max:1000'],
            'quick_verdict' => ['nullable', 'string'],
            'recommendation' => ['nullable', 'string'],
            'intro_content' => ['nullable', 'string'],
            'status' => ['nullable', 'in:draft,published'],
            'entities' => ['nullable', 'array', 'min:2', 'max:4'],
            'entities.*.entity_type' => ['required_with:entities', 'string', 'max:100'],
            'entities.*.entity_id' => ['required_with:entities', 'integer', 'min:1'],
            'entities.*.position' => ['nullable', 'integer', 'min:0'],
            'entities.*.tag' => ['nullable', 'string', 'max:100'],
            'features' => ['nullable', 'array'],
            'features.*.feature_name' => ['required_with:features', 'string', 'max:300'],
            'features.*.category' => ['nullable', 'string', 'max:100'],
            'features.*.values' => ['required_with:features', 'array'],
            'features.*.is_highlighted' => ['nullable', 'boolean'],
            'features.*.sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
