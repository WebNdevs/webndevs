<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCaseStudyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $caseStudy = $this->route('caseStudy') ?? $this->route('case_study');

        $caseStudyId = is_object($caseStudy)
            ? $caseStudy->id
            : $caseStudy;

        return [
            'title' => ['sometimes', 'string', 'max:500'],
            'slug' => [
                'sometimes',
                'string',
                'max:300',
                Rule::unique('case_studies', 'slug')->ignore($caseStudyId),
            ],
            'client_name' => ['sometimes', 'string', 'max:200'],
            'client_industry' => ['nullable', 'string', 'max:200'],
            'client_logo_url' => ['nullable', 'url', 'max:500'],
            'challenge' => ['sometimes', 'string'],
            'solution' => ['sometimes', 'string'],
            'results_summary' => ['sometimes', 'string'],
            'timeline' => ['nullable', 'string', 'max:100'],
            'featured_image_url' => ['nullable', 'url', 'max:500'],
            'is_featured' => ['nullable', 'boolean'],
            'status' => ['nullable', 'in:draft,published'],
            'published_at' => ['nullable', 'date'],
        ];
    }
}
