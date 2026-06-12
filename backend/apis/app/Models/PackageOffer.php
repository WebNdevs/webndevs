<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PackageOffer extends Model
{
    use HasFactory;

    protected $fillable = [
        'service_id',
        'offer_key',
        'plan_key',
        'name',
        'description',
        'offer_type',
        'discount_value',
        'combo_plan_keys',
        'combo_price',
        'conditions',
        'starts_at',
        'ends_at',
        'is_active',
        'display_order',
        'created_by',
        'updated_by',
    ];

    protected function casts(): array
    {
        return [
            'discount_value' => 'decimal:2',
            'combo_plan_keys' => 'array',
            'combo_price' => 'decimal:2',
            'conditions' => 'array',
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
            'is_active' => 'boolean',
            'display_order' => 'integer',
        ];
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function editor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
