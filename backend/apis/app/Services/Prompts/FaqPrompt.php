<?php

namespace App\Services\Prompts;

class FaqPrompt extends BasePrompt
{
    public function buildPrompt(array $context): string
    {
        $name    = $context['entity_name']   ?? $context['entity_type'] ?? 'the topic';
        $entity2 = isset($context['entity_b_name']) ? " and {$context['entity_b_name']}" : '';

        return <<<PROMPT
Generate 10 frequently asked questions (with answers) about {$name}{$entity2}.

Requirements:
- Mix of technical questions (How does X work?) and business questions (Is X worth the cost?)
- Answers: 2-4 sentences each, factual and direct
- Include questions a buyer/decision-maker would ask before hiring an agency
- Format: Q: [question]\nA: [answer]
- Cover: pricing/cost, setup time, limitations, integrations, support, ROI, security/compliance

Output only the Q&A pairs. No intro or conclusion.
PROMPT;
    }

    public function getMaxTokens(): int
    {
        return 3000;
    }

    public function isJsonOutput(): bool
    {
        return true;
    }
}
