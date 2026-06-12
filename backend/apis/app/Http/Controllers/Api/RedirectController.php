<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRedirectRequest;
use App\Http\Requests\UpdateRedirectRequest;
use App\Models\Redirect;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RedirectController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Redirect::query();
        if (! $request->boolean('include_inactive')) {
            $query->where('is_active', true);
        }

        return $this->success(
            $query->orderByDesc('id')->paginate($request->integer('per_page', 20)),
            'Redirects fetched.'
        );
    }

    public function show(Redirect $redirect): JsonResponse
    {
        return $this->success($redirect, 'Redirect fetched.');
    }

    public function store(StoreRedirectRequest $request): JsonResponse
    {
        $data             = $request->validated();
        $data['from_url'] = $this->normalizeSourceUrl($data['from_url']);
        $data['to_url']   = $this->normalizeTargetUrl($data['to_url']);

        if (Redirect::query()->where('from_url', $data['from_url'])->exists()) {
            return $this->error('Validation failed.', ['from_url' => ['The from_url has already been taken.']], 422);
        }

        return $this->success(Redirect::create($data), 'Redirect created.', 201);
    }

    public function update(UpdateRedirectRequest $request, Redirect $redirect): JsonResponse
    {
        $data = $request->validated();

        if (\array_key_exists('from_url', $data)) {
            $data['from_url'] = $this->normalizeSourceUrl($data['from_url']);
            if (Redirect::query()->where('from_url', $data['from_url'])->where('id', '!=', $redirect->id)->exists()) {
                return $this->error('Validation failed.', ['from_url' => ['The from_url has already been taken.']], 422);
            }
        }

        if (\array_key_exists('to_url', $data)) {
            $data['to_url'] = $this->normalizeTargetUrl($data['to_url']);
        }

        $redirect->update($data);

        return $this->success($redirect->fresh(), 'Redirect updated.');
    }

    public function destroy(Redirect $redirect): JsonResponse
    {
        $redirect->delete();

        return $this->success(null, 'Redirect deleted.');
    }

    private function normalizeSourceUrl(string $value): string
    {
        $path       = parse_url(trim($value), PHP_URL_PATH);
        $normalized = $path ?: trim($value);
        $normalized = '/' . ltrim($normalized, '/');

        return rtrim($normalized, '/') ?: '/';
    }

    private function normalizeTargetUrl(string $value): string
    {
        $value = trim($value);
        if (preg_match('#^https?://#i', $value) === 1) {
            return $value;
        }

        return '/' . ltrim($value, '/');
    }
}
