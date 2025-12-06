// ======================================================================
// Page : Chat RGIE WebElec AI
// UI complète, citations d'articles, mode expert vectoriel
// ======================================================================

"use client";

import { useState } from "react";
import { WebElecAI } from "../../../lib/sdk/webelec-ai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { RgieRegle as RgieRule } from "@/types";

// Fonction pour obtenir l'embedding utilisateur (texte libre)
async function getEmbedding(text: string): Promise<number[]> {
  const res = await fetch("/api/embedding", {
    method: "POST",
    body: JSON.stringify({ text }),
  });
  return await res.json();
}

type ChatMessage = {
  role: "user" | "ai";
  text: string;
  rules?: RgieRule[];
  selfCheck?: boolean;
};

export default function ChatRgiePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const ai = new WebElecAI();

  // ------------------------------------------------------------
  // Envoi du message utilisateur
  // ------------------------------------------------------------
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    setLoading(true);

    try {
      // 1. Embedding utilisateur
      const embedding = await getEmbedding(input);

      // 2. Appel IA sécurisé (zéro hallucination)
      const ans = await ai.ask(input, embedding);

      const aiMsg: ChatMessage = {
        role: "ai",
        text: ans.answer,
        rules: ans.usedRules,
        selfCheck: ans.selfCheckPassed,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : String(e);
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
      <div key={index} className={`mb-6`}>
        <Card className={isAI ? "border-blue-300" : "border-gray-300"}>
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
                    <li key={i} className="p-2 border rounded bg-muted">
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

            {isAI && (
              <p
                className={`mt-4 text-xs ${
                  msg.selfCheck ? "text-green-700" : "text-red-700"
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
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && sendMessage()}
      />
      <Button disabled={loading} onClick={sendMessage}>
        {loading ? "…" : "Envoyer"}
      </Button>
    </div>
    </div>
  );
}
