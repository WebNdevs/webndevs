<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContentPage;
use App\Models\ContentSection;
use Illuminate\Http\JsonResponse;

class PublicContentController extends Controller
{
    private const ALLOWED_SECTION_KEYS = [
        'hero',
        'header',
        'whyus',
        'comparison',
        'process',
        'stats',
        'result',
        'review',
        'techspec',
        'faq',
        'data',
        'cta',
    ];
    public function index(): JsonResponse
    {
        $pages = ContentPage::query()
            ->where('status', 'published')
            ->with([
                'sectionItems' => function ($query) {
                    $query
                        ->where('is_visible', true)
                        ->with([
                            'items' => function ($query) {
                                $query
                                    ->where('is_active', true)
                                    ->orderBy('sort_order')
                                    ->orderBy('id');
                            },
                        ]);
                },
            ])
            ->orderBy('id')
            ->get();

        $contentPages = [];

        foreach ($pages as $page) {
            $pagePath = $this->normalizePagePath(
                $page->slug
            );

            $contentPages[$pagePath] = [];

            foreach ($page->sectionItems as $section) {

                if (
                    !in_array(
                        $section->section_key,
                        self::ALLOWED_SECTION_KEYS,
                        true
                    )
                ) {
                    continue;
                }

                $compiledSection = $this->compileSection(
                    $section
                );

                if (empty($compiledSection)) {
                    continue;
                }

                $contentPages[$pagePath][
                    $section->section_key
                ] = $compiledSection;
            }
        }

        return response()->json([
            'content-pages' => $contentPages,
        ]);
    }

    private function normalizePagePath(
        ?string $slug
    ): string {
        $slug = trim((string) $slug);

        if (
            $slug === '' ||
            $slug === '/' ||
            $slug === 'home' ||
            $slug === 'homepage'
        ) {
            return '/';
        }

        return '/' . trim($slug, '/');
    }

    private function compileSection(
        ContentSection $section
    ): array {
        $sectionData = is_array($section->data)
            ? $section->data
            : [];
        unset($sectionData['variant']);
        $items = $section->items
            ->map(function ($item) use ($section) {

                $itemData = is_array($item->data)
                    ? $item->data
                    : [];

                return $this->removeEmptyValues(
                    $itemData
                );
            })
            ->filter()
            ->values()
            ->toArray();

        /*
        |--------------------------------------------------------------------------
        | Standalone sections
        |--------------------------------------------------------------------------
        |
        | Hero and CTA do not need header/items wrappers.
        |
        */

        if (
            in_array(
                $section->section_key,
                [
                    'hero',
                    'header',
                    'comparison',
                    'techspec',
                    'cta',
                ],
                true
            )
        ) {
            return $this->removeEmptyValues(
                $sectionData
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Sections containing header, items and CTA
        |--------------------------------------------------------------------------
        */

        $compiled = [];

        $header = $this->extractHeader(
            $sectionData
        );

        if (!empty($header)) {
            $compiled['header'] = $header;
        }

        if (!empty($items)) {
            $compiled['items'] = $items;
        }

        if (
            isset($sectionData['cta']) &&
            is_array($sectionData['cta'])
        ) {
            $cta = $this->removeEmptyValues(
                $sectionData['cta']
            );

            if (!empty($cta)) {
                $compiled['cta'] = $cta;
            }
        }

        /*
        |--------------------------------------------------------------------------
        | Preserve section-specific data
        |--------------------------------------------------------------------------
        */

        $reservedKeys = [
            'tag',
            'subheading1',
            'subheading2',
            'subtext',
            'cta',
        ];

        foreach ($sectionData as $key => $value) {
            if (
                !in_array(
                    $key,
                    $reservedKeys,
                    true
                )
            ) {
                $compiled[$key] = $value;
            }
        }

        return $this->removeEmptyValues(
            $compiled
        );
    }

    private function extractHeader(
        array $sectionData
    ): array {
        return $this->removeEmptyValues([
            'tag' =>
                $sectionData['tag']
                ?? null,

            'subheading1' =>
                $sectionData['subheading1']
                ?? null,

            'subheading2' =>
                $sectionData['subheading2']
                ?? null,

            'subtext' =>
                $sectionData['subtext']
                ?? null,
        ]);
    }

    private function removeEmptyValues(
        array $data
    ): array {
        $cleaned = [];

        foreach ($data as $key => $value) {
            if (is_array($value)) {
                $value = $this->removeEmptyValues(
                    $value
                );

                if ($value === []) {
                    continue;
                }
            }

            if (
                $value === null ||
                $value === ''
            ) {
                continue;
            }

            $cleaned[$key] = $value;
        }

        return $cleaned;
    }
}