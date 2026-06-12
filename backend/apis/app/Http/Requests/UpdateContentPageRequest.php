<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateContentPageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $contentPageId = $this->route('contentPage')?->id;

        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('content_pages', 'slug')->ignore($contentPageId)],
            'status' => ['sometimes', 'required', 'in:published,draft'],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'seo_description' => ['nullable', 'string'],
            'meta_keywords' => ['nullable', 'string', 'max:255'],
            'sections' => ['nullable', 'array'],
            'sections.*.section_key' => ['required_with:sections', 'string', 'max:80', 'regex:/^[a-z0-9-]+$/'],
            'sections.*.section_type' => ['required_with:sections', 'string', 'max:80'],
            'sections.*.name' => ['nullable', 'string', 'max:255'],
            'sections.*.title' => ['required_with:sections', 'string', 'max:255'],
            'sections.*.content' => ['nullable', 'string'],
            'sections.*.is_visible' => ['sometimes', 'boolean'],
            'sections.*.sort_order' => ['sometimes', 'integer', 'min:0'],
            'sections.*.fields' => ['nullable', 'array'],
            'service_id' => ['nullable', 'exists:services,id'],
        ];
    }
}
