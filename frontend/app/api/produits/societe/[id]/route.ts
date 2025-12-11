import { NextResponse } from "next/server";
import { mockDb } from "@/lib/mock-db";

type Context = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Context) {
  const { id: idParam } = await params;
  const societeId = Number(idParam);
  const items = mockDb.produits.filter(
    (produit) => produit.societeId === societeId
  );
  return NextResponse.json(items);
}
