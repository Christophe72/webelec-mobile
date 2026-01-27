import { NextResponse } from "next/server";

const RAW_API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ??
  process.env.API_BASE_URL ??
  "http://localhost:8080";
const API_BASE = RAW_API_BASE.endsWith("/api")
  ? RAW_API_BASE
  : `${RAW_API_BASE}/api`;

async function forward(request: Request, path: string) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { search } = new URL(request.url);
  const method = request.method.toUpperCase();
  const contentType = request.headers.get("content-type");

  const headers: Record<string, string> = {
    authorization: authHeader,
  };
  if (contentType) {
    headers["content-type"] = contentType;
  }

  const body =
    method === "GET" || method === "HEAD" ? undefined : await request.arrayBuffer();

  const res = await fetch(`${API_BASE}${path}${search}`, {
    method,
    headers,
    body,
    cache: "no-store",
  });

  const resBody = await res.arrayBuffer();

  return new NextResponse(resBody, {
    status: res.status,
    headers: {
      "content-type": res.headers.get("content-type") ?? "application/json",
    },
  });
}

export function GET(request: Request) {
  return forward(request, "/clients");
}

export function POST(request: Request) {
  return forward(request, "/clients");
}

export function PUT(request: Request) {
  return forward(request, "/clients");
}

export function DELETE(request: Request) {
  return forward(request, "/clients");
}
