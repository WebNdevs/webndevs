<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SinglePageItem extends Model
{
    use HasFactory;

    protected $table = 'singlepage_section_items';

    protected $fillable = [
        'singlepage_section_id',
        'data',
        'is_active',
        'is_featured',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'data' => 'array',
            'sort_order' => 'integer',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    public function section(): BelongsTo
    {
        return $this->belongsTo(SinglePageSection::class, 'singlepage_section_id');
    }
}
