import { NextRequest } from "next/server";
import { proxyApi } from "../proxy";

export async function GET(req: NextRequest) {
  return proxyApi(req, "/societes");
}

export async function POST(req: NextRequest) {
  return proxyApi(req, "/societes");
}
