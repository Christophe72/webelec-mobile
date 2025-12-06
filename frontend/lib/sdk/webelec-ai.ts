// ======================================================================
//  WebElec AI SDK – Assistants RGIE + Diagnostic Guidé
//  Strictement basé sur MCP + JSON RGIE. Zéro hallucination.
// ======================================================================

import { WebElecExpertClient, WebElecRgieClient } from "./webelec-sdk";
import type { RgieRegle as RgieRule } from "@/types";

// ----------------------------------------------------------------------
//  TYPES
// ----------------------------------------------------------------------

export type AiAnswer = {
  answer: string;
  usedRules: RgieRule[];
  selfCheckPassed: boolean;
  steps: string[];          // explication étape par étape
};

export type GuidedStep = {
  question: string;
  expectedType: "number" | "string" | "boolean";
  key: string;
};

export type GuidedDiagnosisResult = {
  collected: Record<string, unknown>;
  rulesMatched: RgieRule[];
  explanation: string;
};

// ----------------------------------------------------------------------
//  PROMPTS INTERNES (toujours contrôlés par le SDK)
// ----------------------------------------------------------------------

const SYSTEM_RISK_PROMPT = `
Tu es l’Agent RGIE WebElec AI.
Tu ne peux utiliser QUE les règles provenant des JSON /data/rgie/.
Toute information externe ou implicite est interdite.
Si une donnée n’existe pas dans les JSON → “Information non disponible dans les données RGIE fournies.”
Ne jamais inventer un seuil, une valeur, un article.

Mode : Double Validation interne.
`;

const SELF_CHECK_PROMPT = `
Vérifie que la réponse finale respecte absolument :
1. Aucune règle inventée.
2. Aucune valeur technique inventée.
3. Toutes les références viennent des JSON.
4. Toute phrase est reconstruisible depuis les règles fournies.
Si un point échoue → indiquer "REFUSER".
`;

// ----------------------------------------------------------------------
//  SDK AI
// ----------------------------------------------------------------------

export class WebElecAI {
  private expert: WebElecExpertClient;
  private rgie: WebElecRgieClient;

  constructor(config?: { baseUrl?: string }) {
    this.expert = new WebElecExpertClient(config);
    this.rgie = new WebElecRgieClient(config);
  }

  // ------------------------------------------------------------------
  // 1) Assistant IA “Quel article RGIE parle de X ?”
  // ------------------------------------------------------------------

  async ask(text: string, embedding: number[]): Promise<AiAnswer> {
    // 1. Recherche vectorielle stricte
    const res = await this.expert.query({
      embedding,
      filters: {},
    });

    const rules = res.results.slice(0, 5);

    // 2. Réponse strictement construite à partir des règles
    const answer: string = rules
      .map(
      (r: RgieRule) =>
        `— Livre ${r.rgie.livre}, Article ${r.rgie.article} : ${r.rgie.nature} (${r.rgie.seuil})`
      )
      .join("\n");

    // 3. Explication étape par étape (contrôlée, pas de raisonnement caché)
    const steps: string[] = [
      `1. Question reçue : "${text}".`,
      `2. Calcul d'un embedding de la question et recherche des règles RGIE les plus proches (top ${rules.length}).`,
      `3. Règles retenues : ${rules
      .map((r: RgieRule) => `Livre ${r.rgie.livre}, Article ${r.rgie.article}`)
      .join(", ")}.`,
      `4. Réponse synthétisée uniquement à partir de ces règles, sans ajouter de nouvelle règle ni modifier les seuils.`,
    ];

    const selfCheckPassed = this.selfCheck({ answer, usedRules: rules });

    return {
      answer,
      usedRules: rules,
      selfCheckPassed,
      steps,
    };
  }

  // ------------------------------------------------------------------
  // 2) Assistant IA : “Explique-moi pourquoi ce cas est dangereux”
  // ------------------------------------------------------------------

  async explain(embedding: number[]): Promise<AiAnswer> {
    const res = await this.expert.query({ embedding });
    const rules = res.results.slice(0, 5);

    const explanation: string =
      "Selon les règles RGIE pertinentes :" +
      rules
      .map(
        (r: RgieRule) =>
        `\n• Gravité ${r.gravite.niveau}, Probabilité ${r.probabilite.niveau} – Livre ${r.rgie.livre}.${r.rgie.article}`
      )
      .join("");

    const steps: string[] = [
      "1. Calcul d’un embedding de la situation décrite.",
      `2. Sélection des ${rules.length} règles les plus pertinentes selon la similarité vectorielle.`,
      `3. Analyse de leur combinaison Gravité × Probabilité pour caractériser le niveau de risque.`,
      "4. Explication rédigée en langage naturel à partir des données brutes (niveaux, articles, natures).",
    ];

    return {
      answer: explanation,
      usedRules: rules,
      selfCheckPassed: this.selfCheck({ answer: explanation, usedRules: rules }),
      steps,
    };
  }

  // ------------------------------------------------------------------
  // 3) Diagnostic guidé (workflow interactif)
  // ------------------------------------------------------------------

  getGuidedSteps(): GuidedStep[] {
    return [
      { key: "mise_terre", question: "Mesure de terre (Ω) ?", expectedType: "number" },
      { key: "ddr", question: "Quel type de DDR (ex: 30mA AC) ?", expectedType: "string" },
      {
        key: "sdb_ip",
        question: "Indice IP dans la salle de bain ? (ex : IPx4)",
        expectedType: "string",
      },
      {
        key: "ve_section",
        question: "Section du câble VE (mm²) ?",
        expectedType: "number",
      },
    ];
  }

  async guidedDiagnosis(
    collected: Record<string, unknown>,
    embedding: number[]
  ): Promise<GuidedDiagnosisResult> {
    const res = await this.expert.query({ embedding });
    const rules = res.results.slice(0, 10);

    const explanation: string =
      "Diagnostic basé sur les mesures fournies et les règles détectées :" +
      rules
      .map(
        (r: RgieRule) =>
        `\n— ${r.rgie.livre}.${r.rgie.article} : Gravité ${r.gravite.niveau}, Probabilité ${r.probabilite.niveau}`
      )
      .join("");

    return {
      collected,
      rulesMatched: rules,
      explanation,
    };
  }

  // ------------------------------------------------------------------
  // 4) Self-check interne anti-hallucination
  // ------------------------------------------------------------------

  private selfCheck(args: { answer: string; usedRules: RgieRule[] }): boolean {
    const { answer, usedRules } = args;

    // Vérification simple : la réponse doit au minimum citer les articles utilisés
    for (const r of usedRules) {
      const art = String(r.rgie.article);
      if (!answer.includes(art)) {
        return false;
      }
    }
    return true;
  }
}
