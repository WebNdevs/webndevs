<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpsertServiceCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $categoryId = $this->route('serviceCategory')?->id;

        return [
            'parent_id' => ['nullable', 'integer', 'exists:service_categories,id', Rule::notIn([$categoryId])],
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'regex:/^[a-z0-9-]+$/'],
            'description' => ['nullable', 'string'],
            'is_active' => ['nullable', 'boolean'],
            'template_key' => ['nullable', 'string', 'max:120'],
            'custom_fields' => ['nullable', 'array'],
            'conditional_rules' => ['nullable', 'array'],
            'display_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
