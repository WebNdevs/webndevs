<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('comparison_features', function (Blueprint $table) {
            $table->id();
            $table->foreignId('comparison_page_id')->constrained('comparison_pages')->onDelete('cascade');
            $table->string('feature_name', 300);
            $table->string('category', 100)->nullable();
            $table->json('values');
            $table->boolean('is_highlighted')->default(false);
            $table->integer('sort_order')->default(0);

            $table->index('comparison_page_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('comparison_features');
    }
};
