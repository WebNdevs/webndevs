<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('solutions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('industry_id')->nullable()->constrained('industries')->nullOnDelete();
            $table->foreignId('business_size_id')->nullable()->constrained('business_sizes')->nullOnDelete();
            $table->string('name', 300);
            $table->string('slug', 300)->unique();
            $table->string('tagline', 500)->nullable();
            $table->text('problem_statement')->nullable();
            $table->text('solution_summary')->nullable();
            $table->longText('workflow_description')->nullable();
            $table->json('key_benefits')->nullable();
            $table->text('technical_requirements')->nullable();
            $table->enum('status', ['draft', 'published'])->default('draft');
            $table->softDeletes();
            $table->timestamps();

            $table->index('industry_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('solutions');
    }
};
