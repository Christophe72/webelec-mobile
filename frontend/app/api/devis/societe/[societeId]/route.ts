import { NextRequest } from "next/server";
import { proxyApi } from "../../../proxy";

const getParams = async (context: { params: Promise<{ societeId: string }> }) => context.params;

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ societeId: string }> }
) {
  const { societeId } = await getParams(context);
  return proxyApi(req, `/devis/societe/${societeId}`);
}
