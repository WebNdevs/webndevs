<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ServiceTemplateField extends Model
{
    use HasFactory;

    protected $fillable = [
        'service_id',
        'field_key',
        'label',
        'field_type',
        'is_required',
        'default_value',
        'options',
        'display_order',
    ];

    protected function casts(): array
    {
        return [
            'is_required' => 'boolean',
            'default_value' => 'array',
            'options' => 'array',
            'display_order' => 'integer',
        ];
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function values(): HasMany
    {
        return $this->hasMany(ServiceTemplateValue::class, 'template_field_id');
    }
}
