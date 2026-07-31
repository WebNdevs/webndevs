import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { API_BASE_URL } from "../../config/api.config";
import { getStoredToken, setStoredToken, clearStoredAuth } from "../auth";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  role: string;
  permissions: string[];
}

// Available permissions
export const AVAILABLE_PERMISSIONS: Record<string, string> = {
  'services.manage': 'Services - Create, edit, delete',
  'articles.manage': 'Articles - Create, edit, delete',
  'case_studies.manage': 'Case Studies - Create, edit, delete',
  'content.manage': 'Content Pages - Create, edit, delete',
  'media.manage': 'Media Library - Upload, delete',
  'settings.manage': 'Settings - View and edit settings',
  'users.manage': 'Users - Create, edit, delete users',
  'ai.use': 'AI Generation - Use AI features',
  'tools.manage': 'Tools - Create, edit, delete tools',
  'analytics.view': 'Analytics - View analytics',
};

export interface TokenInfo {
  token_id: number;
  name: string;
  created_at: string;
  expires_at: string;
  is_expired: boolean;
  is_expiring_soon: boolean;
  minutes_remaining: number | null;
  abilities: string[];
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  tokenInfo: TokenInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  fetchTokenInfo: () => Promise<void>;
  clearError: () => void;
  // For broadcasting changes to other components
  broadcastAuthChange: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Custom event for broadcasting auth changes
const AUTH_CHANGE_EVENT = "auth:change";

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Hook for components that just want to listen to auth changes
export function useAuthListener(callback: () => void) {
  useEffect(() => {
    window.addEventListener(AUTH_CHANGE_EVENT, callback);
    return () => window.removeEventListener(AUTH_CHANGE_EVENT, callback);
  }, [callback]);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const broadcastAuthChange = useCallback(() => {
    window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT));
  }, []);

  const fetchTokenInfo = useCallback(async () => {
    try {
      const storedToken = getStoredToken();
      if (!storedToken) {
        setTokenInfo(null);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/auth/token-info`, {
        credentials: "include",
        headers: {
          Accept: "application/json",
          ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTokenInfo(data.data);
      } else {
        setTokenInfo(null);
      }
    } catch {
      setTokenInfo(null);
    }
  }, []);

  const fetchUser = useCallback(async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.data.user);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Failed to refresh token");
      }

      const data = await response.json();

      if (data.data?.token) {
        setStoredToken(data.data.token);
        setToken(data.data.token);
        broadcastAuthChange();
      }

      await fetchTokenInfo();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refresh token");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchTokenInfo, broadcastAuthChange]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Login failed");
      }

      // Any user can login - role-based access is checked on the frontend
      if (data.data?.token) {
        setStoredToken(data.data.token);
        setToken(data.data.token);
        // Fetch full user info with permissions
        await fetchUser(data.data.token);
        broadcastAuthChange();
      }

      await fetchTokenInfo();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchTokenInfo, broadcastAuthChange]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });
    } catch {
      // Ignore logout errors
    } finally {
      clearStoredAuth();
      setUser(null);
      setToken(null);
      setTokenInfo(null);
      document.cookie = "XSRF-TOKEN=; Max-Age=0; path=/";
      document.cookie = "laravel_session=; Max-Age=0; path=/";
      broadcastAuthChange();
      setIsLoading(false);
    }
  }, [broadcastAuthChange]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Initialize auth state on mount
  useEffect(() => {
    async function initAuth() {
      const storedToken = getStoredToken();
      if (storedToken) {
        setToken(storedToken);
        const isValid = await fetchUser(storedToken);
        if (!isValid) {
          clearStoredAuth();
          setToken(null);
        }
      }
      await fetchTokenInfo();
      setIsLoading(false);
    }
    void initAuth();
  }, [fetchUser, fetchTokenInfo]);

  const value: AuthContextType = {
    user,
    token,
    tokenInfo,
    isAuthenticated: !!token && !!user,
    isLoading,
    error,
    login,
    logout,
    refreshToken,
    fetchTokenInfo,
    clearError,
    broadcastAuthChange,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}