import { NextRequest, NextResponse } from "next/server";
import { proxyApi } from "../proxy";

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
  return proxyApi(req, `/${path}`);
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
