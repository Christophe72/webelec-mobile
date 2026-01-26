import { getRefreshToken, getToken, setRefreshToken, setToken } from "@/lib/api/auth-storage";
import type { AuthResponseDTO } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_BASE;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE is not defined");
}

export interface ApiError extends Error {
  status?: number;
  body?: unknown;
  details?: unknown;
}

export async function api<T = unknown>(
  endpoint: string,
  options: RequestInit = {},
  retry: boolean = true
): Promise<T> {
  const baseHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  // Ajout automatique du token JWT côté navigateur
  if (typeof window !== "undefined") {
    const token = getToken();
    if (token && !("Authorization" in baseHeaders)) {
      (baseHeaders as Record<string, string>).Authorization = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: baseHeaders,
    cache: "no-store",
    credentials: options.credentials ?? "include"
  });

  if (res.status === 401 && typeof window !== "undefined" && retry) {
    const refreshedToken = await refreshAccessToken();
    if (refreshedToken) {
      return api<T>(
        endpoint,
        {
          ...options,
          headers: {
            ...(options.headers || {}),
            Authorization: `Bearer ${refreshedToken}`
          }
        },
        false
      );
    }
  }

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

  try {
    return (await res.json()) as T;
  } catch {
    // Si la réponse n'est pas du JSON, on renvoie undefined.
    return undefined as T;
  }
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
      credentials: "include"
    });

    if (!res.ok) return null;

    const data = (await res.json()) as AuthResponseDTO;
    if (!data?.accessToken) return null;

    setToken(data.accessToken);
    if (data.refreshToken) {
      setRefreshToken(data.refreshToken);
    }
    return data.accessToken;
  } catch {
    return null;
  }
}
