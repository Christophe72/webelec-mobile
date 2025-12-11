import { NextResponse } from "next/server";
import { mockDb } from "@/lib/mock-db";

type Context = { params: { id: string } };

export async function GET(_: Request, { params }: Context) {
  const societeId = Number(params.id);
  const items = mockDb.produits.filter(
    (produit) => produit.societeId === societeId
  );
  return NextResponse.json(items);
}
