import { bffFetch } from "@/lib/api/bffFetch";

const API_URL = "/api";

function buildApiUrl(endpoint: string): string {
  if (endpoint.startsWith("/api/")) return endpoint;
  if (endpoint.startsWith("/")) return `${API_URL}${endpoint}`;
  return `${API_URL}/${endpoint}`;
}

export interface ApiError extends Error {
  status?: number;
  body?: unknown;
  details?: unknown;
}

export async function api<T = unknown>(
  token: string,
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const baseHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  return bffFetch<T>(buildApiUrl(endpoint), token, {
    ...options,
    headers: baseHeaders,
    credentials: options.credentials ?? "include"
  });
}
