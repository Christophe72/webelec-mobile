import { NextResponse } from "next/server";
import { getPieceRecord } from "../../_helpers";

type Context = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Context) {
  const { id } = await params;
  const numericId = Number(id);
  const piece = getPieceRecord(numericId);
  if (!piece) {
    return NextResponse.json({ error: "Pièce introuvable" }, { status: 404 });
  }

  const rawBuffer = piece.data.buffer as ArrayBuffer;
  const arrayBuffer = rawBuffer.slice(
    piece.data.byteOffset,
    piece.data.byteOffset + piece.data.byteLength
  );

  return new NextResponse(arrayBuffer, {
    headers: {
      "Content-Type": piece.contentType,
      "Content-Disposition": `attachment; filename="${piece.originalFilename}"`
    }
  });
}
