<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_page_contents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_id')->constrained('services')->cascadeOnDelete();
            $table->string('content_key');
            $table->string('label');
            $table->enum('content_type', ['text', 'rich_text', 'number', 'boolean', 'image', 'json', 'seo']);
            $table->json('value')->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('display_order')->default(0);
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->unique(['service_id', 'content_key']);
            $table->index(['service_id', 'display_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_page_contents');
    }
};
