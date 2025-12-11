import { NextRequest, NextResponse } from "next/server";
import { mockDb } from "@/lib/mock-db";

export async function GET() {
  return NextResponse.json(mockDb.modules);
}

export async function POST(req: NextRequest) {
  const payload = await req.json();
  const newModule = {
    id: mockDb.nextModuleId++,
    nom: payload.nom,
    description: payload.description ?? "",
    categorie: payload.categorie ?? "",
    version: payload.version ?? "",
    actif: Boolean(payload.actif)
  };
  mockDb.modules.push(newModule);
  return NextResponse.json(newModule, { status: 201 });
}
