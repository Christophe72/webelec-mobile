import { NextRequest, NextResponse } from "next/server";
import { mockDb } from "@/lib/mock-db";

export async function POST(req: NextRequest) {
  const payload = await req.json();
  const produitId = Number(payload.produitId);
  const quantite = Number(payload.quantite);
  const type: "in" | "out" = payload.type === "out" ? "out" : "in";

  if (!Number.isFinite(produitId) || !Number.isFinite(quantite)) {
    return NextResponse.json(
      { error: "Paramètres invalides pour le mouvement de stock" },
      { status: 400 }
    );
  }

  const produit = mockDb.produits.find((p) => p.id === produitId);
  if (!produit) {
    return NextResponse.json(
      { error: "Produit introuvable pour le mouvement" },
      { status: 404 }
    );
  }

  const mouvement = {
    id: mockDb.nextStockMouvementId++,
    produitId,
    quantite,
    type,
    raison: payload.raison ?? "",
    date: new Date().toISOString()
  };
  mockDb.stockMouvements.unshift(mouvement);

  produit.quantiteStock += type === "out" ? -quantite : quantite;

  return NextResponse.json({
    ...mouvement,
    nouveauStock: produit.quantiteStock
  });
}
