<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpsertServicePageSectionsRequest extends FormRequest
{
    public const SECTION_KEYS = [
        'how_we_work',
        'who_is_this_for',
        'real_results_delivered',
        'client_testimonials',
        'frequently_asked_questions',
        'technologies_we_use',
        'what_you_get',
        'why_choose_our_service',
    ];

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'locale' => ['nullable', 'string', 'max:16', 'regex:/^[a-z]{2}(-[A-Z]{2})?$/'],
            'sections' => ['required', 'array', 'min:1', 'max:8'],
            'sections.*.section_key' => ['required', 'distinct', Rule::in(self::SECTION_KEYS)],
            'sections.*.heading' => ['nullable', 'string', 'max:255'],
            'sections.*.subheading' => ['nullable', 'string', 'max:1200'],
            'sections.*.is_active' => ['nullable', 'boolean'],
            'sections.*.items' => ['required', 'array', 'max:30'],
            'sections.*.items.*.title' => ['nullable', 'string', 'max:255'],
            'sections.*.items.*.description' => ['nullable', 'string', 'max:2000'],
            'sections.*.items.*.value' => ['nullable', 'string', 'max:2000'],
            'sections.*.items.*.question' => ['nullable', 'string', 'max:255'],
            'sections.*.items.*.answer' => ['nullable', 'string', 'max:2000'],
            'sections.*.items.*.name' => ['nullable', 'string', 'max:255'],
            'sections.*.items.*.role' => ['nullable', 'string', 'max:255'],
            'sections.*.items.*.quote' => ['nullable', 'string', 'max:2000'],
            'sections.*.items.*.metric' => ['nullable', 'string', 'max:255'],
            'sections.*.items.*.author_name' => ['nullable', 'string', 'max:255'],
            'sections.*.items.*.author_title' => ['nullable', 'string', 'max:255'],
            'sections.*.items.*.company' => ['nullable', 'string', 'max:255'],
            'sections.*.items.*.content' => ['nullable', 'string', 'max:2000'],
            'sections.*.items.*.rating' => ['nullable', 'integer', 'min:1', 'max:5'],
            'sections.*.items.*.category' => ['nullable', 'string', 'max:255'],
            'sections.*.items.*.results' => ['nullable', 'array'],
            'sections.*.items.*.results.*' => ['nullable', 'string', 'max:255'],
            'sections.*.items.*.technologies' => ['nullable', 'array'],
            'sections.*.items.*.technologies.*' => ['nullable', 'string', 'max:100'],
            'sections.*.items.*.icon' => ['nullable', 'string', 'max:100'],
            'sections.*.items.*.number' => ['nullable', 'string', 'max:20'],
            'sections.*.items.*.project_url' => ['nullable', 'url', 'max:255'],
            'publish' => ['nullable', 'boolean'],
        ];
    }
}
