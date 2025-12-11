import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";

function buildHeaders(req: NextRequest): HeadersInit {
  const headers = new Headers(req.headers);
  headers.delete("host");
  headers.delete("connection");
  return headers;
}

export async function proxyApi(req: NextRequest, path: string): Promise<NextResponse> {
  const search = req.nextUrl.search || "";
  const upstreamUrl = `${API_BASE}${path}${search}`;
  const method = req.method.toUpperCase();
  const body = method === "GET" || method === "HEAD" ? undefined : await req.text();

  const res = await fetch(upstreamUrl, {
    method,
    headers: buildHeaders(req),
    body,
    cache: "no-store"
  });

  const resBody = await res.arrayBuffer();
  const response = new NextResponse(resBody, {
    status: res.status,
    statusText: res.statusText,
    headers: res.headers
  });
  return response;
}
