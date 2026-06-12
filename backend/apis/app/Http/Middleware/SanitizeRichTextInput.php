<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SanitizeRichTextInput
{
    /**
     * Keys that can contain HTML/rich content and must be sanitized for XSS.
     */
    private const RICH_TEXT_KEY_PARTS = [
        'content',
        'description',
        'excerpt',
        'body',
        'summary',
        'message',
        'answer',
        'quote',
        'html',
        'notes',
    ];

    public function handle(Request $request, Closure $next): Response
    {
        $request->merge($this->sanitizePayload($request->all()));

        return $next($request);
    }

    /**
     * @param  array<string, mixed>  $payload
     * @return array<string, mixed>
     */
    private function sanitizePayload(array $payload, string $path = ''): array
    {
        $sanitized = [];

        foreach ($payload as $key => $value) {
            $currentPath = $path === '' ? (string) $key : "{$path}.{$key}";
            $sanitized[$key] = $this->sanitizeValue($value, $currentPath);
        }

        return $sanitized;
    }

    private function sanitizeValue(mixed $value, string $path): mixed
    {
        if (is_array($value)) {
            return $this->sanitizePayload($value, $path);
        }

        if (! is_string($value) || ! $this->shouldSanitize($path)) {
            return $value;
        }

        return $this->sanitizeRichText($value);
    }

    private function shouldSanitize(string $path): bool
    {
        $parts = explode('.', strtolower($path));

        foreach ($parts as $part) {
            if (in_array($part, self::RICH_TEXT_KEY_PARTS, true)) {
                return true;
            }
        }

        return false;
    }

    private function sanitizeRichText(string $value): string
    {
        $sanitized = preg_replace('#<(script|style)\b[^>]*>.*?</\1>#is', '', $value) ?? $value;
        $sanitized = preg_replace('/on[a-z]+\s*=\s*("|\').*?\1/isu', '', $sanitized) ?? $sanitized;
        $sanitized = preg_replace('/javascript\s*:/iu', '', $sanitized) ?? $sanitized;

        return $sanitized;
    }
}
