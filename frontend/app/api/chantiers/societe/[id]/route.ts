import { NextRequest, NextResponse } from "next/server";

// Next.js validator types surface params as Promise; normalize once here
const getParams = async (context: { params: Promise<{ id: string }> }) => context.params;

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await getParams(context);
  // Exemple : récupération des chantiers pour la société id
  // const chantiers = await getChantiersBySocieteId(id);
  return NextResponse.json({ societeId: id });
}
