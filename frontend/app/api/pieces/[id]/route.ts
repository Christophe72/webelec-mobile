import { NextRequest, NextResponse } from "next/server";
import { mockDb } from "@/lib/mock-db";
import { toPieceResponse } from "../_helpers";

type Context = { params: Promise<{ id: string }> };

const getParams = async (context: Context) => context.params;

export async function GET(
  _: NextRequest,
  context: Context
) {
  const { id } = await getParams(context);
  const numericId = Number(id);
  const piece = mockDb.pieces.find((p) => p.id === numericId);
  if (!piece) {
    return NextResponse.json({ error: "Pièce introuvable" }, { status: 404 });
  }
  return NextResponse.json(toPieceResponse(piece));
}

export async function DELETE(
  _: NextRequest,
  context: Context
) {
  const { id } = await getParams(context);
  const numericId = Number(id);
  const index = mockDb.pieces.findIndex((p) => p.id === numericId);
  if (index === -1) {
    return NextResponse.json({ error: "Pièce introuvable" }, { status: 404 });
  }
  mockDb.pieces.splice(index, 1);
  return NextResponse.json({ success: true });
}
