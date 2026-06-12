<?php

namespace Tests\Feature;

// use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * A basic test example.
     */
    public function test_health_endpoint_returns_expected_shape(): void
    {
        $response = $this->getJson('/api/health');

        $this->assertContains($response->status(), [200, 503]);
        $response->assertJsonStructure([
            'status',
            'timestamp',
            'checks' => ['database', 'cache', 'queue'],
        ]);
    }
}
