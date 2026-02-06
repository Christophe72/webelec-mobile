// ======================================================================
// Page : Chat RGIE WebElec AI
// UI complète, citations d'articles, mode expert vectoriel
// ======================================================================
/**
 * Composant de page de chat pour l'assistant IA RGIE WebElec.
 *
 * @remarks
 * Ce composant fournit une interface utilisateur complète pour interagir avec l'assistant IA RGIE (Règlement Général sur les Installations Électriques).
 * Il prend en charge deux modes d'interaction :
 * 1. Mode Q/R standard avec citations d'articles
 * 2. Mode d'analyse d'effets pour le raisonnement causal
 *
 * Fonctionnalités :
 * - Recherche sémantique vectorielle utilisant les embeddings
 * - Réponses IA sans hallucination basées sur les articles RGIE
 * - Vérifications d'auto-validation pour la précision des réponses
 * - Affichage des règles RGIE citées avec niveaux de gravité et de probabilité
 * - Décomposition étape par étape de l'analyse
 *
 * @example
 * ```tsx
 * // Ceci est un composant de page Next.js
 * // Accessible via la route /rgie/chat
 * ```
 *
 * @returns Un composant d'interface de chat avec historique des messages et contrôles de saisie
 */

/**
 * Représente un seul message dans la conversation de chat.
 *
 * @interface ChatMessage
 * @property {("user" | "ai")} role - L'émetteur du message
 * @property {string} text - Le contenu du message
 * @property {RgieRule[]} [rules] - Tableau optionnel des règles RGIE citées dans la réponse
 * @property {boolean} [selfCheck] - Indicateur optionnel si la réponse a passé la validation interne
 * @property {string[]} [steps] - Tableau optionnel des étapes d'analyse effectuées par l'IA
 */

/**
 * Récupère le vecteur d'embedding pour un texte donné via l'API.
 *
 * @param {string} text - Le texte pour lequel générer un embedding
 * @returns {Promise<number[]>} Une promesse qui résout en un tableau de nombres représentant le vecteur d'embedding
 * @throws {Error} Lorsque la requête API échoue
 *
 * @example
 * ```tsx
 * const embedding = await getEmbedding("Quelle est la norme pour les prises?");
 * ```
 */

/**
 * Envoie un message utilisateur et récupère une réponse IA en mode Q/R standard.
 *
 * @remarks
 * Cette fonction :
 * 1. Ajoute le message utilisateur à l'historique du chat
 * 2. Génère un embedding pour la recherche sémantique
 * 3. Appelle le SDK WebElec AI pour une réponse
 * 4. Affiche les articles RGIE cités et le statut de validation
 *
 * @returns {Promise<void>}
 * @throws {Error} Lorsque la génération d'embedding ou la requête IA échoue
 */

/**
 * Envoie un message utilisateur pour une analyse effet-vers-cause.
 *
 * @remarks
 * Ce mode analyse les effets électriques et identifie les causes racines potentielles
 * en utilisant la base de connaissances RGIE et le raisonnement causal.
 *
 * @returns {Promise<void>}
 * @throws {Error} Lorsque le processus d'analyse échoue
 */

/**
 * Affiche un seul message de chat avec toutes les métadonnées associées.
 *
 * @param {ChatMessage} msg - Le message à afficher
 * @param {number} index - L'index du message dans l'historique du chat
 * @returns {JSX.Element} Un composant card contenant le message formaté
 *
 * @remarks
 * Les messages IA incluent :
 * - Citations d'articles RGIE avec niveaux de gravité et de probabilité
 * - Décomposition des étapes d'analyse
 * - Indicateur de statut d'auto-validation
 */
"use client";

import { useState } from "react";
import { bffFetch } from "@/lib/api/bffFetch";
import { useAuth } from "@/lib/hooks/useAuth";
import { formatApiError } from "@/lib/ui/format-api-error";
import { WebElecAI } from "../../../lib/sdk/webelec-ai";
import { analyseEffet } from "@/lib/rgie/chat/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { RgieRegle as RgieRule } from "@/types";

// Fonction pour obtenir l'embedding utilisateur (texte libre)
async function getEmbedding(token: string, text: string): Promise<number[]> {
  return bffFetch<number[]>("/api/embedding", token, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
}
type ChatMessage = {
  role: "user" | "ai";
  text: string;
  rules?: RgieRule[];
  selfCheck?: boolean;
  steps?: string[];
};

export default function ChatRgiePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { status, token } = useAuth();

  const ai = new WebElecAI();

  // ------------------------------------------------------------
  // Envoi du message utilisateur (mode Q/R articles)
  // ------------------------------------------------------------
  const sendMessage = async () => {
    if (!input.trim()) return;
    if (status !== "authenticated" || !token) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Veuillez vous connecter pour utiliser le chat." },
      ]);
      return;
    }

    const userMsg: ChatMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    setLoading(true);

    try {
      // 1. Embedding utilisateur
      const embedding = await getEmbedding(token, input);

      // 2. Appel IA sécurisé (zéro hallucination)
      const ans = await ai.ask(input, embedding);

      const aiMsg: ChatMessage = {
        role: "ai",
        text: ans.answer,
        rules: ans.usedRules,
        selfCheck: ans.selfCheckPassed,
        steps: ans.steps,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (e: unknown) {
      const errorMessage = formatApiError(e, "Erreur inconnue");
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: `Erreur: ${errorMessage}`,
        },
      ]);
    }

    setLoading(false);
    setInput("");
  };

  // ------------------------------------------------------------
  // Envoi du message en mode "Analyse d'effet → causes"
  // ------------------------------------------------------------
  const sendEffectAnalysis = async () => {
    if (!input.trim()) return;
    if (status !== "authenticated" || !token) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Veuillez vous connecter pour lancer l'analyse." },
      ]);
      return;
    }

    const userMsg: ChatMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    setLoading(true);

    try {
      await analyseEffet(token, input, setMessages);
    } catch (e: unknown) {
      const errorMessage = formatApiError(e, "Erreur inconnue");
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: `Erreur: ${errorMessage}`,
        },
      ]);
    }

    setLoading(false);
    setInput("");
  };

  // ------------------------------------------------------------
  // Rendu des messages
  // ------------------------------------------------------------
  const renderMessage = (msg: ChatMessage, index: number) => {
    const isAI = msg.role === "ai";

    return (
      <div key={index} className="mb-6">
        <Card className={isAI ? "border-primary/30 bg-primary/5" : "border-border"}>
          <CardHeader>
            <CardTitle className="text-lg">
              {isAI ? "Assistant RGIE" : "Vous"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 whitespace-pre-line">{msg.text}</p>

            {msg.rules && msg.rules.length > 0 && (
              <div className="mt-4">
                <h4 className="font-bold mb-2">📚 Citations RGIE :</h4>
                <ul className="text-sm space-y-2">
                  {msg.rules.map((r, i) => (
                    <li key={i} className="p-2 border border-border rounded bg-muted/50">
                      <strong>
                        Livre {r.rgie.livre}, Article {r.rgie.article}
                      </strong>
                      <br />
                      Nature : {r.rgie.nature}
                      <br />
                      Seuil : {r.rgie.seuil}
                      <br />
                      Gravité : {r.gravite.niveau} – Probabilité :{" "}
                      {r.probabilite.niveau}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {msg.steps && msg.steps.length > 0 && (
              <div className="mt-4">
                <h4 className="font-bold mb-2 text-sm">Étapes d&apos;analyse :</h4>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  {msg.steps.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {isAI && (
              <p
                className={`mt-4 text-xs font-medium ${
                  msg.selfCheck ? "text-green-600 dark:text-green-400" : "text-destructive"
                }`}
              >
                {msg.selfCheck
                  ? "✓ Double validation RGIE interne : OK"
                  : "✗ Avertissement : Validation interne échouée"}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  // ------------------------------------------------------------
  // Interface principale
  // ------------------------------------------------------------
  return (
    <div className="container py-10 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Chat IA – RGIE WebElec</h1>

      <div className="mb-6 space-y-4">
        {messages.map((msg, i) => renderMessage(msg, i))}
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Pose une question RGIE…"
          className="flex-1"
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInput(e.target.value)
          }
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
            e.key === "Enter" && sendMessage()
          }
        />
        <Button disabled={loading} onClick={sendMessage}>
          {loading ? "…" : "Envoyer"}
        </Button>
        <Button
          variant="outline"
          disabled={loading}
          onClick={sendEffectAnalysis}
        >
          {loading ? "…" : "Analyse effet"}
        </Button>
      </div>
    </div>
  );
}
