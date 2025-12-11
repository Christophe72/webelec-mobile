// ======================================================================
// Page : Auditeur Pro – RGIE WebElec
// ======================================================================
/**
 * Composant de Page Auditeur Pro
 *
 * Un composant de page Next.js qui fournit une interface d'audit professionnelle RGIE (Règlement Général
 * sur les Installations Électriques) pour les installations électriques. Ce composant permet aux utilisateurs
 * de décrire des problèmes ou configurations d'installations électriques et de recevoir une analyse de
 * conformité automatisée.
 *
 * @component
 *
 * @remarks
 * Il s'agit d'un composant côté client qui utilise le SDK WebElecAuditorPro pour analyser les installations
 * électriques selon les normes RGIE. Il génère des embeddings à partir des descriptions utilisateur et fournit
 * des résultats d'audit détaillés incluant les risques, les non-conformités, les articles RGIE pertinents
 * et des explications étape par étape.
 *
 * @example
 * ```tsx
 * // Ce composant est typiquement utilisé comme page Next.js
 * // Accessible via la route : /rgie/auditeur-pro
 * ```
 *
 * @returns Un composant React qui affiche :
 * - Une zone de texte pour décrire l'installation électrique ou le problème
 * - Un bouton de déclenchement d'audit
 * - Des résultats d'audit détaillés incluant :
 *   - Résumé des constats
 *   - Risques détectés
 *   - Non-conformités RGIE
 *   - Articles RGIE cités
 *   - Explication de l'analyse étape par étape
 *
 * @throws {Error} Lorsque l'appel API d'embedding échoue
 * @throws {Error} Lorsque l'analyse de l'auditeur rencontre une erreur
 */
"use client";

import { useMemo, useState } from "react";
import { WebElecAuditorPro } from "@/lib/sdk/webelec-auditor";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { InstallationInput } from "@/lib/rgie/audit.schema";

// Embedding API
async function getEmbedding(text: string) {
  const res = await fetch("/api/embedding", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error(`Embedding error: ${await res.text()}`);
  return (await res.json()) as number[];
}

type AuditorState = {
  description: string;
  installation: InstallationInput;
};

export default function AuditeurProPage() {
  const [state, setState] = useState<AuditorState>({
    description: "",
    // TODO: remplis avec la structure attendue par InstallationInput (tableau, sdb, ve, etc.)
    installation: {} as InstallationInput,
  });
  const [result, setResult] = useState<Awaited<
    ReturnType<WebElecAuditorPro["run"]>
  > | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const auditor = useMemo(() => new WebElecAuditorPro(), []);

  const runAudit = async () => {
    if (!state.description.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const embedding = await getEmbedding(state.description);
      const res = await auditor.run(
        state.description,
        embedding,
        state.installation
      );
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-10 space-y-10 max-w-4xl">
      <h1 className="text-3xl font-bold">Auditeur Pro – RGIE WebElec</h1>

      <Card>
        <CardHeader>
          <CardTitle>Description du problème / installation</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Décris ce que tu vois : ex. 'Salle de bain zone 1, luminaire IP20, DDR 300mA, prise proche de la baignoire…'"
            className="w-full"
            value={state.description}
            onChange={(e) =>
              setState((s) => ({ ...s, description: e.target.value }))
            }
          />
        </CardContent>
      </Card>

      <Button disabled={loading} onClick={runAudit}>
        {loading ? "Analyse…" : "Lancer l’analyse RGIE Pro"}
      </Button>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {result && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Résultats de l’Audit Pro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-bold mb-1">Résumé</h3>
              <p className="whitespace-pre-line">{result.summary}</p>
            </div>

            <div>
              <h3 className="font-bold mb-1">Risques détectés</h3>
              <ul className="space-y-1">
                {result.risks.map((r, i) => (
                  <li key={i}>⚠️ {r}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-1">Non-conformités RGIE</h3>
              <ul className="space-y-3 text-sm">
                {result.nonConformities.map((nc, i) => (
                  <li key={i} className="border p-2 rounded">
                    <strong>{nc.domaine}</strong> — {nc.probleme}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-1">Articles utilisés</h3>
              <ul className="text-xs space-y-1">
                {result.citations.map((r, i) => (
                  <li key={i}>
                    Livre {r.rgie.livre}, Article {r.rgie.article} —{" "}
                    {r.rgie.nature} ({r.rgie.seuil})
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-1">Explication étape par étape</h3>
              <ol className="list-decimal list-inside text-xs text-muted-foreground space-y-1">
                {result.steps.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
