<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BulkServiceActionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'action' => ['required', 'in:activate,deactivate,delete'],
            'slugs' => ['required', 'array', 'min:1'],
            'slugs.*' => ['required', 'string', 'max:255', 'distinct'],
        ];
    }
}
