<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ArticlePage;
use App\Models\ArticleSection;
use Illuminate\Http\JsonResponse;

class PublicArticleController extends Controller
{
    private const ALLOWED_SECTION_KEYS = [
        'hero',
        'header',
        'content',
        'cta',
    ];

    public function index(): JsonResponse
    {
        $pages = ArticlePage::query()
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

        $articlePages = [];

        foreach ($pages as $page) {
            $pagePath = $this->normalizePagePath($page->slug);
            $wrapperKey = trim($page->slug, '/');

            $compiledPage = [];

            foreach ($page->sectionItems as $section) {
                if (!in_array($section->section_key, self::ALLOWED_SECTION_KEYS, true)) {
                    continue;
                }

                $compiledSection = $this->compileSection($section);
                if ($compiledSection === null || $compiledSection === [] || $compiledSection === '') {
                    continue;
                }

                $key = $section->section_key === 'content' ? 'items' : $section->section_key;
                $compiledPage[$key] = $compiledSection;
            }

            if (!empty($compiledPage)) {
                $articlePages[$pagePath] = $compiledPage;
            }
        }

        return response()->json([
            'article-pages' => $articlePages,
        ]);
    }

    private function normalizePagePath(?string $slug): string
    {
        $slug = trim((string) $slug);

        if ($slug === '' || $slug === '/' || $slug === 'home' || $slug === 'homepage') {
            return '/';
        }

        return '/' . trim($slug, '/');
    }

    private function compileSection(ArticleSection $section)
    {
        $sectionData = is_array($section->data) ? $section->data : [];
        unset($sectionData['variant']);

        if ($section->section_key === 'content') {
            return $section->items
                ->map(function ($item) {
                    $itemData = is_array($item->data) ? $item->data : [];
                    return $this->removeEmptyValues($itemData);
                })
                ->filter()
                ->values()
                ->toArray();
        }

        if ($section->section_key === 'hero') {
            return $this->removeEmptyValues([
                'tag' => $sectionData['tag'] ?? null,
                'title1' => $sectionData['title1'] ?? null,
                'title2' => $sectionData['title2'] ?? null,
                'description' => $sectionData['description'] ?? null,
            ]);
        }

        if ($section->section_key === 'header') {
            return $this->removeEmptyValues([
                'tag' => $sectionData['tag'] ?? null,
                'subheading1' => $sectionData['subheading1'] ?? null,
                'subheading2' => $sectionData['subheading2'] ?? null,
                'subtext' => $sectionData['subtext'] ?? null,
            ]);
        }

        if ($section->section_key === 'cta') {
            $preview = isset($sectionData['preview']) && is_array($sectionData['preview'])
                ? $this->removeEmptyValues($sectionData['preview'])
                : null;
            $full = isset($sectionData['full']) && is_array($sectionData['full'])
                ? $this->removeEmptyValues($sectionData['full'])
                : null;

            return $this->removeEmptyValues([
                'preview' => $preview,
                'full' => $full,
            ]);
        }

        return $this->removeEmptyValues($sectionData);
    }

    private function removeEmptyValues(array $data): array
    {
        $cleaned = [];

        foreach ($data as $key => $value) {
            if (is_array($value)) {
                $value = $this->removeEmptyValues($value);
                if ($value === []) {
                    continue;
                }
            }

            if ($value === null || $value === '') {
                continue;
            }

            $cleaned[$key] = $value;
        }

        return $cleaned;
    }
}
