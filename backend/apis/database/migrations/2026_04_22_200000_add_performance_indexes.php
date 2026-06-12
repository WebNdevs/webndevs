<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private function existingIndexNames(string $table): array
    {
        return array_map(
            fn ($idx) => $idx['name'],
            Schema::getIndexes($table)
        );
    }

    private function addIndexIfMissing(string $table, string $column, string $indexName): void
    {
        if (in_array($indexName, $this->existingIndexNames($table), true)) {
            return;
        }
        Schema::table($table, function (Blueprint $t) use ($column) {
            $t->index($column);
        });
    }

    public function up(): void
    {
        $this->addIndexIfMissing('tools', 'slug', 'tools_slug_index');
        $this->addIndexIfMissing('tools', 'status', 'tools_status_index');

        $this->addIndexIfMissing('industries', 'slug', 'industries_slug_index');
        $this->addIndexIfMissing('industries', 'status', 'industries_status_index');

        $this->addIndexIfMissing('solutions', 'slug', 'solutions_slug_index');
        $this->addIndexIfMissing('solutions', 'status', 'solutions_status_index');

        $this->addIndexIfMissing('comparison_pages', 'slug', 'comparison_pages_slug_index');
        $this->addIndexIfMissing('comparison_pages', 'status', 'comparison_pages_status_index');

        $this->addIndexIfMissing('case_studies', 'slug', 'case_studies_slug_index');
        $this->addIndexIfMissing('case_studies', 'status', 'case_studies_status_index');

        $this->addIndexIfMissing('blog_posts', 'slug', 'blog_posts_slug_index');
        $this->addIndexIfMissing('blog_posts', 'status', 'blog_posts_status_index');

        $this->addIndexIfMissing('faqs', 'entity_type', 'faqs_entity_type_index');
        $this->addIndexIfMissing('process_steps', 'entity_type', 'process_steps_entity_type_index');
        $this->addIndexIfMissing('use_cases', 'entity_type', 'use_cases_entity_type_index');
        $this->addIndexIfMissing('seo_metadata', 'entity_type', 'seo_metadata_entity_type_index');
    }

    public function down(): void
    {
        $drops = [
            'tools'            => ['slug', 'status'],
            'industries'       => ['slug', 'status'],
            'solutions'        => ['slug', 'status'],
            'comparison_pages' => ['slug', 'status'],
            'case_studies'     => ['slug', 'status'],
            'blog_posts'       => ['slug', 'status'],
            'faqs'             => ['entity_type'],
            'process_steps'    => ['entity_type'],
            'use_cases'        => ['entity_type'],
            'seo_metadata'     => ['entity_type'],
        ];

        foreach ($drops as $table => $columns) {
            $existing = $this->existingIndexNames($table);
            Schema::table($table, function (Blueprint $t) use ($columns, $table, $existing) {
                foreach ($columns as $col) {
                    $indexName = "{$table}_{$col}_index";
                    if (in_array($indexName, $existing, true)) {
                        $t->dropIndex([$col]);
                    }
                }
            });
        }
    }
};
