import { NextRequest } from "next/server";
import { proxyApi } from "../../../proxy";

interface Params {
  params: { id: string };
}

export async function GET(req: NextRequest, { params }: Params) {
  return proxyApi(req, `/chantiers/societe/${params.id}`);
}
