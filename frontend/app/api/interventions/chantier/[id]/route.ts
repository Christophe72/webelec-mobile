import { NextResponse } from "next/server";
import { mockDb } from "@/lib/mock-db";

type Context = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Context) {
  const { id: idParam } = await params;
  const chantierId = Number(idParam);
  const items = mockDb.interventions.filter(
    (intervention) => intervention.chantierId === chantierId
  );
  return NextResponse.json(items);
}
