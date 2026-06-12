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

const API_ROOT = normalizeApiRoot(
  (import.meta.env.VITE_API_URL as string | undefined) || "/api"
);

export const API_BASE_URL = `${API_ROOT}/v1`;
