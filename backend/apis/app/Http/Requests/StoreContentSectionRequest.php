<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreContentSectionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'section_key' => ['required', 'string', 'max:80', 'regex:/^[a-z0-9-]+$/'],
            'section_type' => ['required', 'string', 'max:80'],
            'is_visible' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
            'data' => ['nullable', 'array'],
        ];
    }
}
