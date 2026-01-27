type BffError = Error & { status?: number; body?: unknown };

export async function bffFetch<T>(
  url: string,
  token?: string | null,
  options: RequestInit = {}
): Promise<T> {
  if (!/^\/api(\/|$)/.test(url)) {
    throw new Error("bffFetch requiert un chemin /api/");
  }

  // DEV MODE : autoriser les appels sans token
  const isAuthDisabled = process.env.NEXT_PUBLIC_API_AUTH_DISABLED === "true";

  if (!token && !isAuthDisabled) {
    const error = new Error("BFF error 401 (missing access token)") as BffError;
    error.status = 401;
    throw error;
  }

  const headers = new Headers(options.headers ?? undefined);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(url, {
    ...options,
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    const error = new Error(`BFF error ${res.status}`) as BffError;
    error.status = res.status;
    try {
      const contentType = res.headers.get("content-type") ?? "";
      error.body = contentType.includes("application/json")
        ? await res.json()
        : await res.text();
    } catch {
      // ignore
    }
    throw error;
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
