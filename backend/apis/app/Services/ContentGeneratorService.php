<?php

namespace App\Services;

use App\Jobs\GenerateCrossReferencePagesJob;
use App\Models\ContentGenerationJob;
use App\Models\Tool;
use App\Services\Prompts\ComparisonPrompt;
use App\Services\Prompts\ContentGapPrompt;
use App\Services\Prompts\CrossReferencePrompt;
use App\Services\Prompts\EntityOverviewPrompt;
use App\Services\Prompts\FaqPrompt;
use App\Services\Prompts\InternalLinksPrompt;
use App\Services\Prompts\MetaSeoPrompt;
use App\Services\Prompts\ProcessStepsPrompt;
use App\Services\Prompts\SolutionPagePrompt;
use App\Services\Prompts\UseCasesPrompt;
use Illuminate\Support\Arr;

class ContentGeneratorService
{
    /** Maps template keys to their prompt class. */
    private array $promptTemplates = [
        'entity_overview'    => EntityOverviewPrompt::class,
        'cross_reference'    => CrossReferencePrompt::class,
        'use_cases'          => UseCasesPrompt::class,
        'faq'                => FaqPrompt::class,
        'process_steps'      => ProcessStepsPrompt::class,
        'seo_meta'           => MetaSeoPrompt::class,
        'solution_page'      => SolutionPagePrompt::class,
        'comparison'         => ComparisonPrompt::class,
        'internal_links'     => InternalLinksPrompt::class,
        'content_gap_score'  => ContentGapPrompt::class,
    ];

    public function __construct(private readonly ClaudeAIService $claudeAIService)
    {
    }

    /**
     * Main entry point — builds the prompt from template, calls AI, logs the job.
     */
    public function generate(array $payload): array
    {
        $template = Arr::get($payload, 'prompt_template', 'default');
        $prompt   = $payload['prompt'] ?? $this->buildPrompt($template, $payload);

        $jobId = isset($payload['job_id']) ? (int) $payload['job_id'] : null;
        $job = $jobId ? ContentGenerationJob::query()->find($jobId) : null;

        if ($job) {
            $job->update([
                'prompt_template' => $template,
                'prompt_used' => $prompt,
                'status' => 'processing',
            ]);
        } else {
            // Create a pending job record first so we have the ID for token tracking
            $job = ContentGenerationJob::create([
                'entity_type'     => $payload['entity_type'],
                'entity_id'       => $payload['entity_id'],
                'section_key'     => $payload['section_key'],
                'prompt_template' => $template,
                'prompt_used'     => $prompt,
                'status'          => 'processing',
            ]);
        }

        $response = $this->claudeAIService->generate($prompt, null, $job->id);

        $job->update([
            'generated_content' => $response['content'],
            'tokens_input'      => $response['tokens_input'],
            'tokens_output'     => $response['tokens_output'],
            'model_used'        => $response['model'],
            'status'            => 'completed',
        ]);

        return [
            'job_id'        => $job->id,
            'content'       => $job->generated_content,
            'tokens_input'  => $job->tokens_input,
            'tokens_output' => $job->tokens_output,
            'model'         => $job->model_used,
            'cached'        => $response['cached'] ?? false,
        ];
    }

    // ------------------------------------------------------------------
    // Prompt dispatch — delegates to class-based templates where available
    // ------------------------------------------------------------------

    public function buildPrompt(string $template, array $ctx): string
    {
        if (isset($this->promptTemplates[$template])) {
            /** @var \App\Services\Prompts\PromptInterface $prompt */
            $prompt = app($this->promptTemplates[$template]);
            return $prompt->buildPrompt($ctx);
        }

        return match ($template) {
            'case_study_summary' => $this->caseStudySummaryPrompt($ctx),
            'freshness_review'   => $this->freshnessReviewPrompt($ctx),
            default              => $this->defaultPrompt($ctx),
        };
    }

    // Kept inline — not in the public prompt-template registry
    private function caseStudySummaryPrompt(array $ctx): string
    {
        $client    = $ctx['client_name'] ?? 'the client';
        $industry  = $ctx['industry'] ?? 'their industry';
        $tools     = implode(', ', (array) ($ctx['tools'] ?? ['the tools used']));
        $challenge = $ctx['challenge'] ?? 'a significant operational challenge';
        $metrics   = $ctx['metrics'] ?? [];
        $metricsText = '';
        foreach ($metrics as $m) {
            $metricsText .= "- {$m['label']}: {$m['before']} → {$m['after']}\n";
        }
        return <<<PROMPT
Write a compelling results summary for a case study.

Client: {$client} ({$industry})
Challenge: {$challenge}
Tools Used: {$tools}
Key Metrics:
{$metricsText}

Requirements:
- Open with the headline result (most impressive metric)
- Explain the before/after contrast concisely
- Mention 2-3 specific workflow improvements, not just the numbers
- Close with a forward-looking statement about ongoing impact
- Do NOT use phrases like "In conclusion" or "To summarize"

Length: 200-250 words. Tone: proud but factual.
PROMPT;
    }

    // P4-AI-18
    private function freshnessReviewPrompt(array $ctx): string
    {
        $pageTitle   = $ctx['page_title'] ?? 'the page';
        $lastUpdated = $ctx['last_updated'] ?? 'over 90 days ago';
        $content     = mb_substr($ctx['page_content'] ?? '', 0, 2000);
        return <<<PROMPT
Review the following page content for freshness and accuracy issues.
Page: "{$pageTitle}" (last updated: {$lastUpdated})

Content:
---
{$content}
---

Identify:
1. Any version numbers, pricing, or dates that may be outdated
2. Feature claims that may have changed (products evolve fast)
3. Statistical claims or benchmarks that should be reverified
4. Sections that would benefit from a 2025 update

Output as JSON:
{
  "freshness_score": 7,
  "issues": [
    {"type": "outdated_stat", "excerpt": "...", "suggestion": "..."},
    {"type": "pricing_change", "excerpt": "...", "suggestion": "..."}
  ],
  "update_priority": "high|medium|low",
  "summary": "2 sentences"
}
PROMPT;
    }

    private function defaultPrompt(array $ctx): string
    {
        return sprintf(
            'Write high-quality SEO content for a %s entity (ID: %d), section: %s. Be specific, practical, and conversion-focused. Length: 300-400 words.',
            $ctx['entity_type'],
            (int) ($ctx['entity_id'] ?? 0),
            $ctx['section_key'] ?? 'overview'
        );
    }

    /**
     * Queues cross-reference generation jobs for all missing combinations involving the given tool.
     */
    public function bulkGenerateCrossReferences(Tool $tool): void
    {
        GenerateCrossReferencePagesJob::dispatch($tool->id);
    }
}
