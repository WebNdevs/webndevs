<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('singlepage_pages', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('category_slug')->nullable();
            $table->string('status')->default('draft');
            $table->string('seo_title')->nullable();
            $table->text('seo_description')->nullable();
            $table->string('meta_keywords')->nullable();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('singlepage_sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('singlepage_page_id')->constrained('singlepage_pages')->cascadeOnDelete();
            $table->string('section_key');
            $table->string('section_type');
            $table->json('data')->nullable();
            $table->boolean('is_visible')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->unique(['singlepage_page_id', 'section_key']);
        });

        Schema::create('singlepage_section_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('singlepage_section_id')->constrained('singlepage_sections')->cascadeOnDelete();
            $table->json('data')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('singlepage_section_items');
        Schema::dropIfExists('singlepage_sections');
        Schema::dropIfExists('singlepage_pages');
    }
};
