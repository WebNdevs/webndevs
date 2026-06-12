function normalizeApiRoot(input: string): string {
  const trimmed = input.replace(/\/+$/, "");

  if (/^https?:\/\//i.test(trimmed)) {
    const url = new URL(trimmed);
    if (url.hostname === "localhost") {
      url.hostname = "127.0.0.1";
    }
    if (!url.pathname || url.pathname === "/") {
      url.pathname = "/api";
    }
    return url.toString().replace(/\/+$/, "");
  }

  if (!trimmed || trimmed === "/") {
    return "/api";
  }

  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

export const API_ROOT = normalizeApiRoot(
  (import.meta.env.VITE_API_URL as string | undefined) || "/api"
);

export const API_ORIGIN = API_ROOT.startsWith("http") ? new URL(API_ROOT).origin : "";
export const API_BASE_URL = `${API_ROOT}/v1`;

export async function apiFetch<T>(endpoint: string, init?: RequestInit): Promise<T> {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    ...init,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  const json = await response.json();
  // Unwrap { success, data } envelope when present; otherwise return raw
  return ("success" in json ? json.data : json) as T;
}
