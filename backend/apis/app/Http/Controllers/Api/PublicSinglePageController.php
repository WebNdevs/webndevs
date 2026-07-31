<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SinglePagePage;
use App\Models\SinglePageSection;
use Illuminate\Http\JsonResponse;

class PublicSinglePageController extends Controller
{
    private const ALLOWED_SECTION_KEYS = [
        'hero',
        'header',
        'featured',
        'directory',
        'benefits',
        'review',
        'stats',
        'comparison',
        'faq',
        'cta',
    ];
    public function index(): JsonResponse
    {
        $pages = SinglePagePage::query()
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

        $singlepagePages = [];

        foreach ($pages as $page) {
            $pagePath = $this->normalizePagePath(
                $page->slug
            );

            $singlepagePages[$pagePath] = [];

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

                $singlepagePages[$pagePath][
                    $section->section_key
                ] = $compiledSection;
            }
        }

        return response()->json([
            'singlepage-pages' => $singlepagePages,
        ]);
    }

    private function normalizePagePath(
        ?string $slug
    ): string {
        $slug = trim((string) $slug);

        if (
            $slug === '' ||
            $slug === '/' ||
            $slug === 'tools' ||
            $slug === 'toolspage'
        ) {
            return '/';
        }

        return '/' . trim($slug, '/');
    }

    private function compileSection(
        SinglePageSection $section
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