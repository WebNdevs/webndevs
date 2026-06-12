<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ServicePlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'service_id',
        'parent_plan_id',
        'plan_key',
        'name',
        'price',
        'billing_cycle',
        'delivery_days',
        'max_duration_days',
        'description',
        'features',
        'custom_config',
        'max_revisions',
        'comparison_points',
        'is_featured',
        'is_active',
        'display_order',
        'sync_version',
        'updated_by',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'delivery_days' => 'integer',
            'max_duration_days' => 'integer',
            'features' => 'array',
            'custom_config' => 'array',
            'comparison_points' => 'array',
            'max_revisions' => 'integer',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'display_order' => 'integer',
            'sync_version' => 'integer',
        ];
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function parentPlan(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_plan_id');
    }

    public function childPlans(): HasMany
    {
        return $this->hasMany(self::class, 'parent_plan_id')->orderBy('display_order')->orderBy('id');
    }

    public function outgoingRelations(): HasMany
    {
        return $this->hasMany(ServicePackageRelation::class, 'from_plan_id');
    }

    public function incomingRelations(): HasMany
    {
        return $this->hasMany(ServicePackageRelation::class, 'to_plan_id');
    }

    public function templateValues(): HasMany
    {
        return $this->hasMany(ServiceTemplateValue::class, 'service_plan_id');
    }

    public function editor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
