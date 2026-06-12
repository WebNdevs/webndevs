<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BulkServiceCategoryActionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'action' => ['required', 'in:activate,deactivate,delete'],
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'distinct', 'exists:service_categories,id'],
        ];
    }
}
