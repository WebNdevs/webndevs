<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreIndustryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:200'],
            'slug' => ['required', 'string', 'max:200', 'unique:industries,slug'],
            'icon' => ['nullable', 'string', 'max:100'],
            'tagline' => ['nullable', 'string', 'max:500'],
            'description' => ['nullable', 'string'],
            'hero_image_url' => ['nullable', 'url', 'max:500'],
            'pain_points' => ['nullable', 'array'],
            'pain_points.*' => ['string', 'max:255'],
            'key_stats' => ['nullable', 'array'],
            'is_featured' => ['nullable', 'boolean'],
            'status' => ['required', 'in:draft,published'],
        ];
    }
}
