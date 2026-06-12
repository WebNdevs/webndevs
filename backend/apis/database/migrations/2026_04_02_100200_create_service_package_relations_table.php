<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_package_relations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_id')->constrained('services')->cascadeOnDelete();
            $table->foreignId('from_plan_id')->constrained('service_plans')->cascadeOnDelete();
            $table->foreignId('to_plan_id')->constrained('service_plans')->cascadeOnDelete();
            $table->enum('relation_type', ['upgrade', 'downgrade', 'alternative']);
            $table->timestamps();

            $table->unique(['from_plan_id', 'to_plan_id', 'relation_type'], 'service_package_rel_unique');
            $table->index(['service_id', 'relation_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_package_relations');
    }
};
