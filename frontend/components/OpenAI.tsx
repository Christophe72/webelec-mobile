/**
 * API: POST /api/query
 * Utilise OpenAI Responses API + file_search branché sur le vector store RGIE.
 * Env requis:
 * - OPENAI_API_KEY
 * - VECTOR_STORE_ID (nouveau vector store)
 * Optionnel:
 * - OPENAI_MODEL (défaut: gpt-4.1-mini)
 */
import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function POST(request: Request) {
  try {
    const { task, context } = await request.json();

    if (!task || typeof task !== "string") {
      return NextResponse.json(
        { error: "La tâche est obligatoire." },
        { status: 400 }
      );
    }

    const vectorStoreId = process.env.VECTOR_STORE_ID;
    if (!vectorStoreId) {
      return NextResponse.json(
        { error: "VECTOR_STORE_ID manquant dans l'environnement." },
        { status: 500 }
      );
    }

    const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

    const system = `
Tu es l'assistant WebElec pour les électriciens belges.
Objectif: proposer et vérifier les tâches à réaliser en citant le RGIE.
Contraintes: ne rien inventer; cite livre/article/seuil issus du vector store.
Réponse courte: étapes prioritaires, vérifications, références RGIE, alertes sécurité.
    `.trim();

    const userText = [
      `Tâche demandée : ${task}`,
      context ? `Contexte : ${context}` : "Contexte : non précisé",
    ].join("\n");

    const resp = await client.responses.create({
      model,
      input: [
        { role: "system", content: system },
        { role: "user", content: userText },
      ],
      tools: [{ type: "file_search", vector_store_ids: [vectorStoreId] }],
    });

    // SDK v4: raccourci utile pour récupérer le texte final
    const outputText =
      resp.output
        ?.map((item) => {
          if ("content" in item && Array.isArray(item.content)) {
            return item.content
              .map((contentItem) => {
                if ("text" in contentItem && typeof contentItem.text === "string") {
                  return contentItem.text;
                }
                return "";
              })
              .join("");
          }
          return "";
        })
        .join("\n") || "Aucune réponse générée.";

    return NextResponse.json({ result: outputText });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Impossible de traiter la demande." },
      { status: 500 }
    );
  }
}