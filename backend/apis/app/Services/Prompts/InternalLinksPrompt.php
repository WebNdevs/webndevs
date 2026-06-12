<?php

namespace App\Services\Prompts;

class InternalLinksPrompt extends BasePrompt
{
    public function buildPrompt(array $context): string
    {
        $pageTitle      = $context['page_title']   ?? 'the page';
        $pageContent    = mb_substr($context['page_content'] ?? '', 0, 1500);
        $availablePages = implode(', ', (array) ($context['available_pages'] ?? []));

        return <<<PROMPT
Analyse the following page content and suggest internal links to insert.

Page: "{$pageTitle}"
Available pages to link to: {$availablePages}

Content excerpt:
---
{$pageContent}
---

For each suggestion, output EXACTLY this JSON format in an array:
[
  {
    "anchor_text": "exact phrase from the content to hyperlink",
    "target_page": "name of the page to link to",
    "reason": "one sentence explaining the relevance"
  }
]

Rules:
- Only suggest links where the anchor text appears verbatim in the content
- Maximum 5 suggestions
- Prioritize links that improve topical authority and user flow
- Do not suggest the same target page twice

Output only the JSON array.
PROMPT;
    }

    public function getMaxTokens(): int
    {
        return 1000;
    }

    public function isJsonOutput(): bool
    {
        return true;
    }
}
