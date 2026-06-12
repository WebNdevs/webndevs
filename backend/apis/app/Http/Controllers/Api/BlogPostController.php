<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBlogPostRequest;
use App\Http\Requests\UpdateBlogPostRequest;
use App\Models\BlogPost;
use Illuminate\Http\Request;

class BlogPostController extends Controller
{
    public function index(Request $request)
    {
        $isAdmin = auth('sanctum')->user()?->is_admin ?? false;

        $query = BlogPost::query()->orderByDesc('published_at')->orderByDesc('created_at');

        // Public visitors only see published; admins see all statuses
        if (! $isAdmin) {
            $query->where('status', 'published');
        } elseif ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        if ($request->filled('search')) {
            $search = trim((string) $request->input('search'));
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        if ($request->filled('limit')) {
            $query->limit((int) $request->input('limit'));
        }

        $perPage = min(max((int) $request->query('per_page', 20), 1), 100);

        return $this->success($query->paginate($perPage), 'Blog posts fetched.');
    }

    public function store(StoreBlogPostRequest $request)
    {
        $payload = $request->validated();
        if (($payload['status'] ?? null) === 'published' && empty($payload['published_at'])) {
            $payload['published_at'] = now();
        }

        $blogPost = BlogPost::query()->create([
            ...$payload,
            'created_by' => $request->user()?->id,
            'updated_by' => $request->user()?->id,
        ]);

        return $this->success($blogPost, 'Blog post created.', 201);
    }

    public function show(BlogPost $blogPost)
    {
        if ($blogPost->status !== 'published') {
            abort(404);
        }

        return $this->success($blogPost, 'Blog post fetched.');
    }

    public function update(UpdateBlogPostRequest $request, BlogPost $blogPost)
    {
        $payload = $request->validated();
        if (($payload['status'] ?? null) === 'published' && empty($payload['published_at'])) {
            $payload['published_at'] = now();
        }

        $blogPost->update([
            ...$payload,
            'updated_by' => $request->user()?->id,
        ]);

        return $this->success($blogPost->fresh(), 'Blog post updated.');
    }

    public function destroy(BlogPost $blogPost)
    {
        $blogPost->delete();

        return $this->success(null, 'Blog post deleted.');
    }
}
