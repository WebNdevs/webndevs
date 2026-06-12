<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Changes pro_results and pro_tag columns from TEXT to JSON type
     * for proper array casting in Laravel
     */
    public function up(): void
    {
        Schema::table('content_items', function (Blueprint $table) {
            $table->json('pro_results')->nullable()->change();
            $table->json('pro_tag')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('content_items', function (Blueprint $table) {
            $table->text('pro_results')->nullable()->change();
            $table->text('pro_tag')->nullable()->change();
        });
    }
};