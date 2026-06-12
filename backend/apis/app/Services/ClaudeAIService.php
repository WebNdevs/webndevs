<?php

namespace App\Services;

use App\Models\ContentGenerationJob;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ClaudeAIService
{
    private const DEFAULT_MODEL = 'claude-sonnet-4-6';
    private const MAX_TOKENS = 2048;
    private const CACHE_TTL = 86400; // 24 hours
    private const API_URL = 'https://api.anthropic.com/v1/messages';

    private function apiKey(): string
    {
        return (string) config('services.anthropic.api_key', env('ANTHROPIC_API_KEY', ''));
    }

    private function model(?string $model = null): string
    {
        return $model ?: (string) config('services.anthropic.model', self::DEFAULT_MODEL);
    }

    private function headers(): array
    {
        return [
            'x-api-key'         => $this->apiKey(),
            'anthropic-version' => '2023-06-01',
            'Content-Type'      => 'application/json',
        ];
    }

    /**
     * P4-AI-01 — Standard (non-streaming) generation with 24h cache.
     * P4-AI-03 — Logs token usage to ContentGenerationJob when job_id provided.
     * P4-AI-05 — Cache key: sha256 of model + prompt.
     */
    public function generate(string $prompt, ?string $model = null, ?int $jobId = null): array
    {
        $resolvedModel = $this->model($model);
        $cacheKey = 'ai:' . sha1($resolvedModel . $prompt);

        if (Cache::has($cacheKey)) {
            $cached = Cache::get($cacheKey);
            $cached['cached'] = true;
            return $cached;
        }

        if ($this->apiKey() === '') {
            return $this->placeholderResponse($resolvedModel, $prompt);
        }

        try {
            $response = Http::withHeaders($this->headers())
                ->timeout(60)
                ->post(self::API_URL, [
                    'model'      => $resolvedModel,
                    'max_tokens' => self::MAX_TOKENS,
                    'system'     => $this->systemPrompt(),
                    'messages'   => [['role' => 'user', 'content' => $prompt]],
                ]);

            if (!$response->successful()) {
                Log::error('ClaudeAI API error', ['status' => $response->status(), 'body' => $response->body()]);
                return $this->placeholderResponse($resolvedModel, $prompt, 'API error: ' . $response->status());
            }

            $json = $response->json();
            $result = [
                'content'       => data_get($json, 'content.0.text', ''),
                'model'         => $resolvedModel,
                'tokens_input'  => data_get($json, 'usage.input_tokens'),
                'tokens_output' => data_get($json, 'usage.output_tokens'),
                'cached'        => false,
                'raw'           => $json,
            ];

            Cache::put($cacheKey, $result, self::CACHE_TTL);

            // P4-AI-03 — track token usage
            if ($jobId) {
                ContentGenerationJob::where('id', $jobId)->update([
                    'tokens_input'  => $result['tokens_input'],
                    'tokens_output' => $result['tokens_output'],
                    'model_used'    => $resolvedModel,
                    'status'        => 'completed',
                ]);
            }

            return $result;

        } catch (\Throwable $e) {
            Log::error('ClaudeAI exception', ['message' => $e->getMessage()]);
            return $this->placeholderResponse($resolvedModel, $prompt, $e->getMessage());
        }
    }

    /**
     * P4-AI-02 — Streaming generation via Server-Sent Events.
     * Returns a StreamedResponse that pushes tokens as they arrive.
     */
    public function stream(string $prompt, ?string $model = null, ?callable $onDone = null): StreamedResponse
    {
        $resolvedModel = $this->model($model);

        return new StreamedResponse(function () use ($prompt, $resolvedModel, $onDone) {
            if ($this->apiKey() === '') {
                $placeholder = 'AI key is not configured. ' . $prompt;
                foreach (str_split($placeholder, 8) as $chunk) {
                    echo "data: " . json_encode(['type' => 'content_block_delta', 'delta' => ['text' => $chunk]]) . "\n\n";
                    ob_flush();
                    flush();
                    usleep(50000);
                }
                echo "data: " . json_encode(['type' => 'message_stop']) . "\n\n";
                ob_flush();
                flush();
                return;
            }

            $ch = curl_init();
            curl_setopt_array($ch, [
                CURLOPT_URL            => self::API_URL,
                CURLOPT_POST           => true,
                CURLOPT_HTTPHEADER     => array_merge(
                    array_map(fn($k, $v) => "$k: $v", array_keys($this->headers()), $this->headers()),
                    ['anthropic-beta: messages-2023-06-01']
                ),
                CURLOPT_POSTFIELDS     => json_encode([
                    'model'      => $resolvedModel,
                    'max_tokens' => self::MAX_TOKENS,
                    'stream'     => true,
                    'system'     => $this->systemPrompt(),
                    'messages'   => [['role' => 'user', 'content' => $prompt]],
                ]),
                CURLOPT_WRITEFUNCTION  => function ($curl, $data) use ($onDone) {
                    $lines = explode("\n", $data);
                    foreach ($lines as $line) {
                        $line = trim($line);
                        if (str_starts_with($line, 'data: ')) {
                            $json = json_decode(substr($line, 6), true);
                            if ($json && $json['type'] === 'content_block_delta') {
                                echo "data: " . json_encode($json) . "\n\n";
                                ob_flush();
                                flush();
                            }
                            if ($json && $json['type'] === 'message_stop' && $onDone) {
                                $onDone($json);
                            }
                        }
                    }
                    return strlen($data);
                },
                CURLOPT_RETURNTRANSFER => false,
                CURLOPT_TIMEOUT        => 120,
            ]);

            curl_exec($ch);
            curl_close($ch);

            echo "data: " . json_encode(['type' => 'message_stop']) . "\n\n";
            ob_flush();
            flush();

        }, 200, [
            'Content-Type'  => 'text/event-stream',
            'Cache-Control' => 'no-cache',
            'X-Accel-Buffering' => 'no',
        ]);
    }

    /**
     * Invalidate the 24h cache for a specific prompt (called when content is edited).
     */
    public function invalidateCache(string $prompt, ?string $model = null): void
    {
        Cache::forget('ai:' . sha1($this->model($model) . $prompt));
    }

    private function systemPrompt(): string
    {
        return 'You are an expert SEO content writer for a digital agency that specialises in tool integrations, automation, and CRM implementations. Write factual, structured, conversion-focused content. Use clear headers, numbered lists, and direct language. Never hallucinate product features.';
    }

    private function placeholderResponse(string $model, string $prompt, string $reason = ''): array
    {
        return [
            'content'       => 'Placeholder content — AI key not configured' . ($reason ? ": $reason" : '') . '. Prompt: ' . mb_substr($prompt, 0, 80) . '...',
            'model'         => $model,
            'tokens_input'  => null,
            'tokens_output' => null,
            'cached'        => false,
            'raw'           => null,
        ];
    }
}
