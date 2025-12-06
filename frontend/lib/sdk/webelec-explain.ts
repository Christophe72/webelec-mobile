// ======================================================================
// MODULE : ExplainCauseEngine
// Objectif : "Effet → Causes RGIE → Explication contrôlée"
// ======================================================================

import { WebElecExpertClient, type RgieRule } from "./webelec-sdk";

export type ExplanationResult = {
  effect: string;
  rules: RgieRule[];
  causes: string[];
  explanation: string;
  steps: string[];
};

export class ExplainCauseEngine {
  constructor(private expert = new WebElecExpertClient()) {}

  async explain(effect: string, embedding: number[]): Promise<ExplanationResult> {
    // 1) Retrouver les règles liées à l'effet
    const vec = await this.expert.query({ embedding });

    // On garde les 5 plus pertinentes
    const rules = vec.results.slice(0, 5);

    // 2) Extraire toutes les causes RGIE exactes depuis les règles
    const causes = rules.flatMap((r) => r.causes ?? []);

    // 3) Construire une explication (strictement basée sur les règles)
    const explanation = [
      `Analyse de l’effet : "${effect}"`,
      `Les règles RGIE associées indiquent les causes possibles suivantes :`,
      ...causes.map((c) => `• ${c}`),
      "",
      `Niveau de risque estimé à partir des règles :`,
      ...rules.map(
        (r) =>
          `→ Article ${r.rgie.livre}.${r.rgie.article} : Gravité ${r.gravite.niveau} × Probabilité ${r.probabilite.niveau}`
      ),
    ].join("\n");

    // 4) Étapes explicatives (chain-of-thought contrôlé)
    const steps = [
      "1. Generation de l’embedding de l’effet fourni.",
      `2. Recherche vectorielle parmi ${vec.results.length} règles.`,
      "3. Sélection des règles les plus pertinentes.",
      "4. Extraction stricte des causes contenues dans les JSON.",
      "5. Construction d’une explication sans aucune donnée externe.",
    ];

    return {
      effect,
      rules,
      causes,
      explanation,
      steps,
    };
  }
}
