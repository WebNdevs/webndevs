<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_inquiries', function (Blueprint $table) {
            $table->id();
            $table->string('service_slug', 160);
            $table->string('plan_key', 120)->nullable();
            $table->string('plan_name', 160)->nullable();
            $table->string('name', 120);
            $table->string('email', 255);
            $table->string('phone', 60)->nullable();
            $table->string('company', 120)->nullable();
            $table->string('budget', 120)->nullable();
            $table->text('project_brief');
            $table->string('status', 40)->default('new');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_inquiries');
    }
};
