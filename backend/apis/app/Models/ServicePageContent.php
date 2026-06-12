<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ServicePageContent extends Model
{
    use HasFactory;

    protected $fillable = [
        'service_id',
        'section_key',
        'content_key',
        'label',
        'subheading',
        'content_type',
        'value',
        'locale',
        'status',
        'is_active',
        'display_order',
        'updated_by',
    ];

    protected function casts(): array
    {
        return [
            'value' => 'array',
            'subheading' => 'string',
            'locale' => 'string',
            'status' => 'string',
            'is_active' => 'boolean',
            'display_order' => 'integer',
        ];
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function editor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
