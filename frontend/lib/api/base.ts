const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export async function api<T>(
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
    const message = await res.text();
    throw new Error(`API error ${res.status}: ${message}`);
  }

  return res.json() as Promise<T>;
}
