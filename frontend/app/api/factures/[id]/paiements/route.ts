import { NextRequest } from "next/server";
import { proxyApi } from "../../../proxy";

const getParams = async (context: { params: Promise<{ id: string }> }) => context.params;

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await getParams(context);
  return proxyApi(req, `/factures/${id}/paiements`);
}
