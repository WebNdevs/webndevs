<?php

namespace App\Services;

use App\Models\ContentGap;
use App\Models\CrossReferencePage;
use App\Models\Industry;
use App\Models\Tool;

class ContentGapAnalyzerService
{
    public function analyzeAndStore(string $entityType, int $entityId): int
    {
        $created  = 0;
        $created += $this->analyzeAgainstTools($entityType, $entityId);
        $created += $this->analyzeAgainstIndustries($entityType, $entityId);

        return $created;
    }

    private function analyzeAgainstTools(string $entityType, int $entityId): int
    {
        $source  = $entityType === Tool::class ? Tool::find($entityId) : null;
        $created = 0;

        $tools = Tool::query()
            ->where('status', 'published')
            ->where('id', '!=', $entityId)
            ->get(['id', 'name', 'tool_category_id', 'is_featured']);

        foreach ($tools as $tool) {
            if ($this->crossRefExists($entityType, $entityId, Tool::class, $tool->id)) {
                continue;
            }

            if (ContentGap::query()
                ->where('entity_a_type', $entityType)->where('entity_a_id', $entityId)
                ->where('entity_b_type', Tool::class)->where('entity_b_id', $tool->id)
                ->exists()) {
                continue;
            }

            $score    = $this->scoreToolPair($source, $tool);
            $title    = $source
                ? "{$source->name} vs {$tool->name} — Comparison & Integration Guide"
                : "Integration Guide with {$tool->name}";
            $rationale = $this->buildToolRationale($source, $tool, $score);

            ContentGap::create([
                'entity_a_type'   => $entityType,
                'entity_a_id'     => $entityId,
                'entity_b_type'   => Tool::class,
                'entity_b_id'     => $tool->id,
                'suggested_title' => $title,
                'gap_score'       => $score,
                'rationale'       => $rationale,
                'status'          => 'pending',
            ]);
            $created++;
        }

        return $created;
    }

    private function analyzeAgainstIndustries(string $entityType, int $entityId): int
    {
        // Industry × industry gaps are not useful; only analyze tool → industry pairs
        if ($entityType !== Tool::class) {
            return 0;
        }

        $source  = Tool::find($entityId);
        $created = 0;

        $industries = Industry::query()
            ->where('status', 'published')
            ->get(['id', 'name', 'is_featured']);

        foreach ($industries as $industry) {
            if ($this->crossRefExists($entityType, $entityId, Industry::class, $industry->id)) {
                continue;
            }

            if (ContentGap::query()
                ->where('entity_a_type', $entityType)->where('entity_a_id', $entityId)
                ->where('entity_b_type', Industry::class)->where('entity_b_id', $industry->id)
                ->exists()) {
                continue;
            }

            $score     = $this->scoreIndustryPair($source, $industry);
            $title     = $source
                ? "{$source->name} for {$industry->name} — Use Cases & Integration Guide"
                : "Industry guide for {$industry->name}";
            $rationale = $this->buildIndustryRationale($source, $industry, $score);

            ContentGap::create([
                'entity_a_type'   => $entityType,
                'entity_a_id'     => $entityId,
                'entity_b_type'   => Industry::class,
                'entity_b_id'     => $industry->id,
                'suggested_title' => $title,
                'gap_score'       => $score,
                'rationale'       => $rationale,
                'status'          => 'pending',
            ]);
            $created++;
        }

        return $created;
    }

    private function scoreToolPair(?Tool $source, Tool $target): int
    {
        $score = 3; // base

        if ($source?->is_featured) {
            $score += 2;
        }
        if ($target->is_featured) {
            $score += 2;
        }

        // Same category = direct comparison page; cross-category = integration guide — both high value
        if ($source && $source->tool_category_id === $target->tool_category_id) {
            $score += 2; // comparison within category has highest keyword volume
        } else {
            $score += 1; // cross-category integration pages are also valuable
        }

        return min(10, $score);
    }

    private function scoreIndustryPair(?Tool $source, Industry $target): int
    {
        $score = 4; // tool × industry pages are high-value for SEO

        if ($source?->is_featured) {
            $score += 2;
        }
        if ($target->is_featured) {
            $score += 2;
        }

        return min(10, $score);
    }

    private function buildToolRationale(?Tool $source, Tool $target, int $score): string
    {
        $parts = [];

        if (! $source) {
            $parts[] = "No cross-reference page exists for this tool pair.";
        } elseif ($source->tool_category_id === $target->tool_category_id) {
            $parts[] = "Both tools share the same category — a comparison page targets high-intent search queries.";
        } else {
            $parts[] = "Tools are in different categories — an integration guide captures complementary-tool searches.";
        }

        if ($source?->is_featured) {
            $parts[] = "Source tool is featured (high authority).";
        }
        if ($target->is_featured) {
            $parts[] = "Target tool is featured (high authority).";
        }

        $parts[] = "Gap score: {$score}/10.";

        return implode(' ', $parts);
    }

    private function buildIndustryRationale(?Tool $source, Industry $target, int $score): string
    {
        $parts = ["No industry-specific page exists for this tool × industry combination."];

        if ($source?->is_featured) {
            $parts[] = "Source tool is featured.";
        }
        if ($target->is_featured) {
            $parts[] = "Target industry is featured.";
        }

        $parts[] = "Gap score: {$score}/10.";

        return implode(' ', $parts);
    }

    private function crossRefExists(string $aType, int $aId, string $bType, int $bId): bool
    {
        return CrossReferencePage::query()
            ->where(function ($q) use ($aType, $aId, $bType, $bId) {
                $q->where('entity_a_type', $aType)->where('entity_a_id', $aId)
                  ->where('entity_b_type', $bType)->where('entity_b_id', $bId);
            })
            ->orWhere(function ($q) use ($aType, $aId, $bType, $bId) {
                $q->where('entity_a_type', $bType)->where('entity_a_id', $bId)
                  ->where('entity_b_type', $aType)->where('entity_b_id', $aId);
            })
            ->exists();
    }
}
