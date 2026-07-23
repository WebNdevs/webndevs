<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateServicePageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $servicePageId = $this->route('servicePage')?->id;

        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('service_pages', 'slug')->ignore($servicePageId)],
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
