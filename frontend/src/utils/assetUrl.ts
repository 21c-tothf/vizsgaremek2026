const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api";

export function resolveAssetUrl(path?: string): string | undefined {
  if (!path) {
    return undefined;
  }

  if (/^(https?:|data:|blob:)/i.test(path)) {
    return path;
  }

  try {
    const origin = new URL(API_BASE_URL).origin;
    if (path.startsWith("/")) {
      return `${origin}${path}`;
    }
    return `${origin}/${path.replace(/^\/+/, "")}`;
  } catch {
    return path;
  }
}