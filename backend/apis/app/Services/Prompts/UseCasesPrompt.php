<?php

namespace App\Services\Prompts;

class UseCasesPrompt extends BasePrompt
{
    public function buildPrompt(array $context): string
    {
        $name     = $context['entity_name'] ?? $context['entity_type'] ?? 'the tool';
        $industry = $context['industry']    ?? 'various industries';

        return <<<PROMPT
Generate 6 concrete use cases for {$name} in the {$industry} sector.

Format for each use case:
**Use Case Title** — one-line description
- Problem it solves: [specific pain point]
- How {$name} addresses it: [specific technical approach]
- Result: [quantifiable or concrete outcome]

Requirements:
- Each use case must be distinct and non-overlapping
- Tie at least 2 use cases to automation or integration workflows
- Make outcomes specific (e.g. "reduce no-shows by 40%" not just "improve efficiency")
- Suitable for a professional agency website targeting decision-makers

Total length: 400-500 words.
PROMPT;
    }

    public function getMaxTokens(): int
    {
        return 2000;
    }

    public function isJsonOutput(): bool
    {
        return true;
    }
}
