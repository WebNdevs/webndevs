<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('free_tools', function (Blueprint $table) {
            $table->id();
            $table->string('name', 300);
            $table->string('slug', 200)->unique();
            $table->enum('type', ['calculator', 'quiz', 'audit', 'estimator']);
            $table->text('description')->nullable();
            $table->json('config');
            $table->boolean('is_active')->default(true);
            $table->string('cta_text', 300)->nullable();
            $table->text('thank_you_message')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('free_tools');
    }
};
