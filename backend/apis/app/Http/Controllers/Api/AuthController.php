<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Default token expiration in hours (Laravel Sanctum default is null = never)
     */
    private const TOKEN_EXPIRY_HOURS = 24;

    public function register(RegisterRequest $request)
    {
        $user = User::create([
            'name' => $request->validated('name'),
            'email' => $request->validated('email'),
            'password' => Hash::make($request->validated('password')),
            'is_admin' => false,
        ]);

        $tokenResult = $this->createAuthToken($user);

        return $this->success([
            'user' => $user,
            'token' => $tokenResult['token'],
            'expires_at' => $tokenResult['expires_at'],
        ], 'Registration successful.', 201);
    }

    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();
        $user = User::query()->where('email', $credentials['email'])->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            return $this->error('Invalid credentials.', [], 401);
        }

        $tokenResult = $this->createAuthToken($user);

        return $this->success([
            'user' => $user,
            'token' => $tokenResult['token'],
            'expires_at' => $tokenResult['expires_at'],
        ], 'Login successful.');
    }

    public function me(Request $request)
    {
        $user = $request->user();
        $token = $request->user()?->currentAccessToken();
        
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
            'permissions' => $user->is_admin ? array_keys(User::getAvailablePermissions()) : ($user->permissions ?? []),
            'available_permissions' => User::getAvailablePermissions(),
            'token_info' => [
                'created_at' => $token?->created_at?->toIso8601String(),
                'expires_at' => $token?->expires_at?->toIso8601String(),
                'is_expired' => $token?->expires_at ? $token->expires_at->isPast() : false,
            ],
        ], 'Authenticated user.');
    }

    /**
     * Get current token information
     */
    public function tokenInfo(Request $request)
    {
        $user = $request->user();
        $token = $user?->currentAccessToken();
        
        if (!$token) {
            return $this->error('No active token.', [], 401);
        }

        $expiresAt = $token->expires_at;
        $now = now();
        $isExpired = $expiresAt ? $expiresAt->isPast() : false;
        $minutesRemaining = $expiresAt ? max(0, $now->diffInMinutes($expiresAt, false) * -1) : null;

        return $this->success([
            'token_id' => $token->id,
            'name' => $token->name,
            'created_at' => $token->created_at->toIso8601String(),
            'expires_at' => $expiresAt?->toIso8601String(),
            'is_expired' => $isExpired,
            'is_expiring_soon' => $minutesRemaining !== null && $minutesRemaining <= 30 && $minutesRemaining > 0,
            'minutes_remaining' => $minutesRemaining,
            'abilities' => $token->abilities,
        ], 'Token info retrieved.');
    }

    /**
     * Refresh the current token (extend expiration)
     */
    public function refreshToken(Request $request)
    {
        $user = $request->user();
        $currentToken = $user?->currentAccessToken();
        
        if (!$user) {
            return $this->error('Not authenticated.', [], 401);
        }

        // Delete current token
        if ($currentToken) {
            $currentToken->delete();
        }

        // Create new token with fresh expiration
        $tokenResult = $this->createAuthToken($user);

        return $this->success([
            'token' => $tokenResult['token'],
            'expires_at' => $tokenResult['expires_at'],
            'message' => 'Token refreshed successfully.',
        ], 'Token refreshed.');
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        
        // Delete all user's tokens (logout from all devices)
        if ($request->input('logout_all', false)) {
            $user?->tokens()->delete();
        } else {
            // Delete only current token
            $token = $user?->currentAccessToken();
            if ($token) {
                $token->delete();
            }
        }

        if ($request->hasSession()) {
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        return $this->success(null, 'Logged out successfully.');
    }

    /**
     * Create authenticated token with expiration
     */
    private function createAuthToken(User $user): array
    {
        $expiresAt = now()->addHours(self::TOKEN_EXPIRY_HOURS);
        
        $tokenResult = $user->createToken('api-token');
        $token = $tokenResult->accessToken;
        $token->expires_at = $expiresAt;
        $token->save();
        
        return [
            'token' => $tokenResult->plainTextToken,
            'expires_at' => $expiresAt->toIso8601String(),
        ];
    }
}
