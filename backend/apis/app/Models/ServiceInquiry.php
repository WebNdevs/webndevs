<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceInquiry extends Model
{
    use HasFactory;

    protected $fillable = [
        'service_slug',
        'plan_key',
        'plan_name',
        'name',
        'email',
        'phone',
        'company',
        'budget',
        'project_brief',
        'status',
    ];
}
