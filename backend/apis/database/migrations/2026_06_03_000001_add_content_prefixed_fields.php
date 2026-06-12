<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Adds prefixed fields for section types and item types as per jsonformat.md
     */
    public function up(): void
    {
        // Add heading-text fields to content_sections
        Schema::table('content_sections', function (Blueprint $table) {
            $table->string('description', 1000)->nullable()->after('content');
            $table->string('tag', 100)->nullable()->after('description');
            $table->string('subheading1', 255)->nullable()->after('tag');
            $table->string('subheading2', 255)->nullable()->after('subheading1');
            $table->text('subtext')->nullable()->after('subheading2');
            
            // Add approach-table fields
            $table->string('left_heading', 255)->nullable()->after('subtext');
            $table->string('right_heading', 255)->nullable()->after('left_heading');
            $table->json('left_points')->nullable()->after('right_heading');
            $table->json('right_points')->nullable()->after('left_points');
        });

        // Add prefixed item fields to content_items
        Schema::table('content_items', function (Blueprint $table) {
            // Q&A fields
            $table->text('question')->nullable()->after('external_id');
            $table->text('answer')->nullable()->after('question');
            
            // Project (Pro) fields
            $table->string('pro_name', 255)->nullable()->after('answer');
            $table->string('pro_category', 255)->nullable()->after('pro_name');
            $table->string('pro_url', 500)->nullable()->after('pro_category');
            $table->text('pro_description')->nullable()->after('pro_url');
            $table->json('pro_results')->nullable()->after('pro_description');
            $table->json('pro_tag')->nullable()->after('pro_results');
            $table->string('pro_badge', 100)->nullable()->after('pro_tag');
            
            // Testimonial (Test) fields
            $table->string('test_name', 255)->nullable()->after('pro_badge');
            $table->string('test_company', 255)->nullable()->after('test_name');
            $table->string('test_role', 255)->nullable()->after('test_company');
            $table->text('test_description')->nullable()->after('test_role');
            $table->string('test_url', 500)->nullable()->after('test_description');
            $table->unsignedTinyInteger('test_rate')->nullable()->default(5)->after('test_url');
            
            // Data Tile fields
            $table->string('tile_name', 255)->nullable()->after('test_rate');
            $table->string('tile_url', 500)->nullable()->after('tile_name');
            $table->text('tile_description')->nullable()->after('tile_url');
            
            // Service Card (Ser) fields
            $table->string('ser_name', 255)->nullable()->after('tile_description');
            $table->string('ser_url', 500)->nullable()->after('ser_name');
            $table->text('ser_description')->nullable()->after('ser_url');
            $table->string('ser_icon', 100)->nullable()->after('ser_description');
            $table->text('ser_tag')->nullable()->after('ser_icon');
            
            // Choose Card (cc) fields
            $table->string('cc_name', 255)->nullable()->after('ser_tag');
            $table->text('cc_description')->nullable()->after('cc_name');
            $table->string('cc_icon', 100)->nullable()->after('cc_description');
            
            // Process Card (pc) fields
            $table->string('pc_name', 255)->nullable()->after('cc_icon');
            $table->string('pc_number', 50)->nullable()->after('pc_name');
            $table->text('pc_description')->nullable()->after('pc_number');
            $table->string('pc_icon', 100)->nullable()->after('pc_description');
            $table->string('pc_timeline', 100)->nullable()->after('pc_icon');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('content_sections', function (Blueprint $table) {
            $table->dropColumn([
                'description',
                'tag',
                'subheading1',
                'subheading2',
                'subtext',
                'left_heading',
                'right_heading',
                'left_points',
                'right_points',
            ]);
        });

        Schema::table('content_items', function (Blueprint $table) {
            $table->dropColumn([
                'question',
                'answer',
                'pro_name',
                'pro_category',
                'pro_url',
                'pro_description',
                'pro_results',
                'pro_tag',
                'pro_badge',
                'test_name',
                'test_company',
                'test_role',
                'test_description',
                'test_url',
                'test_rate',
                'tile_name',
                'tile_url',
                'tile_description',
                'ser_name',
                'ser_url',
                'ser_description',
                'ser_icon',
                'ser_tag',
                'cc_name',
                'cc_description',
                'cc_icon',
                'pc_name',
                'pc_number',
                'pc_description',
                'pc_icon',
                'pc_timeline',
            ]);
        });
    }
};