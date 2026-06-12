<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SyncServicePageContentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'items' => ['required', 'array'],
            'items.*.content_key' => ['required', 'string', 'max:120', 'regex:/^[a-z0-9_.-]+$/'],
            'items.*.label' => ['required', 'string', 'max:255'],
            'items.*.content_type' => ['required', 'in:text,rich_text,number,boolean,image,json,seo'],
            'items.*.value' => ['nullable'],
            'items.*.is_active' => ['nullable', 'boolean'],
            'items.*.display_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
