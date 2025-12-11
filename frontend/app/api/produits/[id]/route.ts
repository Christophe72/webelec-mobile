import { NextRequest, NextResponse } from "next/server";
import { mockDb } from "@/lib/mock-db";

type Context = { params: Promise<{ id: string }> };

const findIndex = (id: number) =>
  mockDb.produits.findIndex((produit) => produit.id === id);

export async function GET(_: NextRequest, { params }: Context) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  const produit = mockDb.produits.find((item) => item.id === id);
  if (!produit) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(produit);
}

export async function PUT(req: NextRequest, { params }: Context) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  const index = findIndex(id);
  if (index === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const payload = await req.json();
  const updated = {
    ...mockDb.produits[index],
    ...payload,
    quantiteStock:
      payload.quantiteStock !== undefined
        ? Number(payload.quantiteStock)
        : mockDb.produits[index].quantiteStock,
    prixUnitaire:
      payload.prixUnitaire !== undefined
        ? Number(payload.prixUnitaire)
        : mockDb.produits[index].prixUnitaire,
    societeId:
      payload.societeId !== undefined
        ? Number(payload.societeId)
        : mockDb.produits[index].societeId,
  };
  mockDb.produits[index] = updated;
  return NextResponse.json(updated);
}

export async function DELETE(_: NextRequest, { params }: Context) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  const index = findIndex(id);
  if (index === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const [removed] = mockDb.produits.splice(index, 1);
  return NextResponse.json(removed);
}
