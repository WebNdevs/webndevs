<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('content_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('content_section_id')->constrained()->onDelete('cascade');
            $table->string('item_key', 80)->nullable();
            $table->string('title', 255);
            $table->text('content')->nullable();
            $table->string('category')->nullable();
            $table->string('url')->nullable();
            $table->longText('description')->nullable();
            $table->json('results')->nullable();
            $table->json('tags')->nullable();
            $table->string('badge')->nullable();
            $table->string('avatar')->nullable();
            $table->string('client_name')->nullable();
            $table->string('client_role')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->json('custom_fields')->nullable();
            $table->string('external_id')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['content_section_id', 'sort_order']);
            $table->index(['content_section_id', 'is_featured']);
            $table->index('item_key');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('content_items');
    }
};