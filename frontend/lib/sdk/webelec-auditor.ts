// ======================================================================
//  WebElec Auditeur Pro
//  Orchestration IA vectorielle + audit symbolique + explication contrôlée
// ======================================================================

import { WebElecAI } from "./webelec-ai";
import {
  WebElecSDK,
  type AuditNonConformite,
  type AuditConformite,
  type RgieRule,
} from "./webelec-sdk";
import type { InstallationInput } from "@/lib/rgie/audit.schema";

export type AuditorProResult = {
  summary: string;
  risks: string[];
  nonConformities: AuditNonConformite[];
  conformities: AuditConformite[];
  citations: RgieRule[];
  steps: string[];
};

export class WebElecAuditorPro {
  private sdk: WebElecSDK;
  private ai: WebElecAI;

  constructor(config?: { baseUrl?: string }) {
    this.sdk = new WebElecSDK(config);
    this.ai = new WebElecAI(config);
  }

  async run(
    description: string,
    embedding: number[],
    input: InstallationInput
  ): Promise<AuditorProResult> {
    const aiResult = await this.ai.ask(description, embedding);
    const audit = await this.sdk.audit.audit(input);

    const risks = audit.nonConformites.map((nc) => {
      const r = nc.regles[0];
      return `• ${nc.domaine} — Gravité ${r.gravite.niveau} × Probabilité ${r.probabilite.niveau}`;
    });

    const citations: RgieRule[] = [
      ...aiResult.usedRules,
      ...audit.nonConformites.flatMap((n) => n.regles),
      ...audit.conformites.map((c) => c.rule),
    ];

    const summary =
      `Analyse Pro RGIE :` +
      `\n- Description analysée : "${description}"` +
      `\n- Articles pertinents : ${aiResult.usedRules
        .map((r) => `${r.rgie.livre}.${r.rgie.article}`)
        .join(", ")}` +
      `\n- Non-conformités détectées : ${audit.nonConformites.length}` +
      `\n- Score global des risques : ${audit.score_global}`;

    const steps = [
      "1. Embedding généré à partir de la description fournie.",
      "2. Sélection des règles RGIE les plus proches via recherche vectorielle.",
      "3. Vérification symbolique stricte (DDR, sections, VE, SDB).",
      "4. Comparaison gravité × probabilité pour estimation du risque.",
      "5. Construction du diagnostic à partir uniquement des règles RGIE.",
    ];

    return {
      summary,
      risks,
      nonConformities: audit.nonConformites,
      conformities: audit.conformites,
      citations,
      steps,
    };
  }
}
