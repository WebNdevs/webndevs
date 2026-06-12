<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SearchIndexService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function __construct(private readonly SearchIndexService $searchIndexService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $query = trim((string) $request->query('q', ''));
        if ($query === '') {
            return response()->json([
                'query' => '',
                'results' => [],
            ]);
        }

        return response()->json([
            'query' => $query,
            'results' => $this->searchIndexService->search($query, $request->integer('limit', 10)),
        ]);
    }
}
