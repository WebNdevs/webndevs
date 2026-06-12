<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('comparison_entities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('comparison_page_id')->constrained('comparison_pages')->onDelete('cascade');
            $table->string('entity_type', 100);
            $table->unsignedBigInteger('entity_id');
            $table->integer('position')->default(0);
            $table->string('tag', 100)->nullable();

            $table->index('comparison_page_id');
            $table->index(['entity_type', 'entity_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('comparison_entities');
    }
};
