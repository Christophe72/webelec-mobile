import { NextResponse } from "next/server";
import { mockDb } from "@/lib/mock-db";

type Context = { params: { id: string } };

export async function GET(_: Request, { params }: Context) {
  const societeId = Number(params.id);
  const items = mockDb.interventions.filter(
    (intervention) => intervention.societeId === societeId
  );
  return NextResponse.json(items);
}
