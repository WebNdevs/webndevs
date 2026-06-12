<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\GenerateContentJob;
use App\Http\Requests\AiGenerateRequest;
use App\Models\ContentGenerationJob;
use App\Services\ClaudeAIService;
use App\Services\ContentGeneratorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AiContentController extends Controller
{
    public function __construct(
        private readonly ContentGeneratorService $generator,
        private readonly ClaudeAIService $claude,
    ) {}

    // P4-AI-19 — POST /api/admin/ai/generate
    public function generate(AiGenerateRequest $request): JsonResponse
    {
        $result = $this->generator->generate($request->validated());
        return response()->json($result);
    }

    // P4-AI-20 — POST /api/admin/ai/generate-stream (SSE)
    public function generateStream(AiGenerateRequest $request): StreamedResponse
    {
        $payload  = $request->validated();
        $template = $payload['prompt_template'] ?? 'default';
        $prompt   = $payload['prompt'] ?? $this->generator->buildPrompt($template, $payload);

        // Log a pending job so the client can track it
        $job = ContentGenerationJob::create([
            'entity_type'     => $payload['entity_type'],
            'entity_id'       => $payload['entity_id'],
            'section_key'     => $payload['section_key'],
            'prompt_template' => $template,
            'prompt_used'     => $prompt,
            'status'          => 'processing',
        ]);

        return $this->claude->stream(
            prompt: $prompt,
            onDone: fn($data) => $job->update(['status' => 'completed'])
        );
    }

    // P4-AI-21 — POST /api/admin/ai/bulk-generate (dispatches queued jobs)
    public function bulkGenerate(Request $request): JsonResponse
    {
        $data = $request->validate([
            'jobs'                      => ['required', 'array', 'min:1', 'max:50'],
            'jobs.*.entity_type'        => ['required', 'string', 'max:100'],
            'jobs.*.entity_id'          => ['required', 'integer', 'min:1'],
            'jobs.*.section_key'        => ['required', 'string', 'max:100'],
            'jobs.*.prompt_template'    => ['nullable', 'string', 'max:100'],
        ]);

        $created = [];
        foreach ($data['jobs'] as $jobData) {
            $job = ContentGenerationJob::create([
                'entity_type'     => $jobData['entity_type'],
                'entity_id'       => $jobData['entity_id'],
                'section_key'     => $jobData['section_key'],
                'prompt_template' => $jobData['prompt_template'] ?? 'default',
                'status'          => 'pending',
            ]);

            // P9-PERF-05 — queue AI generation jobs (Horizon-ready queue name: ai-generation)
            GenerateContentJob::dispatch(array_merge($jobData, ['job_id' => $job->id]));

            $created[] = $job;
        }

        return response()->json([
            'message'    => count($created) . ' jobs queued.',
            'jobs'       => $created,
            'total'      => count($created),
        ], 201);
    }

    // P4-AI-22 — GET /api/admin/ai/job/{id}
    public function jobStatus(ContentGenerationJob $contentGenerationJob): JsonResponse
    {
        return response()->json($contentGenerationJob);
    }

    // P4-AI-23 — POST /api/admin/ai/suggest-links
    public function suggestLinks(Request $request): JsonResponse
    {
        $data = $request->validate([
            'page_title'      => ['required', 'string', 'max:255'],
            'page_content'    => ['required', 'string'],
            'available_pages' => ['nullable', 'array'],
        ]);

        $result = $this->generator->generate([
            'entity_type'     => 'page',
            'entity_id'       => 0,
            'section_key'     => 'internal_links',
            'prompt_template' => 'internal_links',
            'page_title'      => $data['page_title'],
            'page_content'    => $data['page_content'],
            'available_pages' => $data['available_pages'] ?? [],
        ]);

        // Try to parse JSON from the AI output
        $suggestions = [];
        $raw = $result['content'] ?? '';
        $jsonStart = strpos($raw, '[');
        $jsonEnd   = strrpos($raw, ']');
        if ($jsonStart !== false && $jsonEnd !== false) {
            $parsed = json_decode(substr($raw, $jsonStart, $jsonEnd - $jsonStart + 1), true);
            $suggestions = is_array($parsed) ? $parsed : [];
        }

        return response()->json([
            'suggestions' => $suggestions,
            'job_id'      => $result['job_id'],
            'tokens_used' => ($result['tokens_input'] ?? 0) + ($result['tokens_output'] ?? 0),
        ]);
    }

    // P4-AI-24 — POST /api/admin/ai/find-gaps
    public function findGaps(Request $request): JsonResponse
    {
        $data = $request->validate([
            'entity_a_name' => ['required', 'string', 'max:255'],
            'entity_b_name' => ['required', 'string', 'max:255'],
        ]);

        $result = $this->generator->generate([
            'entity_type'     => 'content_gap',
            'entity_id'       => 0,
            'section_key'     => 'gap_score',
            'prompt_template' => 'content_gap_score',
            'entity_a_name'   => $data['entity_a_name'],
            'entity_b_name'   => $data['entity_b_name'],
        ]);

        $score = null;
        $raw = $result['content'] ?? '';
        $jsonStart = strpos($raw, '{');
        $jsonEnd   = strrpos($raw, '}');
        if ($jsonStart !== false && $jsonEnd !== false) {
            $parsed = json_decode(substr($raw, $jsonStart, $jsonEnd - $jsonStart + 1), true);
            $score = is_array($parsed) ? $parsed : null;
        }

        return response()->json([
            'gap_analysis' => $score,
            'raw_content'  => $raw,
            'job_id'       => $result['job_id'],
        ]);
    }

    // P4-AI-25 — POST /api/admin/ai/generate-seo
    public function generateSeo(Request $request): JsonResponse
    {
        $data = $request->validate([
            'entity_name'    => ['required', 'string', 'max:255'],
            'page_type'      => ['nullable', 'string', 'max:100'],
            'focus_keyword'  => ['nullable', 'string', 'max:255'],
        ]);

        $result = $this->generator->generate([
            'entity_type'    => 'seo',
            'entity_id'      => 0,
            'section_key'    => 'seo_meta',
            'prompt_template' => 'seo_meta',
            'entity_name'    => $data['entity_name'],
            'page_type'      => $data['page_type'] ?? 'page',
            'focus_keyword'  => $data['focus_keyword'] ?? $data['entity_name'],
        ]);

        $meta = null;
        $raw = $result['content'] ?? '';
        $jsonStart = strpos($raw, '{');
        $jsonEnd   = strrpos($raw, '}');
        if ($jsonStart !== false && $jsonEnd !== false) {
            $parsed = json_decode(substr($raw, $jsonStart, $jsonEnd - $jsonStart + 1), true);
            $meta = is_array($parsed) ? $parsed : null;
        }

        return response()->json([
            'meta'    => $meta,
            'raw'     => $raw,
            'job_id'  => $result['job_id'],
        ]);
    }

    // P4-AI-26 — POST /api/admin/ai/generate-faq
    public function generateFaq(Request $request): JsonResponse
    {
        $data = $request->validate([
            'entity_name'   => ['required', 'string', 'max:255'],
            'entity_b_name' => ['nullable', 'string', 'max:255'],
            'entity_type'   => ['nullable', 'string', 'max:100'],
            'entity_id'     => ['nullable', 'integer'],
        ]);

        $result = $this->generator->generate([
            'entity_type'     => $data['entity_type'] ?? 'tool',
            'entity_id'       => $data['entity_id'] ?? 0,
            'section_key'     => 'faq',
            'prompt_template' => 'faq',
            'entity_name'     => $data['entity_name'],
            'entity_b_name'   => $data['entity_b_name'] ?? null,
        ]);

        // Parse Q&A pairs from the output
        $faqs = [];
        $raw  = $result['content'] ?? '';
        preg_match_all('/Q:\s*(.+?)\nA:\s*(.+?)(?=\nQ:|\z)/s', $raw, $matches, PREG_SET_ORDER);
        foreach ($matches as $m) {
            $faqs[] = ['question' => trim($m[1]), 'answer' => trim($m[2])];
        }

        return response()->json([
            'faqs'   => $faqs,
            'raw'    => $raw,
            'job_id' => $result['job_id'],
        ]);
    }
}
