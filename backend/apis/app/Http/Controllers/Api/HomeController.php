<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Industry;
use App\Models\Service;
use App\Models\Solution;
use App\Models\Tool;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        return response()->json([
            'featured_tools' => Tool::query()
                ->where('status', 'published')
                ->where('is_featured', true)
                ->orderBy('sort_order')
                ->limit(8)
                ->get(),
            'featured_industries' => Industry::query()
                ->where('status', 'published')
                ->where('is_featured', true)
                ->orderBy('name')
                ->limit(8)
                ->get(),
            'featured_solutions' => Solution::query()
                ->where('status', 'published')
                ->orderByDesc('id')
                ->limit(8)
                ->get(),
            'featured_services' => Service::query()
                ->where('status', 'published')
                ->where('is_featured', true)
                ->orderBy('sort_order')
                ->limit(6)
                ->get(),
        ]);
    }
}
