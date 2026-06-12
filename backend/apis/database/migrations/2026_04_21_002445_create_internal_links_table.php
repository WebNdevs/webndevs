<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('internal_links', function (Blueprint $table) {
            $table->id();
            $table->string('source_entity_type', 100);
            $table->unsignedBigInteger('source_entity_id');
            $table->string('target_entity_type', 100);
            $table->unsignedBigInteger('target_entity_id');
            $table->string('anchor_text', 300)->nullable();
            $table->text('context_snippet')->nullable();
            $table->boolean('is_confirmed')->default(false);
            $table->boolean('is_auto_generated')->default(true);
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamps();

            $table->index(['source_entity_type', 'source_entity_id']);
            $table->index('is_confirmed');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('internal_links');
    }
};
