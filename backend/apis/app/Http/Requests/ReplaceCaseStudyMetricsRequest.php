<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReplaceCaseStudyMetricsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'metrics'               => ['required', 'array'],
            'metrics.*.label'       => ['required', 'string', 'max:200'],
            'metrics.*.before_value'=> ['required', 'string', 'max:100'],
            'metrics.*.after_value' => ['required', 'string', 'max:100'],
            'metrics.*.unit'        => ['nullable', 'string', 'max:50'],
            'metrics.*.improvement' => ['nullable', 'string', 'max:100'],
            'metrics.*.sort_order'  => ['nullable', 'integer', 'min:0'],
        ];
    }
}
