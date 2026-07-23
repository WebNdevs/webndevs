<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('article_pages', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('status')->default('draft');
            $table->string('seo_title')->nullable();
            $table->text('seo_description')->nullable();
            $table->string('meta_keywords')->nullable();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('article_sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('article_page_id')->constrained('article_pages')->cascadeOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('section_key');
            $table->string('section_type');
            $table->json('data')->nullable();
            $table->boolean('is_visible')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->unique(['article_page_id', 'section_key']);
        });

        Schema::create('article_section_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('article_section_id')->constrained('article_sections')->cascadeOnDelete();
            $table->json('data')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('article_section_items');
        Schema::dropIfExists('article_sections');
        Schema::dropIfExists('article_pages');
    }
};
