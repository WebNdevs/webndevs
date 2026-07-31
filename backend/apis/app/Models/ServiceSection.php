<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ServiceSection extends Model
{
    use HasFactory;

    protected $fillable = [
        'service_page_id',
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
        return $this->belongsTo(ServicePage::class, 'service_page_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(ServiceItem::class, 'service_section_id')
            ->orderBy('is_featured', 'desc')
            ->orderBy('sort_order')
            ->orderBy('id');
    }
}
