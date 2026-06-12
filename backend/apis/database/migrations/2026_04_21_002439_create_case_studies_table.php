<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('case_studies', function (Blueprint $table) {
            $table->id();
            $table->string('title', 500);
            $table->string('slug', 300)->unique();
            $table->string('client_name', 200);
            $table->string('client_industry', 200)->nullable();
            $table->string('client_logo_url', 500)->nullable();
            $table->text('challenge');
            $table->longText('solution');
            $table->text('results_summary');
            $table->string('timeline', 100)->nullable();
            $table->string('featured_image_url', 500)->nullable();
            $table->boolean('is_featured')->default(false);
            $table->enum('status', ['draft', 'published'])->default('draft');
            $table->timestamp('published_at')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->index('status');
            $table->index('is_featured');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('case_studies');
    }
};
