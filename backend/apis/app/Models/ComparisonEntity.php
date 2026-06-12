<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ComparisonEntity extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'comparison_page_id',
        'entity_type',
        'entity_id',
        'position',
        'tag',
    ];

    protected function casts(): array
    {
        return [
            'position' => 'integer',
        ];
    }

    public function entity()
    {
        return $this->morphTo();
    }
}
