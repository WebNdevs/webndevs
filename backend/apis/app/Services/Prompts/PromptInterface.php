<?php

namespace App\Services\Prompts;

interface PromptInterface
{
    public function getSystemPrompt(): string;

    public function buildPrompt(array $context): string;

    public function getMaxTokens(): int;

    public function isJsonOutput(): bool;
}
