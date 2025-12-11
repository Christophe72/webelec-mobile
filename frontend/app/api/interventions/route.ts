import { NextRequest, NextResponse } from "next/server";
import { mockDb } from "@/lib/mock-db";

export async function GET() {
  return NextResponse.json(mockDb.interventions);
}

export async function POST(req: NextRequest) {
  const payload = await req.json();
  const newIntervention = {
    id: mockDb.nextInterventionId++,
    titre: payload.titre ?? "Nouvelle intervention",
    description: payload.description ?? "",
    dateIntervention: payload.dateIntervention ?? new Date().toISOString(),
    societeId: Number(payload.societeId) || 0,
    chantierId: payload.chantierId ? Number(payload.chantierId) : undefined,
    clientId: payload.clientId ? Number(payload.clientId) : undefined,
    statut: payload.statut ?? "PLANIFIEE"
  };
  mockDb.interventions.push(newIntervention);
  return NextResponse.json(newIntervention, { status: 201 });
}
