import { NextRequest, NextResponse } from "next/server";
import { mockDb } from "@/lib/mock-db";

export async function GET(req: NextRequest) {
  const societeId = req.nextUrl.searchParams.get("societeId");
  if (!societeId) {
    return NextResponse.json(mockDb.chantiers);
  }
  const numericId = Number(societeId);
  const filtered = mockDb.chantiers.filter(
    (chantier) => chantier.societe?.id === numericId
  );
  return NextResponse.json(filtered);
}

export async function POST(req: NextRequest) {
  const payload = await req.json();
  const societe = mockDb.societes.find((s) => s.id === payload.societeId) || null;
  const client = mockDb.clients.find((c) => c.id === payload.clientId) || null;
  const newChantier = {
    id: mockDb.nextChantierId++,
    nom: payload.nom,
    adresse: payload.adresse,
    description: payload.description,
    societe: societe ? { id: societe.id, nom: societe.nom } : null,
    client: client
      ? { id: client.id, nom: client.nom, prenom: client.prenom ?? null }
      : null
  };
  mockDb.chantiers.push(newChantier);
  return NextResponse.json(newChantier, { status: 201 });
}
