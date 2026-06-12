<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class SlugGeneratorService
{
    public function unique(string $value, string $modelClass, string $column = 'slug', ?int $ignoreId = null): string
    {
        $base = Str::slug($value);
        $candidate = $base !== '' ? $base : Str::random(8);
        $suffix = 1;

        /** @var Model $modelClass */
        while ($this->exists($modelClass, $column, $candidate, $ignoreId)) {
            $candidate = $base.'-'.$suffix;
            $suffix++;
        }

        return $candidate;
    }

    private function exists(string $modelClass, string $column, string $value, ?int $ignoreId): bool
    {
        $query = $modelClass::query()->where($column, $value);

        if ($ignoreId !== null) {
            $query->whereKeyNot($ignoreId);
        }

        return $query->exists();
    }
}
