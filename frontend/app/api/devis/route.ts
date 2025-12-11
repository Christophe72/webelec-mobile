import { NextRequest } from "next/server";
import { proxyApi } from "../proxy";

export async function GET(req: NextRequest) {
  return proxyApi(req, "/devis");
}

export async function POST(req: NextRequest) {
  return proxyApi(req, "/devis");
}
