<?php

namespace App\Services\Prompts;

class EntityOverviewPrompt extends BasePrompt
{
    public function buildPrompt(array $context): string
    {
        $name     = $context['entity_name'] ?? $context['entity_type'] ?? 'the entity';
        $category = $context['category']    ?? 'integration tool';
        $audience = $context['audience']    ?? 'businesses and developers';

        return <<<PROMPT
Write a comprehensive overview of {$name} for a programmatic SEO page on a digital agency website.

Requirements:
- Opening paragraph: What {$name} is and its primary value proposition (2-3 sentences, answer-first)
- Core capabilities section: 4-6 bullet points with specific features
- Who uses it: target {$audience} in the {$category} space
- Integration ecosystem: mention key tools it connects with
- Agency value: why businesses hire an agency to implement {$name} (not just DIY)

Length: 350-450 words. Tone: authoritative, practical, conversion-focused.
No generic filler. Every sentence must add specific value.
PROMPT;
    }

    public function getMaxTokens(): int
    {
        return 1500;
    }
}
