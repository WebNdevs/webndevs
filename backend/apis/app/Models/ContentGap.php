<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContentGap extends Model
{
    use HasFactory;

    protected $fillable = [
        'entity_a_type',
        'entity_a_id',
        'entity_b_type',
        'entity_b_id',
        'suggested_title',
        'gap_score',
        'rationale',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'gap_score' => 'integer',
        ];
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }
}
