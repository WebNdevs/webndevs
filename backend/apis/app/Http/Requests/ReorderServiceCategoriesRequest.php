<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReorderServiceCategoriesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'items' => ['required', 'array', 'min:1'],
            'items.*.id' => ['required', 'integer', 'exists:service_categories,id'],
            'items.*.parent_id' => ['nullable', 'integer', 'exists:service_categories,id'],
            'items.*.display_order' => ['required', 'integer', 'min:0'],
        ];
    }
}
