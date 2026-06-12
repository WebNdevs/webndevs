<?php

namespace App\Services\Prompts;

abstract class BasePrompt implements PromptInterface
{
    public function getSystemPrompt(): string
    {
        return 'You are a senior technical writer at WND Agency — a tech company specialising in integrations, automations, CRM, and custom software. Write factual, structured, conversion-focused content. Use clear headers, numbered lists, and direct language. Never hallucinate product features. Answer-first rule: state the direct answer in the first sentence before explaining.';
    }

    public function getMaxTokens(): int
    {
        return 2048;
    }

    public function isJsonOutput(): bool
    {
        return false;
    }
}
