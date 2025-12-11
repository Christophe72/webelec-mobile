import { NextResponse } from "next/server";
import { mockDb } from "@/lib/mock-db";

type Context = { params: { id: string } };

export async function GET(_: Request, { params }: Context) {
  const chantierId = Number(params.id);
  const items = mockDb.interventions.filter(
    (intervention) => intervention.chantierId === chantierId
  );
  return NextResponse.json(items);
}
