import { NextRequest, NextResponse } from "next/server";
import { mockDb } from "@/lib/mock-db";

export async function GET(req: NextRequest) {
  const societeId = req.nextUrl.searchParams.get("societeId");
  if (!societeId) {
    return NextResponse.json(mockDb.produits);
  }
  const numericId = Number(societeId);
  const filtered = mockDb.produits.filter(
    (produit) => produit.societeId === numericId
  );
  return NextResponse.json(filtered);
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
