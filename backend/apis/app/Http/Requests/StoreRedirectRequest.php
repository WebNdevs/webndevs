<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreRedirectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'from_url'      => ['required', 'string', 'max:1000', 'unique:redirects,from_url'],
            'to_url'        => ['required', 'string', 'max:1000'],
            'redirect_type' => ['nullable', Rule::in([301, 302])],
            'is_active'     => ['nullable', 'boolean'],
        ];
    }
}
