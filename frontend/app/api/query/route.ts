import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const payloadSchema = z.object({
  task: z.string(),
  context: z.string().optional(),
});

const systemPrompt = [
  "Tu es WebElec Assist, expert RGIE 2025 Livre 1 pour les artisans électriciens belges.",
  "Analyse la tâche, rappelle les protections, sections, différentiels et contrôles RGIE pertinents.",
  "Structure la réponse en trois blocs : Analyse, Étapes recommandées, Références RGIE.",
  "Cite uniquement des articles RGIE existants (Livre 1). Si l'information manque, signale-le clairement.",
  "Réponds en français adapté à un professionnel de terrain.",
].join(" ");

export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY manquant côté serveur." },
      { status: 500 }
    );
  }

  let parsedBody;
  try {
    parsedBody = payloadSchema.parse(await req.json());
  } catch (error) {
    const message =
      error instanceof z.ZodError
        ? error.issues.map((issue) => issue.message).join(" / ")
        : "Requête invalide.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const task = parsedBody.task.trim();
  const context = (parsedBody.context ?? "").trim();

  if (!task) {
    return NextResponse.json(
      { error: "Merci de préciser la tâche à analyser." },
      { status: 400 }
    );
  }

  const userSections = [
    `Tâche à réaliser : ${task}`,
    context ? `Contexte fourni : ${context}` : null,
    "Donne une réponse concise mais exploitable immédiatement (max ~250 mots).",
    "Ajoute les vérifications de sécurité (différentiels, IP, mesures d'isolement) quand c'est pertinent.",
  ].filter(Boolean);

  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
  const openai = new OpenAI({ apiKey });

  try {
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userSections.join("\n\n") },
      ],
    });

    const text = completion.choices?.[0]?.message?.content?.trim();
    if (!text) {
      return NextResponse.json(
        { error: "Aucune réponse générée par l'assistant." },
        { status: 502 }
      );
    }

    return NextResponse.json({ result: text });
  } catch (error) {
    console.error("OpenAI query failed", error);

    const details =
      error && typeof error === "object" && "message" in error
        ? String((error as { message?: string }).message ?? "Erreur inconnue.")
        : "Erreur inconnue.";

    const status = error instanceof OpenAI.APIError ? error.status ?? 500 : 500;

    return NextResponse.json(
      {
        error: "Erreur interne lors de l'appel OpenAI.",
        details,
      },
      { status }
    );
  }
}
