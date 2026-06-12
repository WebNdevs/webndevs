<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class CaseStudy extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'client_name',
        'client_industry',
        'client_logo_url',
        'challenge',
        'solution',
        'results_summary',
        'timeline',
        'featured_image_url',
        'is_featured',
        'status',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'is_featured' => 'boolean',
            'published_at' => 'datetime',
        ];
    }

    public function metrics(): HasMany
    {
        return $this->hasMany(CaseStudyMetric::class);
    }

    public function entityLinks(): HasMany
    {
        return $this->hasMany(CaseStudyEntityPivot::class);
    }
}
