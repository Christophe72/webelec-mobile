const API_URL = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";

interface ApiError extends Error {
  status?: number;
  body?: unknown;
  details?: unknown;
}

export async function api<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    cache: "no-store"
  });

  if (!res.ok) {
    const contentType = res.headers.get("content-type") ?? "";
    let errorBody: unknown = null;

    try {
      if (contentType.includes("application/json")) {
        errorBody = await res.json();
      } else {
        errorBody = await res.text();
      }
    } catch {
      // On ignore les erreurs de parsing et on retombe sur un message générique.
    }

    const apiError =
      errorBody && typeof errorBody === "object"
        ? (errorBody as { message?: string; details?: unknown })
        : null;

    const message = apiError?.message || `API Error: ${res.status} ${res.statusText}`;
    const error = new Error(message) as ApiError;
    error.status = res.status;
    error.body = errorBody;
    if (apiError?.details) {
      error.details = apiError.details;
    }

    throw error;
  }

  // Pas de contenu à parser (cas typique: 204 No Content)
  if (res.status === 204) {
    return undefined as T;
  }

  const contentLength = res.headers.get("content-length");
  if (!contentLength || contentLength === "0") {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}