<?php

namespace App\Services;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

class ContentFreshnessService
{
    public function stale(Builder $query, int $days = 90): Collection
    {
        $cutoff = Carbon::now()->subDays($days);

        return $query->where('updated_at', '<', $cutoff)->get();
    }
}
