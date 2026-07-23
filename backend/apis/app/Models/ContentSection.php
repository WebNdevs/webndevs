<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ContentSection extends Model
{
    use HasFactory;

    protected $fillable = [
        'content_page_id',
        'section_key',
        'section_type',
        'data',
        'is_visible',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'is_visible' => 'boolean',
            'sort_order' => 'integer',
            'data' => 'array',
        ];
    }

    public function page(): BelongsTo
    {
        return $this->belongsTo(ContentPage::class, 'content_page_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(ContentItem::class, 'content_section_id')
            ->orderBy('is_featured', 'desc')
            ->orderBy('sort_order')
            ->orderBy('id');
    }
}
