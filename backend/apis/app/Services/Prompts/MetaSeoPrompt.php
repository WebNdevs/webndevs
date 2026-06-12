<?php

namespace App\Services\Prompts;

class MetaSeoPrompt extends BasePrompt
{
    public function buildPrompt(array $context): string
    {
        $name     = $context['entity_name']    ?? $context['entity_type'] ?? 'the page';
        $pageType = $context['page_type']      ?? 'integration';
        $keyword  = $context['focus_keyword']  ?? "{$name} integration";

        return <<<PROMPT
Generate SEO metadata for a {$pageType} page about {$name}.
Focus keyword: "{$keyword}"

Output EXACTLY this JSON structure (no extra text):
{
  "meta_title": "...",
  "meta_description": "...",
  "og_title": "...",
  "og_description": "..."
}

Rules:
- meta_title: 50-60 characters, include focus keyword near the start, end with " | WebNDevs Agency"
- meta_description: 140-155 characters, include focus keyword, include a benefit/CTA
- og_title: can be slightly longer than meta_title, more descriptive
- og_description: 100-150 characters, compelling social sharing copy

Output only the JSON. No explanation.
PROMPT;
    }

    public function getMaxTokens(): int
    {
        return 200;
    }

    public function isJsonOutput(): bool
    {
        return true;
    }
}
