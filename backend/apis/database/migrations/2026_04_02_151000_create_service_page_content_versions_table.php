<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('service_page_contents', function (Blueprint $table) {
            $table->string('section_key', 80)->default('legacy')->after('service_id');
            $table->string('locale', 16)->default('en')->after('section_key');
            $table->enum('status', ['draft', 'published'])->default('draft')->after('locale');

            $table->dropUnique('service_page_contents_service_id_content_key_unique');
            $table->unique(['service_id', 'section_key', 'content_key', 'locale', 'status'], 'service_page_content_unique');
            $table->index(['service_id', 'locale', 'status', 'section_key'], 'service_page_content_lookup');
        });

        Schema::create('service_page_content_versions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_id')->constrained('services')->cascadeOnDelete();
            $table->string('locale', 16)->default('en');
            $table->unsignedInteger('version_number');
            $table->enum('stage', ['draft', 'published'])->default('draft');
            $table->string('change_type', 40)->default('sync');
            $table->json('snapshot');
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['service_id', 'locale', 'stage', 'version_number'], 'spcv_lookup');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_page_content_versions');

        Schema::table('service_page_contents', function (Blueprint $table) {
            $table->dropIndex('service_page_content_lookup');
            $table->dropUnique('service_page_content_unique');
            $table->dropColumn(['section_key', 'locale', 'status']);
            $table->unique(['service_id', 'content_key']);
        });
    }
};
