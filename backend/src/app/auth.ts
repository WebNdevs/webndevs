import { API_BASE_URL } from "../config/api.config";
export const PRIMARY_TOKEN_KEY = "wnd_admin_token";
export const TOKEN_KEYS = ["wnd_admin_token", "admin_token", "auth_token", "token", "access_token"] as const;

export function getStoredToken(): string {
  for (const key of TOKEN_KEYS) {
    const value = localStorage.getItem(key)?.trim();
    if (value) {
      if (key !== PRIMARY_TOKEN_KEY) {
        localStorage.setItem(PRIMARY_TOKEN_KEY, value);
      }
      return value;
    }
  }
  return "";
}

export function setStoredToken(token: string) {
  localStorage.setItem(PRIMARY_TOKEN_KEY, token);
  localStorage.setItem("wnd_session_expiry", String(Date.now() + 60 * 60 * 1000));
  localStorage.removeItem("wnd_session_grace_end");
}

export function clearStoredAuth() {
  for (const key of TOKEN_KEYS) {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  }
  localStorage.removeItem("wnd_session_expiry");
  localStorage.removeItem("wnd_session_grace_end");
}

export async function fetchAuthenticatedUser(token?: string) {
  const headers: HeadersInit = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    headers,
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Unauthorized");
  }
  return response;
}
