<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('content_items', function (Blueprint $table) {
            if (!Schema::hasColumn('content_items', 'company')) {
                $table->string('company', 200)->nullable()->after('client_role');
            }
            if (!Schema::hasColumn('content_items', 'rating')) {
                $table->decimal('rating', 3, 2)->nullable()->after('company');
            }
            if (!Schema::hasColumn('content_items', 'results')) {
                $table->json('results')->nullable()->change();
            }
            if (!Schema::hasColumn('content_items', 'tags')) {
                $table->json('tags')->nullable()->change();
            }
            if (!Schema::hasColumn('content_items', 'number')) {
                $table->integer('number')->nullable()->default(0)->after('sort_order');
            }
        });
    }

    public function down(): void
    {
        Schema::table('content_items', function (Blueprint $table) {
            if (Schema::hasColumn('content_items', 'company')) {
                $table->dropColumn('company');
            }
            if (Schema::hasColumn('content_items', 'rating')) {
                $table->dropColumn('rating');
            }
        });
    }
};