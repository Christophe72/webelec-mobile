import { NextRequest, NextResponse } from "next/server";
import { mockDb } from "@/lib/mock-db";

const getParams = async (context: { params: Promise<{ societeId: string }> }) => context.params;

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ societeId: string }> }
) {
  const { societeId } = await getParams(context);
  const numericId = Number(societeId);
  const devis = mockDb.devis.filter((d) => d.societeId === numericId);
  return NextResponse.json(devis);
}
