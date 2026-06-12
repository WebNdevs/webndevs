<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCrossReferencePageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $page = $this->route('crossReferencePage');

        return [
            'slug'             => ['sometimes', 'string', 'max:500', Rule::unique('cross_reference_pages', 'slug')->ignore($page?->id)],
            'url_path'         => ['sometimes', 'string', 'max:500', Rule::unique('cross_reference_pages', 'url_path')->ignore($page?->id)],
            'title'            => ['sometimes', 'string', 'max:500'],
            'subtitle'         => ['nullable', 'string', 'max:1000'],
            'quick_answer'     => ['nullable', 'string'],
            'meta_title'       => ['nullable', 'string', 'max:200'],
            'meta_description' => ['nullable', 'string', 'max:500'],
            'og_image_url'     => ['nullable', 'url', 'max:500'],
            'status'           => ['nullable', 'in:draft,published,archived'],
            'published_at'     => ['nullable', 'date'],
            'sections' => ['sometimes', 'array'],
            'sections.*.section_key' => ['required_with:sections', 'string', 'max:100'],
            'sections.*.title' => ['nullable', 'string', 'max:255'],
            'sections.*.content' => ['nullable', 'string'],
            'sections.*.data' => ['nullable', 'array'],
            'sections.*.sort_order' => ['nullable', 'integer'],
            'sections.*.is_visible' => ['nullable', 'boolean'],
        ];
    }
}
