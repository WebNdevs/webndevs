<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateToolRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $toolId = $this->route('tool')?->id;

        return [
            'tool_category_id' => ['sometimes', 'required', 'integer', 'exists:tool_categories,id'],
            'name' => ['sometimes', 'required', 'string', 'max:200'],
            'slug' => ['sometimes', 'required', 'string', 'max:200', Rule::unique('tools', 'slug')->ignore($toolId)],
            'tagline' => ['nullable', 'string', 'max:500'],
            'logo_url' => ['nullable', 'url', 'max:500'],
            'website_url' => ['nullable', 'url', 'max:500'],
            'docs_url' => ['nullable', 'url', 'max:500'],
            'overview' => ['nullable', 'string'],
            'key_points' => ['nullable', 'array'],
            'key_points.*' => ['string', 'max:255'],
            'pricing_model' => ['nullable', 'string', 'max:100'],
            'is_featured' => ['nullable', 'boolean'],
            'is_active' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'status' => ['sometimes', 'required', 'in:draft,published,archived'],
            'published_at' => ['nullable', 'date'],
            'feature_ids' => ['nullable', 'array'],
            'feature_ids.*' => ['integer', 'distinct', 'exists:features,id'],
        ];
    }
}
