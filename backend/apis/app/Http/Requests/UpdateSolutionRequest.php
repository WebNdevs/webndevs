<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSolutionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $solution = $this->route('solution');

        return [
            'industry_id'           => ['nullable', 'integer', 'exists:industries,id'],
            'business_size_id'      => ['nullable', 'integer', 'exists:business_sizes,id'],
            'name'                  => ['sometimes', 'string', 'max:300'],
            'slug'                  => ['sometimes', 'string', 'max:300', Rule::unique('solutions', 'slug')->ignore($solution?->id)],
            'tagline'               => ['nullable', 'string', 'max:500'],
            'problem_statement'     => ['nullable', 'string'],
            'solution_summary'      => ['nullable', 'string'],
            'workflow_description'  => ['nullable', 'string'],
            'key_benefits'          => ['nullable', 'array'],
            'technical_requirements'=> ['nullable', 'string'],
            'status'                => ['nullable', 'in:draft,published'],
            'tool_ids'              => ['nullable', 'array'],
            'tool_ids.*'            => ['integer', 'distinct', 'exists:tools,id'],
        ];
    }
}
