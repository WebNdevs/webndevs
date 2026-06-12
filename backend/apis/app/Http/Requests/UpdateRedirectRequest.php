<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRedirectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $redirect = $this->route('redirect');

        return [
            'from_url'      => ['sometimes', 'string', 'max:1000', Rule::unique('redirects', 'from_url')->ignore($redirect?->id)],
            'to_url'        => ['sometimes', 'string', 'max:1000'],
            'redirect_type' => ['nullable', Rule::in([301, 302])],
            'is_active'     => ['nullable', 'boolean'],
        ];
    }
}
