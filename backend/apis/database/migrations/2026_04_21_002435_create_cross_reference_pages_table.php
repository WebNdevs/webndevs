<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cross_reference_pages', function (Blueprint $table) {
            $table->id();
            $table->string('entity_a_type', 100);
            $table->unsignedBigInteger('entity_a_id');
            $table->string('entity_b_type', 100);
            $table->unsignedBigInteger('entity_b_id');
            $table->string('entity_c_type', 100)->nullable();
            $table->unsignedBigInteger('entity_c_id')->nullable();
            $table->string('slug', 500)->unique();
            $table->string('url_path', 500)->unique();
            $table->string('title', 500);
            $table->string('subtitle', 1000)->nullable();
            $table->text('quick_answer')->nullable();
            $table->string('meta_title', 200)->nullable();
            $table->string('meta_description', 500)->nullable();
            $table->string('og_image_url', 500)->nullable();
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->timestamp('published_at')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->index(['entity_a_type', 'entity_a_id']);
            $table->index(['entity_b_type', 'entity_b_id']);
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cross_reference_pages');
    }
};
