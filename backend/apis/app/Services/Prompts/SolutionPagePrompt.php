<?php

namespace App\Services\Prompts;

class SolutionPagePrompt extends BasePrompt
{
    public function buildPrompt(array $context): string
    {
        $name     = $context['solution_name']      ?? 'the solution';
        $problem  = $context['problem_statement']  ?? 'a common business problem';
        $tools    = implode(', ', (array) ($context['tools'] ?? ['the relevant tools']));
        $industry = $context['industry']           ?? 'the target industry';

        return <<<PROMPT
Write the full content for a solution page titled "{$name}".

Context:
- Problem: {$problem}
- Tools involved: {$tools}
- Industry: {$industry}

Structure to produce:
1. Problem Deep-Dive (100 words): expand on the cost and impact of the problem
2. Our Solution (150 words): how the combination of {$tools} solves it, what the workflow looks like
3. Why This Stack (100 words): why these specific tools, not alternatives
4. Implementation Timeline (50 words): realistic phases (discovery → build → test → launch)
5. Expected Results (100 words): concrete, honest outcomes with caveats

Tone: confident agency expert. Not salesy. Data-driven where possible.
Total: ~500 words.
PROMPT;
    }

    public function getMaxTokens(): int
    {
        return 2048;
    }
}
