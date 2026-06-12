function normalizeApiOrigin(origin: string): string {
  const trimmed = origin.replace(/\/+$/, "");
  try {
    const url = new URL(trimmed);
    if (url.hostname === "localhost") {
      url.hostname = "127.0.0.1";
    }
    return url.toString().replace(/\/+$/, "");
  } catch {
    return trimmed.replace("localhost", "127.0.0.1");
  }
}

const API_URL = normalizeApiOrigin(
  (import.meta.env.VITE_API_URL as string | undefined) || "http://127.0.0.1:8001"
);

export const API_ORIGIN = API_URL;
export const API_BASE_URL = `${API_URL}/api/v1`;

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
