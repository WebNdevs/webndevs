<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSolutionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'industry_id' => ['nullable', 'integer', 'exists:industries,id'],
            'business_size_id' => ['nullable', 'integer', 'exists:business_sizes,id'],
            'name' => ['required', 'string', 'max:300'],
            'slug' => ['required', 'string', 'max:300', 'unique:solutions,slug'],
            'tagline' => ['nullable', 'string', 'max:500'],
            'problem_statement' => ['nullable', 'string'],
            'solution_summary' => ['nullable', 'string'],
            'workflow_description' => ['nullable', 'string'],
            'key_benefits' => ['nullable', 'array'],
            'technical_requirements' => ['nullable', 'string'],
            'status' => ['nullable', 'in:draft,published'],
            'tool_ids' => ['nullable', 'array'],
            'tool_ids.*' => ['integer', 'distinct', 'exists:tools,id'],
        ];
    }
}
