// modules/account-validation/adapters/bankWizardAdapter.ts
import { BankWizardPort } from "../domain/engine";
import { Issue, NormalizedAccountDetails } from "../domain/types";

export class HttpBankWizardAdapter implements BankWizardPort {
  constructor(private baseUrl: string, private apiKey?: string) {}

  async reconfirm(input: { iban?: string; bban?: string; bic?: string; country?: string }): Promise<{
    ok: boolean;
    issues?: Issue[];
    resolved?: NormalizedAccountDetails;
  }> {
    try {
      const res = await fetch(`${this.baseUrl}/reconfirm`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(this.apiKey ? { authorization: `Bearer ${this.apiKey}` } : {}),
        },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        return { ok: false, issues: [{ code: "EXTERNAL_HTTP", severity: "ERROR", message: `Service externe indisponible (${res.status})` }] };
      }

      const data = (await res.json()) as { resolved?: NormalizedAccountDetails; issues?: Issue[] };
      return { ok: true, resolved: data.resolved, issues: data.issues };
    } catch (error) {
      return {
        ok: false,
        issues: [{
          code: "EXTERNAL_NETWORK",
          severity: "ERROR",
          message: `Erreur réseau: ${error instanceof Error ? error.message : "Unknown error"}`
        }]
      };
    }
  }
}

// Mock adapter pour les tests et développement sans API externe
export class MockBankWizardAdapter implements BankWizardPort {
  async reconfirm(input: { iban?: string; bban?: string; bic?: string; country?: string }): Promise<{
    ok: boolean;
    issues?: Issue[];
    resolved?: NormalizedAccountDetails;
  }> {
    // Simule une validation externe réussie
    await new Promise(resolve => setTimeout(resolve, 500)); // simule latence réseau

    const resolved: NormalizedAccountDetails = {
      country: input.country,
      iban: input.iban,
      bban: input.bban,
      bic: input.bic,
    };

    // Si BBAN fourni sans IBAN, on peut "former" un IBAN pour les tests
    if (!resolved.iban && input.bban && input.country === "BE") {
      // Format IBAN belge: BE + 2 digits checksum + 12 digits BBAN
      resolved.iban = `BE68${input.bban}`;
    }

    return {
      ok: true,
      resolved,
      issues: [],
    };
  }
}
