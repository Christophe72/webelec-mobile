// ======================================================================
//  WebElec Auditeur Pro
//  Démo locale : règles RGIE JSON + heuristiques simples
// ======================================================================

import type {
  AuditConformite,
  AuditNonConformite,
  RgieRule,
} from "./webelec-sdk";
import { getAllRgieRegles } from "@/lib/rgie-local";
import type { InstallationInput } from "@/lib/rgie/audit.schema";

export type AuditorProResult = {
  summary: string;
  risks: string[];
  nonConformities: AuditNonConformite[];
  conformities: AuditConformite[];
  citations: RgieRule[];
  steps: string[];
};

function selectDemoRules(
  description: string,
  input: InstallationInput
): RgieRule[] {
  const all = getAllRgieRegles();
  const text = description.toLowerCase();
  const tags = new Set<string>();

  if (text.includes("salle de bain") || text.includes("sdb")) {
    tags.add("sdb_2025");
  }
  if (text.includes("ddr") || text.includes("différentiel") || text.includes("differentiel")) {
    tags.add("ddr");
  }
  if (text.includes("prise")) {
    tags.add("ddr");
  }
  if (text.includes("ve") || text.includes("borne")) {
    tags.add("ve");
  }
  if (text.includes("terre") || typeof input.mise_terre === "number") {
    tags.add("terre");
  }

  let candidates = all.filter((r) =>
    r.tags.some((t) =>
      Array.from(tags).some((tag) => t.toLowerCase().includes(tag.toLowerCase()))
    )
  );

  if (candidates.length === 0) {
    candidates = all;
  }

  candidates.sort((a, b) => {
    const scoreA = a.gravite.niveau * a.probabilite.niveau;
    const scoreB = b.gravite.niveau * b.probabilite.niveau;
    return scoreB - scoreA;
  });

  return candidates.slice(0, 5);
}

export class WebElecAuditorPro {
  constructor(config?: { baseUrl?: string }) {
    void config;
  }

  async run(
    description: string,
    embedding: number[],
    input: InstallationInput
  ): Promise<AuditorProResult> {
    void embedding;

    const demoRules = selectDemoRules(description, input);

    const nonConformities: AuditNonConformite[] = demoRules.map((rule) => ({
      domaine: `Thème ${rule.rgie.article}`,
      probleme: `Situation potentiellement non conforme à l’article ${rule.rgie.livre}.${rule.rgie.article}`,
      regles: [rule],
    }));

    const conformities: AuditConformite[] = [];

    const risks = nonConformities.map((nc) => {
      const r = nc.regles[0];
      return `• Article ${r.rgie.livre}.${r.rgie.article} — Gravité ${r.gravite.niveau} × Probabilité ${r.probabilite.niveau}`;
    });

    const score_global = demoRules.reduce(
      (sum, r) => sum + r.gravite.niveau * r.probabilite.niveau,
      0
    );

    const summary =
      `Analyse Pro RGIE :` +
      `\n- Description analysée : "${description}"` +
      `\n- Articles pertinents : ${
        demoRules.length
          ? demoRules
              .map((r) => `${r.rgie.livre}.${r.rgie.article}`)
              .join(", ")
          : "aucun article trouvé dans le pack de démo"
      }` +
      `\n- Non-conformités détectées : ${nonConformities.length}` +
      `\n- Score global des risques : ${score_global}`;

    const steps = [
      "1. Analyse textuelle de la description (mots-clés : salle de bain, DDR, VE, terre…).",
      "2. Sélection des règles RGIE locales les plus pertinentes par tags/thèmes.",
      "3. Estimation de la criticité via Gravité × Probabilité.",
      "4. Construction de non-conformités de démonstration à partir des articles retenus.",
      "5. Synthèse du diagnostic et liste des articles utilisés.",
    ];

    return {
      summary,
      risks,
      nonConformities,
      conformities,
      citations: demoRules,
      steps,
    };
  }
}
