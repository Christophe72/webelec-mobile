import { NextRequest, NextResponse } from "next/server";
import { mockDb } from "@/lib/mock-db";

export async function GET() {
  return NextResponse.json(mockDb.chantiers);
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
