<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ServicePackageRelation extends Model
{
    use HasFactory;

    protected $fillable = [
        'service_id',
        'from_plan_id',
        'to_plan_id',
        'relation_type',
    ];

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function fromPlan(): BelongsTo
    {
        return $this->belongsTo(ServicePlan::class, 'from_plan_id');
    }

    public function toPlan(): BelongsTo
    {
        return $this->belongsTo(ServicePlan::class, 'to_plan_id');
    }
}
