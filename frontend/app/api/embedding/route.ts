import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  const { text } = await req.json();
  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "text requis" }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY manquant côté serveur" },
      { status: 500 }
    );
  }

  const client = new OpenAI({ apiKey });

  const r = await client.embeddings.create({
    model: "text-embedding-3-large",
    input: text,
  });

  return NextResponse.json(r.data[0].embedding);
}
