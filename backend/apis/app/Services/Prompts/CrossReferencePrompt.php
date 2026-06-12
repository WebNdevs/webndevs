<?php

namespace App\Services\Prompts;

class CrossReferencePrompt extends BasePrompt
{
    public function buildPrompt(array $context): string
    {
        $entityA = $context['entity_a_name'] ?? 'Tool A';
        $entityB = $context['entity_b_name'] ?? 'Tool B';
        $section = $context['section_key']   ?? 'overview';

        $sectionLabels = [
            'overview'          => 'an overview of how these two work together',
            'use_cases'         => '5-7 specific use cases where combining them delivers ROI',
            'integration_guide' => 'a step-by-step integration setup guide',
            'faq'               => '8 frequently asked questions about using them together',
            'benefits'          => 'the key business benefits of combining them',
            'the_problem'       => 'the specific business problem this combination solves (150 words)',
            'how_they_work_together' => 'a technical and practical explanation of the integration (300 words)',
            'implementation_overview' => "WND's typical implementation approach and timeline (200 words)",
        ];
        $sectionDesc = $sectionLabels[$section] ?? "content for the '{$section}' section";

        return <<<PROMPT
Write {$sectionDesc} for a page about integrating {$entityA} with {$entityB}.

Context: This is for a digital agency's programmatic SEO page targeting businesses that want to use {$entityA} and {$entityB} together.

Requirements:
- Direct, answer-first structure (state the main point in sentence 1)
- Specific, concrete details — no generic advice
- Include realistic workflow examples where relevant
- Mention implementation considerations an agency would handle
- SEO-optimised: naturally use phrases like "{$entityA} {$entityB} integration", "{$entityA} for {$entityB}"

Length: 300-400 words. No markdown headers (use plain paragraphs or numbered lists only).
PROMPT;
    }

    public function getMaxTokens(): int
    {
        return 4096;
    }
}
