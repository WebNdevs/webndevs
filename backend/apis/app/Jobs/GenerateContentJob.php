<?php

namespace App\Jobs;

use App\Services\ContentGeneratorService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class GenerateContentJob implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    public int $timeout = 180;
    public int $tries = 2;

    public function __construct(private readonly array $payload)
    {
        $this->onQueue('ai-generation');
    }

    public function handle(ContentGeneratorService $generator): void
    {
        $generator->generate($this->payload);
    }
}
