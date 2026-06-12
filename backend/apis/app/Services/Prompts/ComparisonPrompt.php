<?php

namespace App\Services\Prompts;

class ComparisonPrompt extends BasePrompt
{
    public function buildPrompt(array $context): string
    {
        $tools   = implode(' vs ', (array) ($context['entities'] ?? ['Tool A', 'Tool B']));
        $section = $context['section_key'] ?? 'verdict';

        return <<<PROMPT
Write the "{$section}" section for a comparison page: {$tools}.

Requirements:
- Be genuinely balanced — acknowledge real strengths and weaknesses of each
- Use specific facts, not marketing language
- The verdict must give a clear recommendation based on use case (not "it depends")
- Format: 2-3 paragraphs or a structured breakdown
- Include who each option is best for (team size, budget, technical skill)

Length: 200-300 words. Authoritative, opinionated tone appropriate for an expert comparison guide.
PROMPT;
    }

    public function getMaxTokens(): int
    {
        return 1000;
    }
}
