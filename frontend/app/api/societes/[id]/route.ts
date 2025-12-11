import { NextRequest, NextResponse } from "next/server";
import { mockDb } from "@/lib/mock-db";

const getParams = async (context: { params: Promise<{ id: string }> }) => context.params;

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await getParams(context);
  const numericId = Number(id);
  const societe = mockDb.societes.find((s) => s.id === numericId);
  if (!societe) {
    return NextResponse.json({ message: "Société introuvable" }, { status: 404 });
  }
  return NextResponse.json(societe);
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await getParams(context);
  const numericId = Number(id);
  const index = mockDb.societes.findIndex((s) => s.id === numericId);
  if (index === -1) {
    return NextResponse.json({ message: "Société introuvable" }, { status: 404 });
  }
  mockDb.societes.splice(index, 1);
  mockDb.clients = mockDb.clients.filter((client) => client.societeId !== numericId);
  mockDb.chantiers = mockDb.chantiers.filter((chantier) => chantier.societe?.id !== numericId);
  return NextResponse.json({ success: true });
}
