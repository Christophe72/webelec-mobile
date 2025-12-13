"use client";

import { FormEvent, useState } from "react";

export type QueryResult = {
  result?: string;
  error?: string;
};

export interface RgieQueryPanelProps {
  endpoint?: string;
  title?: string;
  description?: string;
  helperText?: string;
  taskLabel?: string;
  contextLabel?: string;
  resultTitle?: string;
}

const defaultProps: Required<RgieQueryPanelProps> = {
  endpoint: "/api/query",
  title: "Demande une tâche électrique et vérifie sa conformité RGIE",
  description:
    "Décris la tâche à réaliser (installation, contrôle, dépannage) et l’assistant croise avec le vector store RGIE pour proposer étapes, seuils, et références.",
  helperText: "Les références RGIE sont tirées du vector store local.",
  taskLabel: "Tâche à faire *",
  contextLabel: "Contexte (optionnel)",
  resultTitle: "Résultat",
};

export function RgieQueryPanel(props: RgieQueryPanelProps) {
  const {
    endpoint,
    // title,
    // description,
    helperText,
    taskLabel,
    contextLabel,
    resultTitle,
  } = { ...defaultProps, ...props };
  const [task, setTask] = useState("");
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<QueryResult | null>(null);
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!task.trim()) {
      setResponse({ error: "Merci de préciser la tâche." });
      return;
    }

    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task, context }),
        credentials: "include", // <-- Ajouté pour transmettre le cookie JWT
      });

      const data = (await res.json()) as QueryResult;
      if (!res.ok) {
        setResponse({ error: data.error || "Erreur inconnue." });
      } else {
        setResponse({ result: data.result || "Aucune réponse générée." });
      }
    } catch (err) {
      console.error(err);
      setResponse({ error: "Impossible de contacter le service." });
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)] backdrop-blur">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-emerald-100">
              {taskLabel}
            </label>
            <input
              className="mt-2 w-full rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-base text-white outline-none transition focus:border-emerald-300/80 focus:ring-2 focus:ring-emerald-300/30"
              placeholder="Ex: Installer un différentiel 30 mA dans une salle de bain"
              value={task}
              onChange={(event) => setTask(event.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-emerald-100">
              {contextLabel}
            </label>
            <textarea
              className="mt-2 w-full rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-base text-white outline-none transition focus:border-emerald-300/80 focus:ring-2 focus:ring-emerald-300/30"
              placeholder="Ex: Locaux humides, circuit existant en 2.5 mm², disjoncteur 20 A, IPx4 requis"
              rows={4}
              value={context}
              onChange={(event) => setContext(event.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-400 px-5 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Analyse en cours..." : "Analyser via RGIE"}
            </button>
            <p className="text-xs text-emerald-100/80">{helperText}</p>
          </div>
        </form>
      </section>

      <section className="flex min-h-[260px] flex-col rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)] backdrop-blur">
        <div className="flex items-center justify-between pb-3">
          <h2 className="text-xl font-semibold text-white">{resultTitle}</h2>
          <span className="text-xs uppercase tracking-[0.25em] text-emerald-100/70">
            RGIE
          </span>
        </div>

        <div className="flex-1 rounded-xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-zinc-100/90">
          {response?.error && <p className="text-red-200">{response.error}</p>}
          {response?.result && (
            <p className="whitespace-pre-line">{response.result}</p>
          )}
          {!response && !loading && (
            <p className="text-zinc-400">
              Soumets une tâche pour voir les étapes et références RGIE.
            </p>
          )}
          {loading && (
            <p className="animate-pulse text-emerald-200">
              Recherche dans le vector store RGIE...
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

export default RgieQueryPanel;
