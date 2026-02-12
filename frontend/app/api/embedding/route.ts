/**
 * Gère la requête POST pour générer un embedding à partir d'un texte donné.
 *
 * - Si la clé API OpenAI (`OPENAI_API_KEY`) est présente dans les variables d'environnement,
 *   utilise l'API OpenAI pour générer l'embedding du texte fourni.
 * - Si la clé API est absente, génère un embedding local de secours basé sur le texte.
 *
 * @param req La requête HTTP contenant un objet JSON avec la propriété `text` (string).
 * @returns Une réponse JSON contenant l'embedding généré (tableau de nombres) ou une erreur si le texte est manquant.
 */
import { NextResponse } from "next/server";
import OpenAI from "openai";

const ALLOW_LOCAL_AI_FALLBACK =
  process.env.WEBELEC_ALLOW_LOCAL_AI_FALLBACK === "true";

function fallbackEmbedding(text: string, size = 32): number[] {
  const result = new Array<number>(size).fill(0);
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    result[i % size] += code / 255;
  }
  return result.map((value) => Number(value.toFixed(6)));
}

export async function POST(req: Request) {
  const { text } = await req.json();
  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "text requis" }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    if (!ALLOW_LOCAL_AI_FALLBACK) {
      return NextResponse.json(
        {
          error:
            "OPENAI_API_KEY manquant. Active WEBELEC_ALLOW_LOCAL_AI_FALLBACK=true pour le mode demo local.",
        },
        { status: 503 }
      );
    }
    console.warn(
      "[embedding] OPENAI_API_KEY manquant, génération d'un embedding local"
    );
    return NextResponse.json(fallbackEmbedding(text));
  }

  const client = new OpenAI({ apiKey });

  const r = await client.embeddings.create({
    model: "text-embedding-3-large",
    input: text
  });

  return NextResponse.json(r.data[0].embedding);
}
