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

export const API_BASE_URL = `${API_URL}/api/v1`;
