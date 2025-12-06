import type { RgieRegle as RgieRule } from "@/types";
import type { InstallationInput } from "@/lib/rgie/audit.schema";

export type { RgieRule };

export type AuditNonConformite = {
  domaine: string;
  probleme: string;
  regles: RgieRule[];
};

export type AuditConformite = {
  domaine: string;
  rule: RgieRule;
};

export type AuditResult = {
  nonConformites: AuditNonConformite[];
  conformites: AuditConformite[];
  score_global: number;
};

export class WebElecExpertClient {
  private baseUrl: string;

  constructor(config?: { baseUrl?: string }) {
    this.baseUrl = config?.baseUrl || "http://localhost:3000";
  }

  async query(params: {
    embedding: number[];
    filters?: Record<string, unknown>;
  }): Promise<{ results: RgieRule[] }> {
    void params;
    // TODO: brancher sur une API réelle d'IA RGIE.
    return { results: [] };
  }
}

export class WebElecRgieClient {
  private baseUrl: string;

  constructor(config?: { baseUrl?: string }) {
    this.baseUrl = config?.baseUrl || "http://localhost:3000";
  }

  // TODO: ajouter des méthodes RGIE spécifiques si besoin.
}

export class WebElecSDK {
  private baseUrl: string;

  constructor(config?: { baseUrl?: string }) {
    this.baseUrl = config?.baseUrl || "http://localhost:3000";
  }

  audit = {
    // Stub minimal pour que le front compile.
    // À remplacer par un appel réel au backend quand l'API sera prête.
    audit: async (_input: InstallationInput): Promise<AuditResult> => {
      void _input;
      return {
        nonConformites: [],
        conformites: [],
        score_global: 0,
      };
    },
  };
}

