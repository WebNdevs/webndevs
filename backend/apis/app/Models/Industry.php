<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Industry extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'icon',
        'tagline',
        'description',
        'hero_image_url',
        'pain_points',
        'key_stats',
        'is_featured',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'pain_points' => 'array',
            'key_stats' => 'array',
            'is_featured' => 'boolean',
        ];
    }

    public function solutions(): HasMany
    {
        return $this->hasMany(Solution::class);
    }

    public function useCases(): HasMany
    {
        return $this->hasMany(UseCase::class);
    }
}
