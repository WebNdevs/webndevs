<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSeoMetadataRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'meta_title'         => ['nullable', 'string', 'max:200'],
            'meta_description'   => ['nullable', 'string', 'max:500'],
            'og_title'           => ['nullable', 'string', 'max:200'],
            'og_description'     => ['nullable', 'string', 'max:500'],
            'og_image_url'       => ['nullable', 'url', 'max:500'],
            'twitter_card'       => ['nullable', Rule::in(['summary', 'summary_large_image'])],
            'canonical_url'      => ['nullable', 'url', 'max:500'],
            'schema_type'        => ['nullable', 'string', 'max:100'],
            'schema_data'        => ['nullable', 'array'],
            'robots_directive'   => ['nullable', 'string', 'max:100'],
            'focus_keyword'      => ['nullable', 'string', 'max:200'],
            'secondary_keywords' => ['nullable', 'array'],
            'seo_score'          => ['nullable', 'integer', 'min:0', 'max:100'],
        ];
    }
}
