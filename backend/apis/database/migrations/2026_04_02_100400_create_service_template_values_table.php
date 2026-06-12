<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_template_values', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_id')->constrained('services')->cascadeOnDelete();
            $table->foreignId('service_plan_id')->nullable()->constrained('service_plans')->cascadeOnDelete();
            $table->foreignId('template_field_id')->constrained('service_template_fields')->cascadeOnDelete();
            $table->json('value')->nullable();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->unique(['service_id', 'service_plan_id', 'template_field_id'], 'service_template_values_unique');
            $table->index(['service_id', 'service_plan_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_template_values');
    }
};
