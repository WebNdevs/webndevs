<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_id')->constrained('services')->cascadeOnDelete();
            $table->string('plan_key');
            $table->string('name');
            $table->decimal('price', 10, 2)->default(0);
            $table->enum('billing_cycle', ['one_time', 'monthly'])->default('one_time');
            $table->unsignedInteger('delivery_days')->nullable();
            $table->text('description')->nullable();
            $table->json('features')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('display_order')->default(0);
            $table->unsignedBigInteger('sync_version')->default(1);
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->unique(['service_id', 'plan_key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_plans');
    }
};
