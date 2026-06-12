<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RollbackServicePageSectionsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'locale' => ['nullable', 'string', 'max:16', 'regex:/^[a-z]{2}(-[A-Z]{2})?$/'],
            'version_id' => ['required', 'integer', 'exists:service_page_content_versions,id'],
            'publish' => ['nullable', 'boolean'],
        ];
    }
}
