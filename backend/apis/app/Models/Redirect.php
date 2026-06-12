<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Redirect extends Model
{
    use HasFactory;

    protected $fillable = [
        'from_url',
        'to_url',
        'redirect_type',
        'hit_count',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'redirect_type' => 'integer',
            'hit_count' => 'integer',
            'is_active' => 'boolean',
        ];
    }
}
