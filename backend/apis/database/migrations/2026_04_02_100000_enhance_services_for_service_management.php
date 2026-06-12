<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->unsignedInteger('duration_minutes')->nullable()->after('base_price');
            $table->json('availability_schedule')->nullable()->after('description');
            $table->boolean('booking_enabled')->default(true)->after('availability_schedule');
            $table->json('custom_attributes')->nullable()->after('booking_enabled');
        });
    }

    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn([
                'duration_minutes',
                'availability_schedule',
                'booking_enabled',
                'custom_attributes',
            ]);
        });
    }
};
