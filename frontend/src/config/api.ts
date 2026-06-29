function normalizeApiRoot(input: string): string {
  const trimmed = input.replace(/\/+$/, "");

  if (/^https?:\/\//i.test(trimmed)) {
    const url = new URL(trimmed);

    if (url.hostname === "localhost") {
      url.hostname = "127.0.0.1";
    }

    if (url.pathname === "" || url.pathname === "/") {
      url.pathname = "/api";
    }

    return url.toString().replace(/\/+$/, "");
  }

  if (!trimmed || trimmed === "/") {
    return "/api";
  }

  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

export const API_ROOT = normalizeApiRoot(process.env.NEXT_PUBLIC_API_URL || "/api");

export const API_ORIGIN = API_ROOT.startsWith("http") ? new URL(API_ROOT).origin : "";

export const API_BASE_URL = `${API_ROOT}/v1`;

export async function apiFetch<T>(endpoint: string, init: RequestInit = {}): Promise<T> {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const headers = new Headers(init.headers);

  if (!(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...init,
    headers,
  });

  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(message || `Request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return null as T;
  }

  const json = await response.json();

  return ("success" in json ? json.data : json) as T;
}