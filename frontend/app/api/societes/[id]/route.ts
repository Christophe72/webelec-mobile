import { NextRequest } from "next/server";
import { deleteSociete, getSociete } from "../store";

type RouteParams = {
  id: string;
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  const { id } = await params;
  const societe = getSociete(id);

  if (!societe) {
    // 404 plus logique qu’un 500
    return new Response("Societe not found", { status: 404 });
  }

  return Response.json(societe);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  const { id } = await params;
  const deleted = deleteSociete(id);

  if (!deleted) {
    // idem, 404 si l’ID n’existe pas
    return new Response("Societe not found", { status: 404 });
  }

  return new Response(null, { status: 204 });
}
