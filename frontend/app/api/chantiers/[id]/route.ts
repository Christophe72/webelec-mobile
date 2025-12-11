import { NextRequest } from "next/server";
import { proxyApi } from "../../proxy";

// Next.js typed routes may surface params as a Promise in validator types; normalize by awaiting once
const getParams = async (context: { params: Promise<{ id: string }> }) => context.params;

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await getParams(context);
  return proxyApi(req, `/chantiers/${id}`);
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await getParams(context);
  return proxyApi(req, `/chantiers/${id}`);
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await getParams(context);
  return proxyApi(req, `/chantiers/${id}`);
}
