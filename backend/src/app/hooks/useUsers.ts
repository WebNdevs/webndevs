import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { API_BASE_URL } from "../../config/api.config";
import { getStoredToken } from "../auth";

export interface User {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  role: string;
  permissions: string[];
  created_at: string;
  updated_at?: string;
  tokens_count?: number;
}

export interface UserToken {
  id: number;
  name: string;
  created_at: string;
  expires_at: string | null;
}

export interface UserDetail extends User {
  tokens: UserToken[];
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation?: string;
  is_admin?: boolean;
  role?: string;
  permissions?: string[];
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  is_admin?: boolean;
  role?: string;
  permissions?: string[];
}

export interface ChangePasswordPayload {
  current_password?: string;
  password: string;
  password_confirmation: string;
  force_change?: boolean;
}

export interface PaginatedUsers {
  data: User[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

const PERMISSIONS_LIST: Record<string, string> = {
  'services.manage': 'Services - Create, edit, delete',
  'blog.manage': 'Blog Posts - Create, edit, delete',
  'case_studies.manage': 'Case Studies - Create, edit, delete',
  'content.manage': 'Content Pages - Create, edit, delete',
  'media.manage': 'Media Library - Upload, delete',
  'settings.manage': 'Settings - View and edit settings',
  'users.manage': 'Users - Create, edit, delete users',
  'ai.use': 'AI Generation - Use AI features',
  'tools.manage': 'Tools - Create, edit, delete tools',
  'analytics.view': 'Analytics - View analytics',
};

const ROLES_LIST: Record<string, string> = {
  'admin': 'Administrator - Full access to all features',
  'editor': 'Editor - Can manage content, limited settings',
  'viewer': 'Viewer - Read-only access',
};

export function useUsers(autoFetch = true) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<PaginatedUsers | null>(null);

  const token = useMemo(() => getStoredToken(), []);
  const authHeaders = useMemo(() => ({
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }), [token]);

  // Store refetch in a ref so useEffect can access the latest version
  const refetchRef = useRef<() => Promise<PaginatedUsers | null>>(() => Promise.resolve(null));

  const refetch = useCallback(async (page = 1, perPage = 15, search = ""): Promise<PaginatedUsers | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        per_page: String(perPage),
        ...(search ? { search } : {}),
      });
      const response = await fetch(`${API_BASE_URL}/users?${params}`, {
        headers: authHeaders,
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch users");
      }
      setUsers(data.data?.data || []);
      setPagination(data.data);
      return data.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // Update ref when refetch changes
  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  // Auto-fetch users on mount if autoFetch is true
  useEffect(() => {
    if (autoFetch) {
      void refetch(1, 15, "");
    }
  }, [autoFetch]);

  const fetchUsers = useCallback(async (page = 1, perPage = 15, search = ""): Promise<PaginatedUsers | null> => {
    return refetch(page, perPage, search);
  }, [refetch]);

  const fetchUser = useCallback(async (id: number): Promise<UserDetail | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        headers: authHeaders,
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch user");
      }
      return data.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const createUser = useCallback(async (payload: CreateUserPayload): Promise<User | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: authHeaders,
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || data.errors || "Failed to create user");
      }
      return data.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const updateUser = useCallback(async (id: number, payload: UpdateUserPayload): Promise<User | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: "PUT",
        headers: authHeaders,
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || data.errors || "Failed to update user");
      }
      return data.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const deleteUser = useCallback(async (id: number): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: "DELETE",
        headers: authHeaders,
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to delete user");
      }
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const changePassword = useCallback(async (id: number, payload: ChangePasswordPayload): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}/change-password`, {
        method: "POST",
        headers: authHeaders,
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to change password");
      }
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const revokeTokens = useCallback(async (id: number): Promise<number> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}/revoke-tokens`, {
        method: "POST",
        headers: authHeaders,
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to revoke tokens");
      }
      return data.data.tokens_revoked;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      return 0;
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  return {
    isLoading,
    error,
    users,
    pagination,
    permissionsList: PERMISSIONS_LIST,
    rolesList: ROLES_LIST,
    fetchUsers,
    fetchUser,
    createUser,
    updateUser,
    deleteUser,
    changePassword,
    revokeTokens,
    refetch,
  };
}