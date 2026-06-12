<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('content_gaps', function (Blueprint $table) {
            $table->id();
            $table->string('entity_a_type', 100);
            $table->unsignedBigInteger('entity_a_id');
            $table->string('entity_b_type', 100);
            $table->unsignedBigInteger('entity_b_id');
            $table->string('suggested_title', 500)->nullable();
            $table->unsignedTinyInteger('gap_score')->default(5);
            $table->text('rationale')->nullable();
            $table->enum('status', ['pending', 'created', 'ignored'])->default('pending');
            $table->timestamps();

            $table->index(['entity_a_type', 'entity_a_id']);
            $table->index('status');
            $table->index('gap_score');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('content_gaps');
    }
};
