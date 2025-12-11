import { NextRequest } from "next/server";
import { proxyApi } from "../../proxy";

export async function POST(req: NextRequest) {
  return proxyApi(req, "/stock/mouvements");
}
