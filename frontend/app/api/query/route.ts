/**
 * Traite les requêtes POST pour analyser une tâche électrique à l'aide du modèle GPT d'OpenAI.
 *
 * Ce point de terminaison attend un corps JSON contenant une `task` (chaîne, requise) et un `context` (chaîne, optionnelle).
 * Il utilise l'API OpenAI pour générer une réponse concise destinée aux électriciens belges, en citant les règles RGIE,
 * en fournissant des tâches prioritaires, des vérifications, des références RGIE et des alertes de sécurité.
 *
 * Variables d'environnement :
 * - `OPENAI_API_KEY` : Clé API pour accéder à OpenAI.
 * - `VECTOR_STORE_ID` : Identifiant du vector store contenant les règles RGIE.
 *
 * Corps de la requête :
 * @param request - La requête HTTP entrante contenant la tâche et le contexte optionnel.
 *
 * Réponse :
 * - 200 : Objet JSON avec le résultat généré (`result`).
 * - 400 : Erreur JSON si la tâche est manquante ou invalide.
 * - 500 : Erreur JSON si des variables d'environnement sont manquantes ou en cas d'erreur interne.
 *
 * @async
 * @function
 */
import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
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

    const aiResponse = await client.chat.completions.create({
      model: "gpt-4-1106-preview",
      messages: [
        {
          role: "system",
          content: `
                Tu es l'assistant WebElec pour les électriciens belges.
                Objectif : proposer et vérifier les tâches électriques à réaliser.
                Contraintes : toujours citer les règles/seuils RGIE trouvés via le vector store, ne rien inventer.
                Donne une réponse concise : tâches prioritaires, vérifications, références RGIE (article/livre), alertes de sécurité.
              `,
        },
        {
          role: "user",
          content: `Tâche demandée : ${task}\n${
            context ? `Contexte : ${context}` : "Contexte : non précisé"
          }`,
        },
      ],
      // tools: [
      //   {
      //     type: "file_search",
      //     vector_store_ids: [vectorStoreId],
      //   },
      // ],
    });

    type ChatCompletion = {
      choices: {
        message: {
          content: string | null;
        };
      }[];
    };

    const chatResponse = aiResponse as ChatCompletion;
    const outputText =
      chatResponse.choices[0]?.message.content?.trim() ||
      "Aucune réponse générée.";

    return NextResponse.json({ result: outputText });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Impossible de traiter la demande." },
      { status: 500 }
    );
  }
}
