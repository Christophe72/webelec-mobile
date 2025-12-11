import { NextRequest, NextResponse } from "next/server";
import { mockDb } from "@/lib/mock-db";

export async function GET() {
  return NextResponse.json(mockDb.produits);
}

export async function POST(req: NextRequest) {
  const payload = await req.json();
  const newProduit = {
    id: mockDb.nextProduitId++,
    reference: payload.reference ?? `PRD-${mockDb.nextProduitId}`,
    nom: payload.nom ?? "Produit",
    description: payload.description ?? "",
    quantiteStock: Number(payload.quantiteStock) || 0,
    prixUnitaire: Number(payload.prixUnitaire) || 0,
    societeId: Number(payload.societeId) || 0
  };
  mockDb.produits.push(newProduit);
  return NextResponse.json(newProduit, { status: 201 });
}
