<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_template_fields', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_id')->constrained('services')->cascadeOnDelete();
            $table->string('field_key');
            $table->string('label');
            $table->enum('field_type', ['text', 'long_text', 'number', 'boolean', 'image', 'json']);
            $table->boolean('is_required')->default(false);
            $table->json('default_value')->nullable();
            $table->json('options')->nullable();
            $table->unsignedInteger('display_order')->default(0);
            $table->timestamps();

            $table->unique(['service_id', 'field_key']);
            $table->index(['service_id', 'display_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_template_fields');
    }
};
