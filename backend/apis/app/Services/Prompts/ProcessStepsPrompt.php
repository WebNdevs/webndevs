<?php

namespace App\Services\Prompts;

class ProcessStepsPrompt extends BasePrompt
{
    public function buildPrompt(array $context): string
    {
        $name = $context['entity_name'] ?? 'the tool';
        $goal = $context['goal']        ?? 'implement an automation workflow';

        return <<<PROMPT
Write a 5-step implementation process for using {$name} to {$goal}.

For each step:
**Step N: [Title]**
- What happens: [specific action or configuration]
- Who does it: [developer / admin / client]
- Duration: [realistic time estimate]
- Agency tip: [one practical insight only an experienced implementer would know]

Requirements:
- Steps must be sequential and non-redundant
- Include at least one step about testing/QA
- Practical enough that a technical reader could follow along
- Tone: expert consultant, not a tutorial writer

Return a JSON array:
[{"step_number":1,"title":"...","description":"...","duration":"...","icon":"..."}]
PROMPT;
    }

    public function getMaxTokens(): int
    {
        return 1500;
    }

    public function isJsonOutput(): bool
    {
        return true;
    }
}
