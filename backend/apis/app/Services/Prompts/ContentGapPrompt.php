<?php

namespace App\Services\Prompts;

class ContentGapPrompt extends BasePrompt
{
    public function buildPrompt(array $context): string
    {
        $entityA = $context['entity_a_name'] ?? 'Entity A';
        $entityB = $context['entity_b_name'] ?? 'Entity B';

        return <<<PROMPT
Score the value of creating a cross-reference page combining "{$entityA}" and "{$entityB}".

Evaluate on these criteria (score 1-10 each):
1. Search demand: do people search for "{$entityA} {$entityB}" or related terms?
2. Buyer intent: would visitors be likely to hire an agency after reading this page?
3. Competition gap: is this topic underserved by existing content online?
4. Topical relevance: does combining these entities make logical sense for an integration agency?

Output EXACTLY this JSON (no extra text):
{
  "overall_score": 7.5,
  "search_demand": 8,
  "buyer_intent": 7,
  "competition_gap": 6,
  "topical_relevance": 9,
  "suggested_title": "...",
  "reasoning": "2-3 sentences explaining the score"
}

Output only the JSON.
PROMPT;
    }

    public function getMaxTokens(): int
    {
        return 500;
    }

    public function isJsonOutput(): bool
    {
        return true;
    }
}
