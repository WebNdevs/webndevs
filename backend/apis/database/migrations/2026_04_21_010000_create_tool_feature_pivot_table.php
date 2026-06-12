<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tool_feature_pivot', function (Blueprint $table) {
            $table->foreignId('tool_id')->constrained('tools')->onDelete('cascade');
            $table->foreignId('feature_id')->constrained('features')->onDelete('cascade');

            $table->primary(['tool_id', 'feature_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tool_feature_pivot');
    }
};
