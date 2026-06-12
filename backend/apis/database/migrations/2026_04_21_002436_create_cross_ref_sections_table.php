<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cross_ref_sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cross_reference_page_id')->constrained('cross_reference_pages')->onDelete('cascade');
            $table->string('section_key', 100);
            $table->string('title', 500)->nullable();
            $table->longText('content')->nullable();
            $table->json('data')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_visible')->default(true);
            $table->boolean('ai_generated')->default(false);
            $table->timestamps();

            $table->index('section_key');
            $table->index('cross_reference_page_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cross_ref_sections');
    }
};
