import { NextRequest, NextResponse } from "next/server";
import { mockDb } from "@/lib/mock-db";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const societeId = searchParams.get("societeId");
  const clientId = searchParams.get("clientId");

  const filtered = mockDb.devis.filter((devis) => {
    if (societeId && String(devis.societeId) !== societeId) {
      return false;
    }
    if (clientId && String(devis.clientId) !== clientId) {
      return false;
    }
    return true;
  });

  return NextResponse.json(filtered);
}

export async function POST(req: NextRequest) {
  const payload = await req.json();
  const newDevis = {
    ...payload,
    id: mockDb.nextDevisId++,
    lignes: payload.lignes ?? []
  };
  mockDb.devis.push(newDevis);
  return NextResponse.json(newDevis, { status: 201 });
}
