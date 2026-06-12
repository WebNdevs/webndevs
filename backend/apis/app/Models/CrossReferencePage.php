<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class CrossReferencePage extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'entity_a_type',
        'entity_a_id',
        'entity_b_type',
        'entity_b_id',
        'entity_c_type',
        'entity_c_id',
        'slug',
        'url_path',
        'title',
        'subtitle',
        'quick_answer',
        'meta_title',
        'meta_description',
        'og_image_url',
        'status',
        'published_at',
    ];

    public function entityA(): MorphTo
    {
        return $this->morphTo(__FUNCTION__, 'entity_a_type', 'entity_a_id');
    }

    public function entityB(): MorphTo
    {
        return $this->morphTo(__FUNCTION__, 'entity_b_type', 'entity_b_id');
    }

    public function entityC(): MorphTo
    {
        return $this->morphTo(__FUNCTION__, 'entity_c_type', 'entity_c_id');
    }

    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
        ];
    }

    public function sections(): HasMany
    {
        return $this->hasMany(CrossRefSection::class, 'cross_reference_page_id')->orderBy('sort_order');
    }
}
