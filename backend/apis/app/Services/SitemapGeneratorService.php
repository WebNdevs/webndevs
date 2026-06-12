<?php

namespace App\Services;

use App\Models\CaseStudy;
use App\Models\ComparisonPage;
use App\Models\Industry;
use App\Models\Solution;
use App\Models\Tool;
use Illuminate\Support\Collection;

class SitemapGeneratorService
{
    private const MAX_URLS_PER_SITEMAP = 50000;

    public function generatePrimarySitemapXml(): string
    {
        $sections = $this->generateSectionSitemaps();

        $totalUrlCount = collect($sections)->sum(fn (array $section) => count($section['paths']));
        if ($totalUrlCount <= self::MAX_URLS_PER_SITEMAP) {
            $paths = collect($sections)->flatMap(fn (array $section) => $section['paths'])->values();

            return $this->buildUrlSetXml($paths);
        }

        $baseUrl = rtrim((string) config('app.url', 'http://localhost:8000'), '/');
        $xml = ['<?xml version="1.0" encoding="UTF-8"?>', '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];
        foreach (array_keys($sections) as $sectionKey) {
            $xml[] = '  <sitemap><loc>'.htmlspecialchars("{$baseUrl}/sitemaps/{$sectionKey}.xml", ENT_QUOTES | ENT_XML1).'</loc></sitemap>';
        }
        $xml[] = '</sitemapindex>';

        return implode("\n", $xml);
    }

    public function generateSectionSitemapXml(string $section): ?string
    {
        $sections = $this->generateSectionSitemaps();
        if (! array_key_exists($section, $sections)) {
            return null;
        }

        return $this->buildUrlSetXml($sections[$section]['paths']);
    }

    /**
     * @return array<string, array{name: string, paths: array<int, string>}>
     */
    public function generateSectionSitemaps(): array
    {
        $paths = [
            'core' => [
                'name' => 'Core Pages',
                'paths' => ['/'],
            ],
            'tools' => [
                'name' => 'Tool Pages',
                'paths' => $this->pluckPublishedPaths(Tool::query(), '/tools/'),
            ],
            'industries' => [
                'name' => 'Industry Pages',
                'paths' => $this->pluckPublishedPaths(Industry::query(), '/industries/'),
            ],
            'solutions' => [
                'name' => 'Solution Pages',
                'paths' => $this->pluckPublishedPaths(Solution::query(), '/solutions/'),
            ],
            'comparisons' => [
                'name' => 'Comparison Pages',
                'paths' => $this->pluckPublishedPaths(ComparisonPage::query(), '/compare/'),
            ],
            'case-studies' => [
                'name' => 'Case Study Pages',
                'paths' => $this->pluckPublishedPaths(CaseStudy::query(), '/case-studies/'),
            ],
        ];

        return array_map(function (array $section): array {
            $section['paths'] = array_values(array_unique($section['paths']));

            return $section;
        }, $paths);
    }

    /**
     * @param  Collection<int, string>|array<int, string>  $paths
     */
    private function buildUrlSetXml(Collection|array $paths): string
    {
        $baseUrl = rtrim((string) config('app.url', 'http://localhost:8000'), '/');

        $xml = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];
        foreach ($paths as $path) {
            $xml[] = '  <url><loc>'.htmlspecialchars($baseUrl.$path, ENT_QUOTES | ENT_XML1).'</loc></url>';
        }
        $xml[] = '</urlset>';

        return implode("\n", $xml);
    }

    private function pluckPublishedPaths($query, string $prefix): array
    {
        return $query
            ->where('status', 'published')
            ->pluck('slug')
            ->map(fn (string $slug) => $prefix.$slug)
            ->values()
            ->all();
    }
}
