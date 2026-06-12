<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    private const TOKEN_EXPIRY_HOURS = 24;

    /**
     * List all users (paginated)
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 15);
        $search = $request->input('search', '');
        
        $query = User::query();
        
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }
        
        $users = $query->orderBy('created_at', 'desc')->paginate($perPage);
        
        // Remove sensitive data
        $users->getCollection()->transform(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_admin' => $user->is_admin,
                'role' => $user->role ?? 'editor',
                'permissions' => $user->permissions ?? [],
                'created_at' => $user->created_at->toIso8601String(),
                'updated_at' => $user->updated_at->toIso8601String(),
                'tokens_count' => $user->tokens()->count(),
            ];
        });
        
        return $this->success($users, 'Users retrieved successfully.');
    }

    /**
     * Get single user
     */
    public function show(int $id): JsonResponse
    {
        $user = User::find($id);
        
        if (!$user) {
            return $this->error('User not found.', [], 404);
        }
        
        return $this->success([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'is_admin' => $user->is_admin,
            'role' => $user->role ?? 'editor',
            'permissions' => $user->permissions ?? [],
            'created_at' => $user->created_at->toIso8601String(),
            'updated_at' => $user->updated_at->toIso8601String(),
            'tokens' => $user->tokens()->select('id', 'name', 'created_at', 'expires_at')->get(),
        ], 'User retrieved successfully.');
    }

    /**
     * Create new user
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::min(8)],
            'is_admin' => ['sometimes', 'boolean'],
            'role' => ['sometimes', 'string', 'in:admin,editor,viewer'],
            'permissions' => ['sometimes', 'array'],
            'permissions.*' => ['string'],
        ]);
        
        try {
            $userData = [
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'is_admin' => $validated['is_admin'] ?? false,
                'role' => $validated['role'] ?? 'editor',
                'permissions' => $validated['permissions'] ?? [],
            ];
            
            $user = User::create($userData);
            
            return $this->success([
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'is_admin' => $user->is_admin,
                    'role' => $user->role ?? 'editor',
                    'permissions' => $user->permissions ?? [],
                    'created_at' => $user->created_at->toIso8601String(),
                ],
            ], 'User created successfully.', 201);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('User creation failed: ' . $e->getMessage());
            return $this->error('An unexpected error occurred while creating the user.', [], 500);
        }
    }

    /**
     * Update user
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $user = User::find($id);
        
        if (!$user) {
            return $this->error('User not found.', [], 404);
        }
        
        // Prevent self-demotion from admin
        $currentUser = $request->user();
        if ($currentUser && $currentUser->id === $user->id) {
            // Can update own profile but not own admin status
            $validated = $request->validate([
                'name' => ['sometimes', 'string', 'max:255'],
                'email' => ['sometimes', 'string', 'email', 'max:255', 'unique:users,email,' . $id],
                'role' => ['sometimes', 'string', 'in:admin,editor,viewer'],
                'permissions' => ['sometimes', 'array'],
                'permissions.*' => ['string'],
            ]);
        } else {
            $validated = $request->validate([
                'name' => ['sometimes', 'string', 'max:255'],
                'email' => ['sometimes', 'string', 'email', 'max:255', 'unique:users,email,' . $id],
                'is_admin' => ['sometimes', 'boolean'],
                'role' => ['sometimes', 'string', 'in:admin,editor,viewer'],
                'permissions' => ['sometimes', 'array'],
                'permissions.*' => ['string'],
            ]);
        }
        
        // Update fields
        if (isset($validated['name'])) {
            $user->name = $validated['name'];
        }
        if (isset($validated['email'])) {
            $user->email = $validated['email'];
        }
        if (isset($validated['is_admin'])) {
            // Prevent removing own admin status
            $currentUser = $request->user();
            if ($currentUser && $currentUser->id !== $user->id) {
                $user->is_admin = $validated['is_admin'];
            }
        }
        if (isset($validated['role'])) {
            $user->role = $validated['role'];
        }
        if (array_key_exists('permissions', $validated)) {
            $user->permissions = $validated['permissions'];
        }
        
        $user->save();
        
        return $this->success([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'is_admin' => $user->is_admin,
            'role' => $user->role,
            'permissions' => $user->permissions,
            'updated_at' => $user->updated_at->toIso8601String(),
        ], 'User updated successfully.');
    }

    /**
     * Delete user
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $user = User::find($id);
        
        if (!$user) {
            return $this->error('User not found.', [], 404);
        }
        
        // Prevent self-deletion
        $currentUser = $request->user();
        if ($currentUser && $currentUser->id === $user->id) {
            return $this->error('You cannot delete your own account.', [], 403);
        }
        
        // Delete all tokens first
        $user->tokens()->delete();
        
        // Delete the user
        $user->delete();
        
        return $this->success(null, 'User deleted successfully.');
    }

    /**
     * Change password for a user
     */
    public function changePassword(Request $request, int $id): JsonResponse
    {
        $user = User::find($id);
        
        if (!$user) {
            return $this->error('User not found.', [], 404);
        }
        
        $validated = $request->validate([
            'current_password' => ['required_without:force_change', 'string'],
            'password' => ['required', 'confirmed', Password::min(8)],
            'force_change' => ['sometimes', 'boolean'],
        ]);
        
        $currentUser = $request->user();
        
        // If changing own password, verify current password
        if ($currentUser && $currentUser->id === $user->id) {
            if (!isset($validated['force_change']) && !$validated['force_change']) {
                if (!Hash::check($validated['current_password'], $user->password)) {
                    return $this->error('Current password is incorrect.', [], 401);
                }
            }
        } else {
            // Other user changing password - require force_change flag
            if (!$currentUser || !$currentUser->is_admin) {
                return $this->error('Unauthorized.', [], 403);
            }
        }
        
        $user->password = Hash::make($validated['password']);
        $user->save();
        
        return $this->success([
            'user_id' => $user->id,
        ], 'Password changed successfully.');
    }

    /**
     * Revoke all tokens for a user
     */
    public function revokeTokens(int $id): JsonResponse
    {
        $user = User::find($id);
        
        if (!$user) {
            return $this->error('User not found.', [], 404);
        }
        
        $tokensDeleted = $user->tokens()->count();
        $user->tokens()->delete();
        
        return $this->success([
            'user_id' => $user->id,
            'tokens_revoked' => $tokensDeleted,
        ], "{$tokensDeleted} token(s) revoked successfully.");
    }

    /**
     * Get available permissions list
     */
    public function listPermissions(): JsonResponse
    {
        return $this->success([
            'permissions' => User::getAvailablePermissions(),
        ], 'Permissions retrieved successfully.');
    }

    /**
     * Get all roles
     */
    public function listRoles(): JsonResponse
    {
        return $this->success([
            'roles' => [
                'admin' => 'Administrator - Full access to all features',
                'editor' => 'Editor - Can manage content, limited settings',
                'viewer' => 'Viewer - Read-only access',
            ],
        ], 'Roles retrieved successfully.');
    }

    /**
     * Create authenticated token with expiration
     */
    private function createAuthToken(User $user, string $tokenName): array
    {
        $expiresAt = now()->addHours(self::TOKEN_EXPIRY_HOURS);
        
        $tokenResult = $user->createToken($tokenName);
        $token = $tokenResult->accessToken;
        $token->expires_at = $expiresAt;
        $token->save();
        
        return [
            'token' => $tokenResult->plainTextToken,
            'expires_at' => $expiresAt->toIso8601String(),
        ];
    }
}