<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('comparison_pages', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 300)->unique();
            $table->string('title', 500);
            $table->string('subtitle', 1000)->nullable();
            $table->text('quick_verdict')->nullable();
            $table->text('recommendation')->nullable();
            $table->longText('intro_content')->nullable();
            $table->enum('status', ['draft', 'published'])->default('draft');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('comparison_pages');
    }
};
