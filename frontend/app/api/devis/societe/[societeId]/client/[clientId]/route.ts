import { NextRequest } from "next/server";
import { proxyApi } from "../../../../../proxy";

const getParams = async (
  context: { params: Promise<{ societeId: string; clientId: string }> }
) => context.params;

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ societeId: string; clientId: string }> }
) {
  const { societeId, clientId } = await getParams(context);
  return proxyApi(req, `/devis/societe/${societeId}/client/${clientId}`);
}
