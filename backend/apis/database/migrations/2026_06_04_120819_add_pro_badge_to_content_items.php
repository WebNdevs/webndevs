<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('content_items', function (Blueprint $table) {
            $columns = Schema::getColumnListing('content_items');
            if (!in_array('pro_badge', $columns)) {
                $table->string('pro_badge', 100)->nullable()->after('pro_tag');
            }
        });
    }

    public function down(): void
    {
        Schema::table('content_items', function (Blueprint $table) {
            if (Schema::hasColumn('content_items', 'pro_badge')) {
                $table->dropColumn('pro_badge');
            }
        });
    }
};