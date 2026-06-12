<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ComparisonPage extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'slug',
        'title',
        'subtitle',
        'quick_verdict',
        'recommendation',
        'intro_content',
        'status',
    ];

    public function entities(): HasMany
    {
        return $this->hasMany(ComparisonEntity::class);
    }

    public function features(): HasMany
    {
        return $this->hasMany(ComparisonFeature::class);
    }
}
