<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('package_offers', 'plan_key')) {
            return;
        }

        Schema::table('package_offers', function (Blueprint $table) {
            $table->string('plan_key')->nullable()->after('offer_key');
        });
    }

    public function down(): void
    {
        if (! Schema::hasColumn('package_offers', 'plan_key')) {
            return;
        }

        Schema::table('package_offers', function (Blueprint $table) {
            $table->dropColumn('plan_key');
        });
    }
};
