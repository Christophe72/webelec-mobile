import { NextRequest, NextResponse } from "next/server";
import { mockDb } from "@/lib/mock-db";

// Normalize params from validator (Promise) to plain object
const getParams = async (context: { params: Promise<{ id: string }> }) => context.params;

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await getParams(context);
  const numericId = Number(id);
  const client = mockDb.clients.find((c) => c.id === numericId);
  if (!client) {
    return NextResponse.json({ message: "Client introuvable" }, { status: 404 });
  }
  return NextResponse.json(client);
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await getParams(context);
  const numericId = Number(id);
  const client = mockDb.clients.find((c) => c.id === numericId);
  if (!client) {
    return NextResponse.json({ message: "Client introuvable" }, { status: 404 });
  }
  const payload = await req.json();
  Object.assign(client, payload, { id: client.id });
  return NextResponse.json(client);
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await getParams(context);
  const numericId = Number(id);
  const index = mockDb.clients.findIndex((c) => c.id === numericId);
  if (index === -1) {
    return NextResponse.json({ message: "Client introuvable" }, { status: 404 });
  }
  mockDb.clients.splice(index, 1);
  mockDb.chantiers = mockDb.chantiers.filter((chantier) => chantier.client?.id !== numericId);
  return NextResponse.json({ success: true });
}
