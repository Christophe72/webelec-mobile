const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

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

    const baseMessage = `API error ${res.status}${res.statusText ? `: ${res.statusText}` : ""}`;
    const message =
      apiError?.message ||
      (typeof errorBody === "string" && errorBody.trim()) ||
      baseMessage;

    const error = new Error(message);
    (error as any).status = res.status;
    (error as any).body = errorBody;
    if (apiError?.details) {
      (error as any).details = apiError.details;
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
