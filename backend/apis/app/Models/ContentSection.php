<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContentSection extends Model
{
    use HasFactory;

    protected $fillable = [
        'content_page_id',
        'section_key',
        'section_type',
        'name',
        'title',
        'content',
        'is_visible',
        'sort_order',
        'fields',
        'sync_version',
        'updated_by',
        
        // Heading Text fields
        'description',
        'tag',
        'subheading1',
        'subheading2',
        'subtext',
        
        // Approach Table fields
        'left_heading',
        'right_heading',
        'left_points',
        'right_points',
    ];

    protected function casts(): array
    {
        return [
            'is_visible' => 'boolean',
            'sort_order' => 'integer',
            'fields' => 'array',
            'sync_version' => 'integer',
            'left_points' => 'array',
            'right_points' => 'array',
        ];
    }

    public function page(): BelongsTo
    {
        return $this->belongsTo(ContentPage::class, 'content_page_id');
    }

    public function editor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function items(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(ContentItem::class, 'content_section_id')
            ->orderBy('is_featured', 'desc')
            ->orderBy('sort_order')
            ->orderBy('id');
    }
}
