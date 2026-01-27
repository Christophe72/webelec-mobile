// modules/account-validation/adapters/storeAdapter.ts
import { StorePort } from "../domain/engine";
import { NormalizedAccountDetails } from "../domain/types";
import { bffFetch } from "@/lib/api/bffFetch";

export class NoopStoreAdapter implements StorePort {
  async storeTransposed(details: {
    original: NormalizedAccountDetails;
    resolved: NormalizedAccountDetails;
  }): Promise<void> {
    // No-op: pour les tests ou si vous ne voulez pas persister
    console.log("Transposed account detected (not stored):", details);
  }
}

export class HttpStoreAdapter implements StorePort {
  constructor(
    private token: string,
    private apiUrl: string,
    private apiKey?: string
  ) {}

  async storeTransposed(details: {
    original: NormalizedAccountDetails;
    resolved: NormalizedAccountDetails;
  }): Promise<void> {
    try {
      const baseUrl = this.apiUrl.startsWith("/api") ? this.apiUrl : "/api";
      await bffFetch(`${baseUrl}/account-validation/transposed`, this.token, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(this.apiKey ? { authorization: `Bearer ${this.apiKey}` } : {}),
        },
        body: JSON.stringify({
          original: details.original,
          resolved: details.resolved,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error("Error storing transposed account:", error);
    }
  }
}

// Adapter local storage pour les tests/dev
export class LocalStorageStoreAdapter implements StorePort {
  private readonly storageKey = "account_validation_transposed";

  async storeTransposed(details: {
    original: NormalizedAccountDetails;
    resolved: NormalizedAccountDetails;
  }): Promise<void> {
    try {
      const existing = this.getAll();
      existing.push({
        original: details.original,
        resolved: details.resolved,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem(this.storageKey, JSON.stringify(existing));
    } catch (error) {
      console.error("Error storing to localStorage:", error);
    }
  }

  getAll(): Array<{
    original: NormalizedAccountDetails;
    resolved: NormalizedAccountDetails;
    timestamp: string;
  }> {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  clear(): void {
    localStorage.removeItem(this.storageKey);
  }
}
