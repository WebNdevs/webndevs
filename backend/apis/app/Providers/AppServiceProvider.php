<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if ($this->app->environment('production')) {
            URL::forceScheme('https');
        }

        RateLimiter::for('service-management', function (Request $request) {
            $key = $request->user()?->id ? "user:{$request->user()->id}" : "ip:{$request->ip()}";

            return [
                Limit::perMinute(120)->by($key),
            ];
        });

        RateLimiter::for('public-api', function (Request $request) {
            return [
                Limit::perMinute(240)->by('ip:'.$request->ip()),
            ];
        });

        RateLimiter::for('auth-api', function (Request $request) {
            return [
                Limit::perMinute(20)->by('ip:'.$request->ip()),
            ];
        });

        RateLimiter::for('ai-generation', function (Request $request) {
            $key = $request->user()?->id ? 'user:'.$request->user()->id : 'ip:'.$request->ip();

            return [
                Limit::perHour(10)->by($key),
            ];
        });
    }
}
