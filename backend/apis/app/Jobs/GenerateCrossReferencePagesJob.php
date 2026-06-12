<?php

namespace App\Jobs;

use App\Models\CrossReferencePage;
use App\Models\Industry;
use App\Models\Tool;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class GenerateCrossReferencePagesJob implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    public int $timeout = 60;
    public int $tries = 1;

    public function __construct(private readonly int $toolId)
    {
        $this->onQueue('ai-generation');
    }

    public function handle(): void
    {
        $tool = Tool::find($this->toolId);
        if (! $tool) {
            return;
        }

        // Tool × Industry combinations
        $industries = Industry::where('status', 'published')->get();
        foreach ($industries as $industry) {
            $exists = CrossReferencePage::query()
                ->where('entity_a_type', Tool::class)
                ->where('entity_a_id', $tool->id)
                ->where('entity_b_type', Industry::class)
                ->where('entity_b_id', $industry->id)
                ->exists();

            if (! $exists) {
                GenerateContentJob::dispatch([
                    'entity_type'     => 'cross_reference',
                    'entity_id'       => $tool->id,
                    'section_key'     => 'overview',
                    'prompt_template' => 'cross_reference',
                    'entity_a_type'   => Tool::class,
                    'entity_a_id'     => $tool->id,
                    'entity_a_name'   => $tool->name,
                    'entity_b_type'   => Industry::class,
                    'entity_b_id'     => $industry->id,
                    'entity_b_name'   => $industry->name,
                ]);
            }
        }

        // Tool × Tool combinations (other published tools, excluding self)
        $otherTools = Tool::where('status', 'published')
            ->where('id', '!=', $tool->id)
            ->get();

        foreach ($otherTools as $other) {
            $exists = CrossReferencePage::query()
                ->where(function ($q) use ($tool, $other) {
                    $q->where('entity_a_type', Tool::class)
                      ->where('entity_a_id', $tool->id)
                      ->where('entity_b_type', Tool::class)
                      ->where('entity_b_id', $other->id);
                })
                ->orWhere(function ($q) use ($tool, $other) {
                    $q->where('entity_a_type', Tool::class)
                      ->where('entity_a_id', $other->id)
                      ->where('entity_b_type', Tool::class)
                      ->where('entity_b_id', $tool->id);
                })
                ->exists();

            if (! $exists) {
                GenerateContentJob::dispatch([
                    'entity_type'     => 'cross_reference',
                    'entity_id'       => $tool->id,
                    'section_key'     => 'overview',
                    'prompt_template' => 'cross_reference',
                    'entity_a_type'   => Tool::class,
                    'entity_a_id'     => $tool->id,
                    'entity_a_name'   => $tool->name,
                    'entity_b_type'   => Tool::class,
                    'entity_b_id'     => $other->id,
                    'entity_b_name'   => $other->name,
                ]);
            }
        }
    }
}
