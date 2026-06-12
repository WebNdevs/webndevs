<?php

namespace App\Services;

use App\Models\CrossReferencePage;
use App\Models\Industry;
use App\Models\InternalLink;
use App\Models\Solution;
use App\Models\Tool;

class InternalLinkService
{
    private const MAX_SUGGESTIONS = 20;

    public function scanEntity(string $entityType, int $entityId): int
    {
        $suggestions = $this->buildSuggestions($entityType, $entityId);
        $created     = 0;

        foreach ($suggestions as $suggestion) {
            $exists = InternalLink::query()
                ->where('source_entity_type', $entityType)
                ->where('source_entity_id', $entityId)
                ->where('target_entity_type', $suggestion['target_type'])
                ->where('target_entity_id', $suggestion['target_id'])
                ->exists();

            if ($exists) {
                continue;
            }

            InternalLink::create([
                'source_entity_type' => $entityType,
                'source_entity_id'   => $entityId,
                'target_entity_type' => $suggestion['target_type'],
                'target_entity_id'   => $suggestion['target_id'],
                'anchor_text'        => $suggestion['anchor_text'],
                'context_snippet'    => $suggestion['context_snippet'],
                'is_confirmed'       => false,
                'is_auto_generated'  => true,
            ]);
            $created++;
        }

        return $created;
    }

    private function buildSuggestions(string $entityType, int $entityId): array
    {
        return match ($entityType) {
            Tool::class     => $this->suggestionsForTool($entityId),
            Industry::class => $this->suggestionsForIndustry($entityId),
            Solution::class => $this->suggestionsForSolution($entityId),
            default         => $this->fallbackSuggestions(),
        };
    }

    private function suggestionsForTool(int $toolId): array
    {
        $tool = Tool::with('category')->find($toolId);
        if (! $tool) {
            return [];
        }

        $suggestions = [];

        // Links to industries that have published cross-reference pages with this tool
        $crossRefIndustries = CrossReferencePage::query()
            ->where('status', 'published')
            ->where(function ($q) use ($toolId) {
                $q->where(fn ($q2) => $q2->where('entity_a_type', Tool::class)->where('entity_a_id', $toolId))
                  ->orWhere(fn ($q2) => $q2->where('entity_b_type', Tool::class)->where('entity_b_id', $toolId));
            })
            ->get()
            ->flatMap(function ($page) use ($toolId) {
                $ids = [];
                if ($page->entity_a_type === Industry::class && $page->entity_a_id !== $toolId) {
                    $ids[] = $page->entity_a_id;
                }
                if ($page->entity_b_type === Industry::class && $page->entity_b_id !== $toolId) {
                    $ids[] = $page->entity_b_id;
                }
                return $ids;
            })
            ->unique();

        $industries = Industry::query()
            ->where('status', 'published')
            ->whereIn('id', $crossRefIndustries)
            ->limit(8)
            ->get(['id', 'name']);

        foreach ($industries as $industry) {
            $suggestions[] = [
                'target_type'    => Industry::class,
                'target_id'      => $industry->id,
                'anchor_text'    => "{$tool->name} for {$industry->name}",
                'context_snippet'=> "How {$tool->name} is used in the {$industry->name} industry — use cases, integrations, and workflows.",
            ];
        }

        // Links to related tools in the same category
        if ($tool->tool_category_id) {
            $relatedTools = Tool::query()
                ->where('status', 'published')
                ->where('tool_category_id', $tool->tool_category_id)
                ->where('id', '!=', $toolId)
                ->orderByDesc('is_featured')
                ->limit(5)
                ->get(['id', 'name']);

            foreach ($relatedTools as $related) {
                $suggestions[] = [
                    'target_type'    => Tool::class,
                    'target_id'      => $related->id,
                    'anchor_text'    => "{$related->name} vs {$tool->name}",
                    'context_snippet'=> "Compare {$tool->name} and {$related->name} — features, pricing, and integration capabilities.",
                ];
            }
        }

        // Links to solutions that include this tool
        $solutions = Solution::query()
            ->where('status', 'published')
            ->whereHas('tools', fn ($q) => $q->where('tools.id', $toolId))
            ->limit(4)
            ->get(['id', 'name']);

        foreach ($solutions as $solution) {
            $suggestions[] = [
                'target_type'    => Solution::class,
                'target_id'      => $solution->id,
                'anchor_text'    => "{$tool->name} in {$solution->name}",
                'context_snippet'=> "See how {$tool->name} is integrated as part of the {$solution->name} solution stack.",
            ];
        }

        return \array_slice($suggestions, 0, self::MAX_SUGGESTIONS);
    }

    private function suggestionsForIndustry(int $industryId): array
    {
        $industry = Industry::find($industryId);
        if (! $industry) {
            return [];
        }

        $suggestions = [];

        // Links to tools with published cross-reference pages for this industry
        $crossRefToolIds = CrossReferencePage::query()
            ->where('status', 'published')
            ->where(function ($q) use ($industryId) {
                $q->where(fn ($q2) => $q2->where('entity_a_type', Industry::class)->where('entity_a_id', $industryId))
                  ->orWhere(fn ($q2) => $q2->where('entity_b_type', Industry::class)->where('entity_b_id', $industryId));
            })
            ->get()
            ->flatMap(function ($page) {
                $ids = [];
                if ($page->entity_a_type === Tool::class) {
                    $ids[] = $page->entity_a_id;
                }
                if ($page->entity_b_type === Tool::class) {
                    $ids[] = $page->entity_b_id;
                }
                return $ids;
            })
            ->unique();

        $tools = Tool::query()
            ->where('status', 'published')
            ->whereIn('id', $crossRefToolIds)
            ->orderByDesc('is_featured')
            ->limit(10)
            ->get(['id', 'name']);

        foreach ($tools as $tool) {
            $suggestions[] = [
                'target_type'    => Tool::class,
                'target_id'      => $tool->id,
                'anchor_text'    => "{$tool->name} for {$industry->name}",
                'context_snippet'=> "How {$tool->name} serves {$industry->name} businesses — industry-specific use cases and integrations.",
            ];
        }

        // Links to solutions for this industry
        $solutions = Solution::query()
            ->where('status', 'published')
            ->where('industry_id', $industryId)
            ->limit(6)
            ->get(['id', 'name']);

        foreach ($solutions as $solution) {
            $suggestions[] = [
                'target_type'    => Solution::class,
                'target_id'      => $solution->id,
                'anchor_text'    => "{$solution->name} for {$industry->name}",
                'context_snippet'=> "Complete {$industry->name} solution: {$solution->name} — tools, workflows, and integration guides.",
            ];
        }

        // Fallback to featured tools if no cross-reference data exists
        if (\count($suggestions) < 5) {
            $featuredTools = Tool::query()
                ->where('status', 'published')
                ->where('is_featured', true)
                ->limit(5)
                ->get(['id', 'name']);

            foreach ($featuredTools as $tool) {
                $suggestions[] = [
                    'target_type'    => Tool::class,
                    'target_id'      => $tool->id,
                    'anchor_text'    => $tool->name,
                    'context_snippet'=> "Explore how {$tool->name} can benefit {$industry->name} operations.",
                ];
            }
        }

        return \array_slice($suggestions, 0, self::MAX_SUGGESTIONS);
    }

    private function suggestionsForSolution(int $solutionId): array
    {
        $solution = Solution::with(['industry', 'tools'])->find($solutionId);
        if (! $solution) {
            return [];
        }

        $suggestions = [];

        foreach ($solution->tools->take(8) as $tool) {
            $suggestions[] = [
                'target_type'    => Tool::class,
                'target_id'      => $tool->id,
                'anchor_text'    => $tool->name,
                'context_snippet'=> "{$tool->name} is a core component of the {$solution->name} solution stack.",
            ];
        }

        if ($solution->industry) {
            $suggestions[] = [
                'target_type'    => Industry::class,
                'target_id'      => $solution->industry_id,
                'anchor_text'    => "{$solution->industry->name} solutions",
                'context_snippet'=> "{$solution->name} is designed specifically for {$solution->industry->name} businesses.",
            ];
        }

        return \array_slice($suggestions, 0, self::MAX_SUGGESTIONS);
    }

    private function fallbackSuggestions(): array
    {
        return Tool::query()
            ->where('status', 'published')
            ->where('is_featured', true)
            ->limit(5)
            ->get(['id', 'name'])
            ->map(fn ($t) => [
                'target_type'    => Tool::class,
                'target_id'      => $t->id,
                'anchor_text'    => $t->name,
                'context_snippet'=> null,
            ])
            ->all();
    }
}
