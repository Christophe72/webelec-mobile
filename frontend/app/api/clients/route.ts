import { NextRequest, NextResponse } from "next/server";
import { mockDb } from "@/lib/mock-db";

export async function GET() {
  return NextResponse.json(mockDb.clients);
}

export async function POST(req: NextRequest) {
  const payload = await req.json();
  const societe =
    mockDb.societes.find((item) => item.id === Number(payload.societeId)) ?? null;
  const newClient = {
    id: mockDb.nextClientId++,
    nom: payload.nom,
    prenom: payload.prenom,
    telephone: payload.telephone,
    adresse: payload.adresse,
    societe: societe ? { id: societe.id, nom: societe.nom } : null
  };
  mockDb.clients.push(newClient);
  return NextResponse.json(newClient, { status: 201 });
}
