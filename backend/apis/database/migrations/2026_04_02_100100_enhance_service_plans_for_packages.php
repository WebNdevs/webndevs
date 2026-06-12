<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('service_plans', function (Blueprint $table) {
            $table->foreignId('parent_plan_id')->nullable()->after('service_id')->constrained('service_plans')->nullOnDelete();
            $table->unsignedInteger('max_duration_days')->nullable()->after('delivery_days');
            $table->json('custom_config')->nullable()->after('features');
            $table->unsignedInteger('max_revisions')->nullable()->after('custom_config');
            $table->json('comparison_points')->nullable()->after('max_revisions');
        });
    }

    public function down(): void
    {
        Schema::table('service_plans', function (Blueprint $table) {
            $table->dropConstrainedForeignId('parent_plan_id');
            $table->dropColumn([
                'max_duration_days',
                'custom_config',
                'max_revisions',
                'comparison_points',
            ]);
        });
    }
};
