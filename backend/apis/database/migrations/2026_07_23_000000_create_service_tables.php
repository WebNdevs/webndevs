<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('service_pages')) {
            Schema::create('service_pages', function (Blueprint $table) {
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
        }

        if (!Schema::hasTable('service_sections')) {
            Schema::create('service_sections', function (Blueprint $table) {
                $table->id();
                $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
                $table->foreignId('service_page_id')->constrained('service_pages')->cascadeOnDelete();
                $table->string('section_key');
                $table->string('section_type');
                $table->json('data')->nullable();
                $table->boolean('is_visible')->default(true);
                $table->unsignedInteger('sort_order')->default(0);
                $table->timestamps();

                $table->unique(['service_page_id', 'section_key']);
            });
        }

        if (!Schema::hasTable('service_section_items')) {
            Schema::create('service_section_items', function (Blueprint $table) {
                $table->id();
                $table->foreignId('service_section_id')->constrained('service_sections')->cascadeOnDelete();
                $table->json('data')->nullable();
                $table->boolean('is_active')->default(true);
                $table->boolean('is_featured')->default(false);
                $table->integer('sort_order')->default(0);
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('service_section_items');
        Schema::dropIfExists('service_sections');
        Schema::dropIfExists('service_pages');
    }
};