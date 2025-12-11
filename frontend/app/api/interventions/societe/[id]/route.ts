import { NextResponse } from "next/server";
import { mockDb } from "@/lib/mock-db";

type Context = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Context) {
  const { id } = await params;
  const societeId = Number(id);
  const items = mockDb.interventions.filter(
    (intervention) => intervention.societeId === societeId
  );
  return NextResponse.json(items);
}
