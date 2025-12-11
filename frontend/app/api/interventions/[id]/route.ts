import { NextRequest, NextResponse } from "next/server";
import { mockDb } from "@/lib/mock-db";

type Context = { params: Promise<{ id: string }> };

const findIndex = (id: number) =>
  mockDb.interventions.findIndex((intervention) => intervention.id === id);

export async function GET(_: NextRequest, { params }: Context) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  const intervention = mockDb.interventions.find((item) => item.id === id);
  if (!intervention) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(intervention);
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
    ...mockDb.interventions[index],
    ...payload,
    societeId:
      payload.societeId !== undefined
        ? Number(payload.societeId)
        : mockDb.interventions[index].societeId,
    chantierId:
      payload.chantierId !== undefined
        ? Number(payload.chantierId)
        : mockDb.interventions[index].chantierId,
    clientId:
      payload.clientId !== undefined
        ? Number(payload.clientId)
        : mockDb.interventions[index].clientId,
  };
  mockDb.interventions[index] = updated;
  return NextResponse.json(updated);
}

export async function DELETE(_: NextRequest, { params }: Context) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  const index = findIndex(id);
  if (index === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const [removed] = mockDb.interventions.splice(index, 1);
  return NextResponse.json(removed);
}
