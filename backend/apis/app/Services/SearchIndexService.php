<?php

namespace App\Services;

use App\Models\CaseStudy;
use App\Models\ComparisonPage;
use App\Models\Industry;
use App\Models\Solution;
use App\Models\Tool;

class SearchIndexService
{
    public function search(string $query, int $limit = 10): array
    {
        $like = '%'.$query.'%';

        return [
            'tools' => Tool::query()
                ->where('status', 'published')
                ->where(fn ($q) => $q->where('name', 'like', $like)->orWhere('tagline', 'like', $like))
                ->limit($limit)
                ->get(['id', 'name', 'slug', 'tagline']),
            'industries' => Industry::query()
                ->where('status', 'published')
                ->where(fn ($q) => $q->where('name', 'like', $like)->orWhere('description', 'like', $like))
                ->limit($limit)
                ->get(['id', 'name', 'slug', 'description']),
            'solutions' => Solution::query()
                ->where('status', 'published')
                ->where(fn ($q) => $q->where('name', 'like', $like)->orWhere('tagline', 'like', $like))
                ->limit($limit)
                ->get(['id', 'name', 'slug', 'tagline']),
            'comparisons' => ComparisonPage::query()
                ->where('status', 'published')
                ->where('title', 'like', $like)
                ->limit($limit)
                ->get(['id', 'title', 'slug']),
            'case_studies' => CaseStudy::query()
                ->where('status', 'published')
                ->where('title', 'like', $like)
                ->limit($limit)
                ->get(['id', 'title', 'slug']),
        ];
    }
}
