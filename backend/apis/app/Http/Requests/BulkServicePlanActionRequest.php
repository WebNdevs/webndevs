<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BulkServicePlanActionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'action' => ['required', 'in:activate,deactivate,delete'],
            'plan_keys' => ['required', 'array', 'min:1'],
            'plan_keys.*' => ['required', 'string', 'max:50', 'regex:/^[a-z0-9-]+$/', 'distinct'],
        ];
    }
}
