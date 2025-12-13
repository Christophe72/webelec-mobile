import { NextRequest, NextResponse } from "next/server";
import { mockDb } from "@/lib/mock-db";
import { toPieceResponse } from "../_helpers";

function parseId(value: FormDataEntryValue | null): number | undefined {
  if (value === null) {
    return undefined;
  }
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : undefined;
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Fichier requis" }, { status: 400 });
  }

  const interventionId = parseId(formData.get("interventionId"));
  const devisId = parseId(formData.get("devisId"));
  const factureId = parseId(formData.get("factureId"));

  if (!interventionId && !devisId && !factureId) {
    return NextResponse.json(
      { error: "Associe la pièce à une intervention, un devis ou une facture." },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const id = mockDb.nextPieceId++;
  const piece = {
    id,
    filename: `piece-${id}-${file.name}`.replace(/\s+/g, "-"),
    originalFilename: file.name,
    contentType: file.type || "application/octet-stream",
    fileSize: file.size,
    type: (formData.get("type")?.toString() || "AUTRE").toUpperCase(),
    downloadUrl: `/api/pieces/${id}/download`,
    uploadDate: new Date().toISOString(),
    interventionId,
    devisId,
    factureId,
    data: buffer
  };

  mockDb.pieces.push(piece);
  return NextResponse.json(toPieceResponse(piece), { status: 201 });
}
