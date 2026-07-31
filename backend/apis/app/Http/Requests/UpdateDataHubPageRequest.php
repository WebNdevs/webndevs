<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDataHubPageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $datahubPageId = $this->route('datahubPage')?->id;

        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('datahub_pages', 'slug')->ignore($datahubPageId)],
            'status' => ['sometimes', 'required', 'in:published,draft'],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'seo_description' => ['nullable', 'string'],
            'meta_keywords' => ['nullable', 'string', 'max:255'],
            'sections' => ['nullable', 'array'],
            'sections.*.section_key' => ['required_with:sections', 'string', 'max:80', 'regex:/^[a-z0-9-]+$/'],
            'sections.*.section_type' => ['required_with:sections', 'string', 'max:80'],
            'sections.*.is_visible' => ['sometimes', 'boolean'],
            'sections.*.sort_order' => ['sometimes', 'integer', 'min:0'],
            'sections.*.data' => ['nullable', 'array'],
        ];
    }
}
