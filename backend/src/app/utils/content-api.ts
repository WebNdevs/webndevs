/**
 * Centralized Content Pages API Service
 * Provides consistent API calls with proper error handling and authentication
 */
import { API_BASE_URL } from "../../config/api.config";
import { getStoredToken, clearStoredAuth } from "../auth";

// Types
export type ContentItem = {
  id: number;
  item_key: string | null;
  title: string;
  content: string | null;
  category: string | null;
  url: string | null;
  description: string | null;
  results: string[] | null;
  tags: string[] | null;
  badge: string | null;
  avatar: string | null;
  client_name: string | null;
  client_role: string | null;
  company: string | null;
  rating: number | null;
  duration: string | null;
  sort_order: number;
  is_featured: boolean;
  is_active: boolean;
  custom_fields: Record<string, unknown> | null;
  external_id: string | null;
  updated_by: number | null;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
  question?: string | null;
  answer?: string | null;
  pro_name?: string | null;
  pro_category?: string | null;
  pro_url?: string | null;
  pro_description?: string | null;
  pro_results?: string | string[] | null;
  pro_tag?: string | string[] | null;
  pro_badge?: string | null;
  test_name?: string | null;
  test_company?: string | null;
  test_role?: string | null;
  test_description?: string | null;
  test_url?: string | null;
  test_rate?: number | null;
  tile_name?: string | null;
  tile_url?: string | null;
  tile_description?: string | null;
  ser_name?: string | null;
  ser_url?: string | null;
  ser_description?: string | null;
  ser_icon?: string | null;
  ser_tag?: string | null;
  cc_name?: string | null;
  cc_description?: string | null;
  cc_icon?: string | null;
  pc_name?: string | null;
  pc_number?: string | null;
  pc_description?: string | null;
  pc_icon?: string | null;
  pc_timeline?: string | null;
};

export type ContentSection = {
  id: number;
  content_page_id: number;
  section_key: string;
  section_type: "heading-text" | "approach-table";
  title: string;
  name: string;
  content: string;
  is_visible: boolean;
  sort_order: number;
  fields: Record<string, unknown>;
  updated_at: string | null;
  items?: ContentItem[];
  
  // Heading Text fields
  description?: string | null;
  tag?: string | null;
  subheading1?: string | null;
  subheading2?: string | null;
  subtext?: string | null;
  
  // Approach Table fields
  left_heading?: string | null;
  right_heading?: string | null;
  left_points?: string[] | null;
  right_points?: string[] | null;
};

export type ContentPage = {
  id: number;
  title: string;
  slug: string;
  status: "published" | "draft";
  seo_title: string;
  seo_description: string;
  meta_keywords: string;
  service_id: number | null;
  service?: { id: number; name: string; slug: string } | null;
  service_name: string | null;
  sync_token: string | null;
  updated_at: string | null;
  sections: ContentSection[];
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string[]> | string[];
};

// Error types for better error handling
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class AuthError extends ApiError {
  constructor(message: string = "Authentication required. Please log in.") {
    super(message, 401);
    this.name = "AuthError";
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = "Administrator access required.") {
    super(message, 403, { admin: ["Administrator access required."] });
    this.name = "ForbiddenError";
  }
}

// Helper to check if user is authenticated
export function isAuthenticated(): boolean {
  return !!getStoredToken();
}

// Get auth headers
function authHeaders(): HeadersInit {
  const token = getStoredToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// Handle API response and throw appropriate errors
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`;
    let errors: Record<string, string[]> | undefined;
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
      errors = errorData.errors;
    } catch {
      // Response wasn't JSON, use status text
      errorMessage = response.statusText || errorMessage;
    }
    
    // Handle specific status codes
    if (response.status === 401) {
      // Clear auth on 401 - token is invalid/expired
      clearStoredAuth();
      throw new AuthError();
    }
    
    if (response.status === 403) {
      throw new ForbiddenError();
    }
    
    throw new ApiError(errorMessage, response.status, errors);
  }
  
  const json = await response.json();
  
  // Unwrap { success, data } envelope
  if ("success" in json && json.success) {
    return json.data as T;
  }
  
  if ("success" in json && !json.success) {
    throw new ApiError(json.message || "Request failed", response.status, json.errors);
  }
  
  return json as T;
}

// Generic request wrapper
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...authHeaders(),
      ...(options.headers || {}),
    },
    credentials: "include",
  });
  
  return handleResponse<T>(response);
}

// Content Pages API
export const contentApi = {
  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch {
      return false;
    }
  },

  // Content Pages
  pages: {
    list: (): Promise<ContentPage[]> =>
      request<ContentPage[]>("/content-pages"),

    get: (slug: string): Promise<ContentPage> =>
      request<ContentPage>(`/content-pages/${slug}`),

    create: (data: Partial<ContentPage>): Promise<ContentPage> =>
      request<ContentPage>("/content-pages", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    update: (slug: string, data: Partial<ContentPage>): Promise<ContentPage> =>
      request<ContentPage>(`/content-pages/${slug}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),

    delete: (slug: string): Promise<{ page_id: number }> =>
      request<{ page_id: number }>(`/content-pages/${slug}`, {
        method: "DELETE",
      }),
  },

  // Content Sections
  sections: {
    list: (pageSlug: string): Promise<{ sections: ContentSection[] }> =>
      request<{ sections: ContentSection[] }>(`/content-pages/${pageSlug}/sections`),

    create: (pageSlug: string, data: Partial<ContentSection>): Promise<{ section: ContentSection }> =>
      request<{ section: ContentSection }>(`/content-pages/${pageSlug}/sections`, {
        method: "POST",
        body: JSON.stringify(data),
      }),

    update: (pageSlug: string, sectionId: number, data: Partial<ContentSection>): Promise<{ section: ContentSection }> =>
      request<{ section: ContentSection }>(`/content-pages/${pageSlug}/sections/${sectionId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),

    delete: (pageSlug: string, sectionId: number): Promise<{ section_id: number }> =>
      request<{ section_id: number }>(`/content-pages/${pageSlug}/sections/${sectionId}`, {
        method: "DELETE",
      }),
  },

  // Content Items
  items: {
    list: (sectionId: number): Promise<{ items: ContentItem[] }> =>
      request<{ items: ContentItem[] }>(`/content-sections/${sectionId}/items`),

    create: (sectionId: number, data: Record<string, unknown>): Promise<{ item: ContentItem }> =>
      request<{ item: ContentItem }>(`/content-sections/${sectionId}/items`, {
        method: "POST",
        body: JSON.stringify(data),
      }),

    update: (sectionId: number, itemId: number, data: Record<string, unknown>): Promise<{ item: ContentItem }> =>
      request<{ item: ContentItem }>(`/content-sections/${sectionId}/items/${itemId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),

    delete: (sectionId: number, itemId: number): Promise<{ item_id: number }> =>
      request<{ item_id: number }>(`/content-sections/${sectionId}/items/${itemId}`, {
        method: "DELETE",
      }),

    reorder: (sectionId: number, items: { id: number; sort_order: number }[]): Promise<{ section_id: number }> =>
      request<{ section_id: number }>(`/content-sections/${sectionId}/items/reorder`, {
        method: "POST",
        body: JSON.stringify({ items }),
      }),
  },
};

export default contentApi;