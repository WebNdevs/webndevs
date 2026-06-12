<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InternalLink extends Model
{
    use HasFactory;

    protected $fillable = [
        'source_entity_type',
        'source_entity_id',
        'target_entity_type',
        'target_entity_id',
        'anchor_text',
        'context_snippet',
        'is_confirmed',
        'is_auto_generated',
        'confirmed_at',
    ];

    protected function casts(): array
    {
        return [
            'is_confirmed' => 'boolean',
            'is_auto_generated' => 'boolean',
            'confirmed_at' => 'datetime',
        ];
    }

    public function scopeUnconfirmed($query)
    {
        return $query->where('is_confirmed', false);
    }
}
