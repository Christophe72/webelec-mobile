import { NextRequest, NextResponse } from "next/server";

const PROXY_TIMEOUT_MS = 10000;

function trimTrailingSlash(base: string): string {
  return base.replace(/\/+$/, "");
}

function resolveApiBase(): string {
  const rawApiBase = process.env.NEXT_PUBLIC_API_BASE || process.env.API_BASE_URL;
  if (!rawApiBase) {
    throw new Error("Missing NEXT_PUBLIC_API_BASE or API_BASE_URL for API proxy");
  }
  const normalized = trimTrailingSlash(rawApiBase);
  return normalized.endsWith("/api") ? normalized : `${normalized}/api`;
}

const API_BASE = resolveApiBase();

function buildHeaders(req: NextRequest): HeadersInit {
  const headers = new Headers(req.headers);
  headers.delete("host");
  headers.delete("connection");
  return headers;
}

/**
 * Proxies an API request to the upstream API server.
 *
 * @param req - The incoming request object.
 * @param path - The path to proxy to, relative to the API base.
 * @returns A NextResponse object containing the response from the upstream server.
 */
export async function proxyApi(
  req: NextRequest,
  path: string
): Promise<NextResponse> {
  const search = req.nextUrl.search || "";
  const upstreamUrl = `${API_BASE}${path}${search}`;
  const method = req.method.toUpperCase();

  const body =
    method === "GET" || method === "HEAD" ? undefined : await req.text();

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PROXY_TIMEOUT_MS);

  try {
    const res = await fetch(upstreamUrl, {
      method,
      headers: buildHeaders(req),
      body,
      cache: "no-store",
      signal: controller.signal,
    });

    const resBody = await res.arrayBuffer();

    return new NextResponse(resBody, {
      status: res.status,
      statusText: res.statusText,
      headers: res.headers,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Proxy error";
    const status = err instanceof Error && err.name === "AbortError" ? 504 : 502;
    return NextResponse.json({ error: message }, { status });
  } finally {
    clearTimeout(timeout);
  }
}
