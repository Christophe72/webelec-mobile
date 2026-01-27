import { NextRequest, NextResponse } from "next/server";

const RAW_API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ??
  process.env.API_BASE_URL ??
  "http://localhost:8080";
const API_BASE = RAW_API_BASE.endsWith("/api")
  ? RAW_API_BASE
  : `${RAW_API_BASE}/api`;

function buildHeaders(req: NextRequest): Headers {
  const headers = new Headers(req.headers);
  headers.delete("host");
  headers.delete("connection");
  return headers;
}

type RouteParams = { path?: string[] };

async function resolvePath(
  req: NextRequest,
  params?: RouteParams | Promise<RouteParams>
): Promise<string> {
  const resolvedParams = await Promise.resolve(params);
  if (resolvedParams?.path && resolvedParams.path.length > 0) {
    return resolvedParams.path.join("/");
  }
  return req.nextUrl.pathname.replace(/^\/api\/?/, "");
}

async function proxy(req: NextRequest, path: string): Promise<NextResponse> {
  if (!path) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }

  const search = req.nextUrl.search || "";
  const upstreamUrl = `${API_BASE}/${path}${search}`;
  const method = req.method.toUpperCase();

  const body =
    method === "GET" || method === "HEAD" ? undefined : await req.arrayBuffer();

  try {
    const res = await fetch(upstreamUrl, {
      method,
      headers: buildHeaders(req),
      body,
      cache: "no-store",
    });

    const resBody = await res.arrayBuffer();

    return new NextResponse(resBody, {
      status: res.status,
      statusText: res.statusText,
      headers: res.headers,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Proxy error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params?: RouteParams | Promise<RouteParams> }
) {
  return proxy(req, await resolvePath(req, params));
}

export async function POST(
  req: NextRequest,
  { params }: { params?: RouteParams | Promise<RouteParams> }
) {
  return proxy(req, await resolvePath(req, params));
}

export async function PUT(
  req: NextRequest,
  { params }: { params?: RouteParams | Promise<RouteParams> }
) {
  return proxy(req, await resolvePath(req, params));
}

export async function PATCH(
  req: NextRequest,
  { params }: { params?: RouteParams | Promise<RouteParams> }
) {
  return proxy(req, await resolvePath(req, params));
}

export async function DELETE(
  req: NextRequest,
  { params }: { params?: RouteParams | Promise<RouteParams> }
) {
  return proxy(req, await resolvePath(req, params));
}
