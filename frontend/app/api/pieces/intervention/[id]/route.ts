import { NextResponse } from "next/server";
import { listPiecesBy } from "../../_helpers";

type Context = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Context) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) {
    return NextResponse.json({ error: "ID intervention invalide" }, { status: 400 });
  }

  return NextResponse.json(listPiecesBy("interventionId", numericId));
}
