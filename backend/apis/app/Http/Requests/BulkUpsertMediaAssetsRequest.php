<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class BulkUpsertMediaAssetsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'items' => ['required', 'array', 'min:1'],
            'items.*.id' => ['nullable', 'integer', 'exists:media_assets,id'],
            'items.*.media_folder_id' => ['nullable', 'integer', 'exists:media_folders,id'],
            'items.*.service_id' => ['nullable', 'integer', 'exists:services,id'],
            'items.*.service_category_id' => ['nullable', 'integer', 'exists:service_categories,id'],
            'items.*.title' => ['nullable', 'string', 'max:255'],
            'items.*.alt_text' => ['nullable', 'string', 'max:255'],
            'items.*.caption' => ['nullable', 'string'],
            'items.*.file_name' => ['required', 'string', 'max:255'],
            'items.*.disk' => ['nullable', 'string', 'max:120'],
            'items.*.path' => ['required', 'string', 'max:1000'],
            'items.*.url' => ['required', 'url', 'max:1000'],
            'items.*.mime_type' => ['nullable', 'string', 'max:120'],
            'items.*.size_bytes' => ['nullable', 'integer', 'min:0'],
            'items.*.width' => ['nullable', 'integer', 'min:1'],
            'items.*.height' => ['nullable', 'integer', 'min:1'],
            'items.*.tags' => ['nullable', 'array'],
            'items.*.tags.*' => ['string', 'max:100'],
            'items.*.optimization_meta' => ['nullable', 'array'],
            'items.*.is_optimized' => ['nullable', 'boolean'],
            'items.*.display_order' => ['nullable', 'integer', 'min:0'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $items = $this->input('items', []);
            foreach ($items as $index => $item) {
                if (! $this->looksLikeImageAsset($item)) {
                    continue;
                }

                $altText = trim((string) ($item['alt_text'] ?? ''));
                if ($altText === '') {
                    $validator->errors()->add("items.{$index}.alt_text", 'Alt text is required for image assets.');
                }

                if (empty($item['width']) || empty($item['height'])) {
                    $validator->errors()->add("items.{$index}.width", 'Width and height are required for image assets to reduce layout shift.');
                }
            }
        });
    }

    private function looksLikeImageAsset(array $item): bool
    {
        $mimeType = strtolower((string) ($item['mime_type'] ?? ''));
        if (str_starts_with($mimeType, 'image/')) {
            return true;
        }

        $url = strtolower((string) ($item['url'] ?? ''));
        return (bool) preg_match('/\.(png|jpe?g|gif|webp|avif|svg)(\?.*)?$/', $url);
    }
}
