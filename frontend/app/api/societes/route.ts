import { NextRequest, NextResponse } from "next/server";
import { mockDb } from "@/lib/mock-db";

export async function GET() {
  return NextResponse.json(mockDb.societes);
}

export async function POST(req: NextRequest) {
  const payload = await req.json();
  const newSociete = {
    id: mockDb.nextSocieteId++,
    ...payload
  };
  mockDb.societes.push(newSociete);
  return NextResponse.json(newSociete, { status: 201 });
}
