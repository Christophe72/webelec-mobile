import { NextRequest } from "next/server";
import { proxyApi } from "../../../../../../proxy";

interface Params {
  params: { societeId: string; clientId: string };
}

export async function GET(req: NextRequest, { params }: Params) {
  return proxyApi(req, `/devis/societe/${params.societeId}/client/${params.clientId}`);
}
