import { NextRequest } from "next/server";
import { proxyApi } from "../../../proxy";

interface Params {
  params: { id: string };
}

export async function POST(req: NextRequest, { params }: Params) {
  return proxyApi(req, `/factures/${params.id}/paiements`);
}
