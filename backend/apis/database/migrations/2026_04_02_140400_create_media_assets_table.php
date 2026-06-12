<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('media_assets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('media_folder_id')->nullable()->constrained('media_folders')->nullOnDelete();
            $table->foreignId('service_id')->nullable()->constrained('services')->nullOnDelete();
            $table->foreignId('service_category_id')->nullable()->constrained('service_categories')->nullOnDelete();
            $table->string('title')->nullable();
            $table->string('alt_text')->nullable();
            $table->text('caption')->nullable();
            $table->string('file_name');
            $table->string('disk')->default('public');
            $table->string('path');
            $table->string('url');
            $table->string('mime_type', 120)->nullable();
            $table->unsignedBigInteger('size_bytes')->default(0);
            $table->unsignedInteger('width')->nullable();
            $table->unsignedInteger('height')->nullable();
            $table->json('tags')->nullable();
            $table->json('optimization_meta')->nullable();
            $table->boolean('is_optimized')->default(false);
            $table->unsignedInteger('display_order')->default(0);
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['service_id', 'service_category_id']);
            $table->index(['media_folder_id', 'display_order']);
            $table->index(['mime_type', 'is_optimized']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('media_assets');
    }
};
