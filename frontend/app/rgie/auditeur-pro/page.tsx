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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { InstallationInput } from "@/lib/rgie/audit.schema";
import type { RgieRegle } from "@/types";

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

function buildAiExplanation(rule: RgieRegle): string {
  const steps: string[] = [];

  if (rule.actions.urgentes.length > 0) {
    steps.push(`Sécuriser d'abord : ${rule.actions.urgentes[0]}.`);
  }

  if (rule.actions.correctives.length > 0) {
    steps.push(`Corriger le point : ${rule.actions.correctives[0]}.`);
  }

  if (rule.actions.correctives.length > 1) {
    steps.push(`Contrôler la réparation : ${rule.actions.correctives[1]}.`);
  }

  if (rule.actions.prevention.length > 0) {
    steps.push(`Prévenir la récidive : ${rule.actions.prevention[0]}.`);
  }

  if (steps.length === 0) {
    steps.push(
      "Décris l'installation et le contexte : l'IA pourra proposer un plan de correction adapté."
    );
  }

  return `Explication IA (vulgarisée) :\n${steps
    .map((step, index) => `${index + 1}. ${step}`)
    .join("\n")}`;
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
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [solutionsIndex, setSolutionsIndex] = useState<number | null>(null);

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
    <div className="container mx-auto py-10 space-y-10 max-w-5xl">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Auditeur Pro – RGIE WebElec</h1>
        <p className="text-sm text-muted-foreground">
          Décris l’installation, puis lance l’analyse pour obtenir un diagnostic
          clair et actionnable.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Description du problème / installation</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Décris ce que tu vois : ex. 'Salle de bain zone 1, luminaire IP20, DDR 300mA, prise proche de la baignoire…'"
            className="w-full min-h-[140px]"
            value={state.description}
            onChange={(e) =>
              setState((s) => ({ ...s, description: e.target.value }))
            }
          />
          <div className="mt-4 flex justify-end">
            <Button disabled={loading} onClick={runAudit}>
              {loading ? "Analyse…" : "Lancer l’analyse RGIE Pro"}
            </Button>
          </div>
        </CardContent>
      </Card>

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
          <CardContent className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-bold mb-2">Résumé</h3>
                <p className="whitespace-pre-line text-sm text-muted-foreground">
                  {result.summary}
                </p>
              </div>

              <div>
                <h3 className="font-bold mb-2">Risques détectés</h3>
                <ul className="space-y-2 text-sm">
                  {result.risks.map((r, i) => (
                    <li key={i}>⚠️ {r}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-1">Non-conformités RGIE</h3>
              <ul className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
                {result.nonConformities.map((nc, i) => (
                  <li
                    key={i}
                    className="rounded-lg border border-red-200 bg-red-50/60 p-3 shadow-sm dark:border-red-900/40 dark:bg-red-950/30"
                  >
                    <div>
                      <strong className="text-foreground">{nc.domaine}</strong>
                      <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">
                        {nc.probleme}
                      </p>
                      {nc.regles[0] && (
                        <div className="mt-3 text-xs text-muted-foreground">
                          Gravité {nc.regles[0].gravite.niveau}/5 (
                          {nc.regles[0].gravite.sur_5})
                        </div>
                      )}
                    </div>

                    {nc.regles[0] && (
                      <div className="mt-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setSolutionsIndex(i);
                            setSolutionsOpen(true);
                          }}
                        >
                          Voir les solutions RGIE
                        </Button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-bold mb-2">Articles utilisés</h3>
                <ul className="text-xs space-y-2 text-muted-foreground">
                  {result.citations.map((r, i) => (
                    <li key={i}>
                      Livre {r.rgie.livre}, Article {r.rgie.article} —{" "}
                      {r.rgie.nature} ({r.rgie.seuil})
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-bold mb-2">Explication étape par étape</h3>
                <ol className="list-decimal list-inside text-xs text-muted-foreground space-y-2">
                  {result.steps.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog
        open={solutionsOpen}
        onOpenChange={(open) => {
          setSolutionsOpen(open);
          if (!open) {
            setSolutionsIndex(null);
          }
        }}
      >
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Solutions RGIE</DialogTitle>
            <DialogDescription>
              Détails des actions et explication assistée par IA.
            </DialogDescription>
          </DialogHeader>

          {result &&
            solutionsIndex !== null &&
            result.nonConformities[solutionsIndex] && (
              <div className="space-y-4 text-sm">
                <div>
                  <strong className="text-foreground">
                    {result.nonConformities[solutionsIndex].domaine}
                  </strong>
                  <p className="mt-2 whitespace-pre-line text-muted-foreground">
                    {result.nonConformities[solutionsIndex].probleme}
                  </p>
                  {result.nonConformities[solutionsIndex].regles[0] && (
                    <div className="mt-3 text-xs text-muted-foreground">
                      Gravité{" "}
                      {
                        result.nonConformities[solutionsIndex].regles[0].gravite
                          .niveau
                      }
                      /5 (
                      {
                        result.nonConformities[solutionsIndex].regles[0].gravite
                          .sur_5
                      }
                      )
                    </div>
                  )}
                </div>

                {result.nonConformities[solutionsIndex].regles[0] && (
                  <div className="space-y-3">
                    <div>
                      <strong className="text-foreground">
                        Actions urgentes
                      </strong>
                      <ul className="list-disc list-inside text-muted-foreground">
                        {(result.nonConformities[solutionsIndex].regles[0]
                          .actions.urgentes.length
                          ? result.nonConformities[solutionsIndex].regles[0]
                              .actions.urgentes
                          : ["Aucune action urgente fournie"]
                        ).map((action, idx) => (
                          <li key={idx}>{action}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <strong className="text-foreground">
                        Actions correctives
                      </strong>
                      <ul className="list-disc list-inside text-muted-foreground">
                        {(result.nonConformities[solutionsIndex].regles[0]
                          .actions.correctives.length
                          ? result.nonConformities[solutionsIndex].regles[0]
                              .actions.correctives
                          : ["Aucune action corrective fournie"]
                        ).map((action, idx) => (
                          <li key={idx}>{action}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <strong className="text-foreground">Prévention</strong>
                      <ul className="list-disc list-inside text-muted-foreground">
                        {(result.nonConformities[solutionsIndex].regles[0]
                          .actions.prevention.length
                          ? result.nonConformities[solutionsIndex].regles[0]
                              .actions.prevention
                          : ["Aucune action préventive fournie"]
                        ).map((action, idx) => (
                          <li key={idx}>{action}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-md bg-muted/50 p-3">
                      <p className="whitespace-pre-line text-xs text-muted-foreground">
                        {buildAiExplanation(
                          result.nonConformities[solutionsIndex].regles[0]
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
