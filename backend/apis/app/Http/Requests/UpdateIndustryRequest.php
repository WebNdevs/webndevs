<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateIndustryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $industryId = $this->route('industry')?->id;

        return [
            'name' => ['sometimes', 'required', 'string', 'max:200'],
            'slug' => ['sometimes', 'required', 'string', 'max:200', Rule::unique('industries', 'slug')->ignore($industryId)],
            'icon' => ['nullable', 'string', 'max:100'],
            'tagline' => ['nullable', 'string', 'max:500'],
            'description' => ['nullable', 'string'],
            'hero_image_url' => ['nullable', 'url', 'max:500'],
            'pain_points' => ['nullable', 'array'],
            'pain_points.*' => ['string', 'max:255'],
            'key_stats' => ['nullable', 'array'],
            'is_featured' => ['nullable', 'boolean'],
            'status' => ['sometimes', 'required', 'in:draft,published'],
        ];
    }
}
