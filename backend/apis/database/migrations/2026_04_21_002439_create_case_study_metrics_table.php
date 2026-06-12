<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('case_study_metrics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('case_study_id')->constrained('case_studies')->onDelete('cascade');
            $table->string('label', 200);
            $table->string('before_value', 100);
            $table->string('after_value', 100);
            $table->string('unit', 50)->nullable();
            $table->string('improvement', 100)->nullable();
            $table->integer('sort_order')->default(0);

            $table->index('case_study_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('case_study_metrics');
    }
};
