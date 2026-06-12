<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AiGenerateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'entity_type' => ['required', 'string', 'max:100'],
            'entity_id' => ['required', 'integer', 'min:1'],
            'section_key' => ['required', 'string', 'max:100'],
            'prompt_template' => ['nullable', 'string', 'max:100'],
            'prompt' => ['nullable', 'string'],
            'force' => ['nullable', 'boolean'],
        ];
    }
}
