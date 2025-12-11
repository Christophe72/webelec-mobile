import { NextRequest, NextResponse } from "next/server";
import { mockDb } from "@/lib/mock-db";

// Next.js typed routes may surface params as a Promise in validator types; normalize by awaiting once
const getParams = async (context: { params: Promise<{ id: string }> }) => context.params;

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await getParams(context);
  const numericId = Number(id);
  const chantier = mockDb.chantiers.find((c) => c.id === numericId);
  if (!chantier) {
    return NextResponse.json({ message: "Chantier introuvable" }, { status: 404 });
  }
  return NextResponse.json(chantier);
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await getParams(context);
  const numericId = Number(id);
  const chantier = mockDb.chantiers.find((c) => c.id === numericId);
  if (!chantier) {
    return NextResponse.json({ message: "Chantier introuvable" }, { status: 404 });
  }
  const payload = await req.json();
  if (payload.nom !== undefined) {
    chantier.nom = payload.nom;
  }
  if (payload.adresse !== undefined) {
    chantier.adresse = payload.adresse;
  }
  if (payload.description !== undefined) {
    chantier.description = payload.description;
  }
  if (payload.societeId) {
    const societe = mockDb.societes.find((s) => s.id === payload.societeId) || null;
    chantier.societe = societe ? { id: societe.id, nom: societe.nom } : null;
  }
  if (payload.clientId) {
    const client = mockDb.clients.find((c) => c.id === payload.clientId) || null;
    chantier.client = client
      ? { id: client.id, nom: client.nom, prenom: client.prenom ?? null }
      : null;
  }
  return NextResponse.json(chantier);
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await getParams(context);
  const numericId = Number(id);
  const index = mockDb.chantiers.findIndex((c) => c.id === numericId);
  if (index === -1) {
    return NextResponse.json({ message: "Chantier introuvable" }, { status: 404 });
  }
  mockDb.chantiers.splice(index, 1);
  return NextResponse.json({ success: true });
}
