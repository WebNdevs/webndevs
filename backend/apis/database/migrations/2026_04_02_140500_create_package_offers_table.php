<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('package_offers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_id')->constrained('services')->cascadeOnDelete();
            $table->string('offer_key');
            $table->string('plan_key')->nullable();
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('offer_type', ['percentage_discount', 'fixed_discount', 'bundle']);
            $table->decimal('discount_value', 10, 2)->nullable();
            $table->json('combo_plan_keys')->nullable();
            $table->decimal('combo_price', 12, 2)->nullable();
            $table->json('conditions')->nullable();
            $table->dateTime('starts_at')->nullable();
            $table->dateTime('ends_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('display_order')->default(0);
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->unique(['service_id', 'offer_key']);
            $table->index(['service_id', 'is_active', 'display_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('package_offers');
    }
};
