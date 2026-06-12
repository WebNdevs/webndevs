<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Tool extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'tool_category_id',
        'name',
        'slug',
        'tagline',
        'logo_url',
        'website_url',
        'docs_url',
        'overview',
        'key_points',
        'pricing_model',
        'is_featured',
        'is_active',
        'sort_order',
        'status',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'key_points' => 'array',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
            'published_at' => 'datetime',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(ToolCategory::class, 'tool_category_id');
    }

    public function features(): BelongsToMany
    {
        return $this->belongsToMany(Feature::class, 'tool_feature_pivot');
    }

    public function solutions(): BelongsToMany
    {
        return $this->belongsToMany(Solution::class, 'solution_tool_pivot')
            ->withPivot(['tool_role', 'sort_order', 'notes']);
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
