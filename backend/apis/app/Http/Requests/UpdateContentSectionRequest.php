<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateContentSectionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'section_key' => ['sometimes', 'required', 'string', 'max:80', 'regex:/^[a-z0-9-]+$/'],
            'section_type' => ['sometimes', 'required', 'string', 'max:80'],
            'name' => ['nullable', 'string', 'max:255'],
            'title' => ['nullable', 'string', 'max:255'],
            'content' => ['nullable', 'string'],
            'is_visible' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
            'fields' => ['nullable', 'array'],
            'data' => ['nullable', 'array'],
            'sync_token' => ['nullable', 'string', 'max:120'],
        ];
    }
}
