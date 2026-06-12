<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BulkUpdateSeoMetadataRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'items'                    => ['required', 'array', 'min:1'],
            'items.*.entity_type'      => ['required', 'string', 'max:100'],
            'items.*.entity_id'        => ['required', 'integer', 'min:1'],
            'items.*.meta_title'       => ['nullable', 'string', 'max:200'],
            'items.*.meta_description' => ['nullable', 'string', 'max:500'],
            'items.*.og_title'         => ['nullable', 'string', 'max:200'],
            'items.*.og_description'   => ['nullable', 'string', 'max:500'],
            'items.*.twitter_card'     => ['nullable', Rule::in(['summary', 'summary_large_image'])],
            'items.*.canonical_url'    => ['nullable', 'url', 'max:500'],
        ];
    }
}
