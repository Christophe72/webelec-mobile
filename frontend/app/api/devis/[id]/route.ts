import { NextRequest, NextResponse } from "next/server";
import { mockDb } from "@/lib/mock-db";

const getParams = async (context: { params: Promise<{ id: string }> }) => context.params;

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await getParams(context);
  const numericId = Number(id);
  const devis = mockDb.devis.find((d) => d.id === numericId);
  if (!devis) {
    return NextResponse.json({ message: "Devis introuvable" }, { status: 404 });
  }
  return NextResponse.json(devis);
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await getParams(context);
  const numericId = Number(id);
  const devis = mockDb.devis.find((d) => d.id === numericId);
  if (!devis) {
    return NextResponse.json({ message: "Devis introuvable" }, { status: 404 });
  }
  const payload = await req.json();
  Object.assign(devis, payload, { id: devis.id });
  return NextResponse.json(devis);
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await getParams(context);
  const numericId = Number(id);
  const index = mockDb.devis.findIndex((d) => d.id === numericId);
  if (index === -1) {
    return NextResponse.json({ message: "Devis introuvable" }, { status: 404 });
  }
  mockDb.devis.splice(index, 1);
  return NextResponse.json({ success: true });
}
