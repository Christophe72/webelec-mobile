import { NextRequest, NextResponse } from "next/server";
import { mockDb } from "@/lib/mock-db";

export async function GET() {
  return NextResponse.json(mockDb.clients);
}

export async function POST(req: NextRequest) {
  const payload = await req.json();
  const newClient = {
    id: mockDb.nextClientId++,
    ...payload
  };
  mockDb.clients.push(newClient);
  return NextResponse.json(newClient, { status: 201 });
}
