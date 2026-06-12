<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('automation_tools', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tool_id')->unique()->constrained('tools')->onDelete('cascade');
            $table->boolean('supports_triggers')->default(true);
            $table->boolean('supports_actions')->default(true);
            $table->boolean('supports_webhooks')->default(false);
            $table->boolean('supports_custom_code')->default(false);
            $table->boolean('api_available')->default(true);
            $table->string('status', 20)->default('draft');
            $table->softDeletes();
            $table->timestamps();

            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('automation_tools');
    }
};
