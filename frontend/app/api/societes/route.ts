import { NextRequest } from "next/server";
import { addSociete, listSocietes } from "./store";

export async function GET() {
  return Response.json(listSocietes());
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    if (!name) {
      return new Response("Field 'name' is required", { status: 400 });
    }
    const societe = addSociete({
      name,
      description: body?.description ?? "",
      city: body?.city ?? "",
    });
    return Response.json(societe, { status: 201 });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return new Response("Invalid JSON payload", { status: 400 });
  }
}
// ajouter delete
export async function DELETE(req: NextRequest) {
  return new Response("Method Not Allowed", { status: 405 });
}