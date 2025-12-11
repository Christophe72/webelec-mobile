import { NextRequest, NextResponse } from "next/server";
import { mockDb } from "@/lib/mock-db";

const getParams = async (context: { params: Promise<{ id: string }> }) =>
  context.params;

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await getParams(context);
  const numericId = Number(id);
  const module = mockDb.modules.find((m) => m.id === numericId);
  if (!module) {
    return NextResponse.json({ message: "Module introuvable" }, { status: 404 });
  }
  return NextResponse.json(module);
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await getParams(context);
  const numericId = Number(id);
  const module = mockDb.modules.find((m) => m.id === numericId);
  if (!module) {
    return NextResponse.json({ message: "Module introuvable" }, { status: 404 });
  }
  const payload = await req.json();
  Object.assign(module, payload, { id: module.id });
  return NextResponse.json(module);
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await getParams(context);
  const numericId = Number(id);
  const index = mockDb.modules.findIndex((m) => m.id === numericId);
  if (index === -1) {
    return NextResponse.json({ message: "Module introuvable" }, { status: 404 });
  }
  mockDb.modules.splice(index, 1);
  return NextResponse.json({ success: true });
}
