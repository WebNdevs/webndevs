<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('solution_tool_pivot', function (Blueprint $table) {
            $table->foreignId('solution_id')->constrained('solutions')->onDelete('cascade');
            $table->foreignId('tool_id')->constrained('tools')->onDelete('cascade');
            $table->enum('tool_role', ['primary', 'supporting', 'optional'])->default('supporting');
            $table->integer('sort_order')->default(0);
            $table->string('notes', 500)->nullable();

            $table->primary(['solution_id', 'tool_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('solution_tool_pivot');
    }
};
