<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('content_sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('content_page_id')->constrained('content_pages')->cascadeOnDelete();
            $table->string('section_key');
            $table->string('section_type');
            $table->string('name')->nullable();
            $table->string('title');
            $table->longText('content')->nullable();
            $table->boolean('is_visible')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->json('fields')->nullable();
            $table->unsignedBigInteger('sync_version')->default(1);
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->unique(['content_page_id', 'section_key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('content_sections');
    }
};
