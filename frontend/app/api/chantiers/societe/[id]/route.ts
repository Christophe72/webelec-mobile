import { NextRequest, NextResponse } from "next/server";
import { mockDb } from "@/lib/mock-db";

const getParams = async (context: { params: Promise<{ id: string }> }) => context.params;

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await getParams(context);
  const numericId = Number(id);
  const chantiers = mockDb.chantiers.filter(
    (chantier) => chantier.societe?.id === numericId
  );
  return NextResponse.json(chantiers);
}
