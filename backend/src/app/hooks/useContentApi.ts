/**
 * Content Pages API Hook with proper error handling
 * Provides authentication-aware API calls for content pages
 */
import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { contentApi, ContentPage, ContentSection, ContentItem, ApiError, AuthError, ForbiddenError } from "../utils/content-api";

// Types for hook state
type LoadingState = {
  pages: boolean;
  page: boolean;
  section: boolean;
  item: boolean;
  saving: boolean;
  deleting: boolean;
};

type ErrorState = {
  pages: string | null;
  page: string | null;
  section: string | null;
  item: string | null;
  global: string | null;
};

export function useContentApi() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<LoadingState>({
    pages: false,
    page: false,
    section: false,
    item: false,
    saving: false,
    deleting: false,
  });
  const [errors, setErrors] = useState<ErrorState>({
    pages: null,
    page: null,
    section: null,
    item: null,
    global: null,
  });

  // Helper to handle API errors
  const handleError = useCallback((error: unknown, context: keyof ErrorState = "global") => {
    let message = "An unexpected error occurred.";
    
    if (error instanceof AuthError) {
      message = "Session expired. Please log in again.";
      // Redirect to login after a short delay
      setTimeout(() => navigate("/login"), 2000);
    } else if (error instanceof ForbiddenError) {
      message = "Administrator access required. Please contact your admin.";
    } else if (error instanceof ApiError) {
      message = error.message;
    } else if (error instanceof Error) {
      message = error.message;
    }
    
    setErrors(prev => ({ ...prev, [context]: message }));
    return message;
  }, [navigate]);

  // Clear specific error
  const clearError = useCallback((context: keyof ErrorState = "global") => {
    setErrors(prev => ({ ...prev, [context]: null }));
  }, []);

  // Clear all errors
  const clearAllErrors = useCallback(() => {
    setErrors({
      pages: null,
      page: null,
      section: null,
      item: null,
      global: null,
    });
  }, []);

  // Health check
  const checkHealth = useCallback(async (): Promise<boolean> => {
    try {
      return await contentApi.healthCheck();
    } catch {
      return false;
    }
  }, []);

  // Pages operations
  const loadPages = useCallback(async (): Promise<ContentPage[]> => {
    setLoading(prev => ({ ...prev, pages: true }));
    setErrors(prev => ({ ...prev, pages: null }));
    try {
      const pages = await contentApi.pages.list();
      return pages;
    } catch (error) {
      handleError(error, "pages");
      return [];
    } finally {
      setLoading(prev => ({ ...prev, pages: false }));
    }
  }, [handleError]);

  const loadPage = useCallback(async (slug: string): Promise<ContentPage | null> => {
    setLoading(prev => ({ ...prev, page: true }));
    setErrors(prev => ({ ...prev, page: null }));
    try {
      const page = await contentApi.pages.get(slug);
      return page;
    } catch (error) {
      handleError(error, "page");
      return null;
    } finally {
      setLoading(prev => ({ ...prev, page: false }));
    }
  }, [handleError]);

  const createPage = useCallback(async (data: Partial<ContentPage>): Promise<ContentPage | null> => {
    setLoading(prev => ({ ...prev, saving: true }));
    setErrors(prev => ({ ...prev, global: null }));
    try {
      const page = await contentApi.pages.create(data);
      return page;
    } catch (error) {
      handleError(error, "global");
      return null;
    } finally {
      setLoading(prev => ({ ...prev, saving: false }));
    }
  }, [handleError]);

  const updatePage = useCallback(async (slug: string, data: Partial<ContentPage>): Promise<ContentPage | null> => {
    setLoading(prev => ({ ...prev, saving: true }));
    setErrors(prev => ({ ...prev, global: null }));
    try {
      const page = await contentApi.pages.update(slug, data);
      return page;
    } catch (error) {
      handleError(error, "global");
      return null;
    } finally {
      setLoading(prev => ({ ...prev, saving: false }));
    }
  }, [handleError]);

  const deletePage = useCallback(async (slug: string): Promise<boolean> => {
    setLoading(prev => ({ ...prev, deleting: true }));
    setErrors(prev => ({ ...prev, global: null }));
    try {
      await contentApi.pages.delete(slug);
      return true;
    } catch (error) {
      handleError(error, "global");
      return false;
    } finally {
      setLoading(prev => ({ ...prev, deleting: false }));
    }
  }, [handleError]);

  // Section operations
  const createSection = useCallback(async (pageSlug: string, data: Partial<ContentSection>): Promise<ContentSection | null> => {
    setLoading(prev => ({ ...prev, saving: true }));
    setErrors(prev => ({ ...prev, section: null }));
    try {
      const result = await contentApi.sections.create(pageSlug, data);
      return result.section;
    } catch (error) {
      handleError(error, "section");
      return null;
    } finally {
      setLoading(prev => ({ ...prev, saving: false }));
    }
  }, [handleError]);

  const updateSection = useCallback(async (pageSlug: string, sectionId: number, data: Partial<ContentSection>): Promise<ContentSection | null> => {
    setLoading(prev => ({ ...prev, saving: true }));
    setErrors(prev => ({ ...prev, section: null }));
    try {
      const result = await contentApi.sections.update(pageSlug, sectionId, data);
      return result.section;
    } catch (error) {
      handleError(error, "section");
      return null;
    } finally {
      setLoading(prev => ({ ...prev, saving: false }));
    }
  }, [handleError]);

  const deleteSection = useCallback(async (pageSlug: string, sectionId: number): Promise<boolean> => {
    setLoading(prev => ({ ...prev, deleting: true }));
    setErrors(prev => ({ ...prev, section: null }));
    try {
      await contentApi.sections.delete(pageSlug, sectionId);
      return true;
    } catch (error) {
      handleError(error, "section");
      return false;
    } finally {
      setLoading(prev => ({ ...prev, deleting: false }));
    }
  }, [handleError]);

  // Item operations
  const loadItems = useCallback(async (sectionId: number): Promise<ContentItem[]> => {
    setLoading(prev => ({ ...prev, item: true }));
    setErrors(prev => ({ ...prev, item: null }));
    try {
      const result = await contentApi.items.list(sectionId);
      return result.items;
    } catch (error) {
      handleError(error, "item");
      return [];
    } finally {
      setLoading(prev => ({ ...prev, item: false }));
    }
  }, [handleError]);

  const createItem = useCallback(async (sectionId: number, data: Record<string, unknown>): Promise<ContentItem | null> => {
    setLoading(prev => ({ ...prev, saving: true }));
    setErrors(prev => ({ ...prev, item: null }));
    try {
      const result = await contentApi.items.create(sectionId, data);
      return result.item;
    } catch (error) {
      handleError(error, "item");
      return null;
    } finally {
      setLoading(prev => ({ ...prev, saving: false }));
    }
  }, [handleError]);

  const updateItem = useCallback(async (sectionId: number, itemId: number, data: Record<string, unknown>): Promise<ContentItem | null> => {
    setLoading(prev => ({ ...prev, saving: true }));
    setErrors(prev => ({ ...prev, item: null }));
    try {
      const result = await contentApi.items.update(sectionId, itemId, data);
      return result.item;
    } catch (error) {
      handleError(error, "item");
      return null;
    } finally {
      setLoading(prev => ({ ...prev, saving: false }));
    }
  }, [handleError]);

  const deleteItem = useCallback(async (sectionId: number, itemId: number): Promise<boolean> => {
    setLoading(prev => ({ ...prev, deleting: true }));
    setErrors(prev => ({ ...prev, item: null }));
    try {
      await contentApi.items.delete(sectionId, itemId);
      return true;
    } catch (error) {
      handleError(error, "item");
      return false;
    } finally {
      setLoading(prev => ({ ...prev, deleting: false }));
    }
  }, [handleError]);

  return {
    // State
    loading,
    errors,
    
    // Error handling
    clearError,
    clearAllErrors,
    
    // Health check
    checkHealth,
    
    // Pages
    loadPages,
    loadPage,
    createPage,
    updatePage,
    deletePage,
    
    // Sections
    createSection,
    updateSection,
    deleteSection,
    
    // Items
    loadItems,
    createItem,
    updateItem,
    deleteItem,
  };
}

export default useContentApi;