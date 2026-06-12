<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class SeoMetadata extends Model
{
    use HasFactory;

    protected $table = 'seo_metadata';

    protected $fillable = [
        'entity_type',
        'entity_id',
        'meta_title',
        'meta_description',
        'og_title',
        'og_description',
        'og_image_url',
        'twitter_card',
        'canonical_url',
        'schema_type',
        'schema_data',
        'robots_directive',
        'focus_keyword',
        'secondary_keywords',
        'seo_score',
    ];

    protected function casts(): array
    {
        return [
            'schema_data' => 'array',
            'secondary_keywords' => 'array',
            'seo_score' => 'integer',
        ];
    }

    public function entity(): MorphTo
    {
        return $this->morphTo('entity', 'entity_type', 'entity_id');
    }
}
