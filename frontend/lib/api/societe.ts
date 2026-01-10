import { SocieteRequest, SocieteResponse } from "@/types";
import { mockSocietes } from "./mockSocietes";
import { api } from "@/lib/api/base";

const LOCAL_API_BASE = "/api";

async function localSocieteFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${LOCAL_API_BASE}${endpoint}`, {
    cache: "no-store",
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  if (!res.ok) {
    const message = await res.text().catch(() => res.statusText);
    throw new Error(
      `[societes-local] ${res.status} ${res.statusText}${message ? ` - ${message}` : ""}`
    );
  }

  if (res.status === 204) {
    return undefined as T;
  }

  try {
    return (await res.json()) as T;
  } catch {
    return undefined as T;
  }
}

async function requestWithLocalFallback<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    return await api<T>(endpoint, options);
  } catch (err) {
    console.warn(
      `[societes-api] API distante indisponible pour ${endpoint}, fallback local`,
      err
    );
    return localSocieteFetch<T>(endpoint, options);
  }
}

export async function getSocietes(): Promise<SocieteResponse[]> {
  try {
    return (await requestWithLocalFallback<SocieteResponse[]>("/societes")) ?? [];
  } catch (err) {
    console.warn("[getSocietes] Erreur réseau, utilisation du fallback mockSocietes", err);
    return mockSocietes;
  }
}


export async function getSociete(
  id: number | string
): Promise<SocieteResponse> {
  try {
    return await requestWithLocalFallback<SocieteResponse>(`/societes/${id}`);
  } catch (err) {
    console.error(
      "[getSociete] Erreur réseau, tentative avec le fallback mockSocietes",
      err
    );
    const numericId = Number(id);
    const fallback = mockSocietes.find((s) => s.id === numericId);
    if (fallback) {
      return fallback;
    }
    throw err;
  }
}

export async function createSociete(
  data: SocieteRequest
): Promise<SocieteResponse> {
  try {
    return await requestWithLocalFallback<SocieteResponse>("/societes", {
      method: "POST",
      body: JSON.stringify(data)
    });
  } catch (err) {
    console.error("[createSociete] Erreur réseau", err);
    throw err;
  }
}

export async function deleteSocieteById(id: string): Promise<void> {
  try {
    await requestWithLocalFallback<void>(`/societes/${id}`, {
      method: "DELETE"
    });
  } catch (err) {
    console.error("[deleteSocieteById] Erreur réseau", err);
    throw err;
  }
}
