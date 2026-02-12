import { NextRequest } from "next/server";
import { proxyApi } from "../proxy";

export function GET(request: NextRequest) {
  return proxyApi(request, "/clients");
}

export function POST(request: NextRequest) {
  return proxyApi(request, "/clients");
}

export function PUT(request: NextRequest) {
  return proxyApi(request, "/clients");
}

export function DELETE(request: NextRequest) {
  return proxyApi(request, "/clients");
}
