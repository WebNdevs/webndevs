<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SyncServiceTemplatesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'fields' => ['required', 'array'],
            'fields.*.field_key' => ['required', 'string', 'max:80', 'regex:/^[a-z0-9_.-]+$/'],
            'fields.*.label' => ['required', 'string', 'max:255'],
            'fields.*.field_type' => ['required', 'in:text,long_text,number,boolean,image,json'],
            'fields.*.is_required' => ['sometimes', 'boolean'],
            'fields.*.default_value' => ['nullable'],
            'fields.*.options' => ['nullable', 'array'],
            'fields.*.display_order' => ['sometimes', 'integer', 'min:0'],
            'values' => ['nullable', 'array'],
            'values.*.field_key' => ['required_with:values', 'string', 'max:80'],
            'values.*.service_plan_id' => ['nullable', 'integer', 'min:1'],
            'values.*.value' => ['nullable'],
        ];
    }
}
