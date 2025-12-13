import { api } from "./base";
import { DevisDTO, DevisCreateDTO, DevisUpdateDTO } from "@/types";
import { mockDevis } from "./mockDevis";

const LOCAL_API_BASE = "/api";

function buildDevisEndpoint(filters?: {
  societeId?: number | string;
  clientId?: number | string;
}): string {
  if (filters?.societeId && filters?.clientId) {
    return `/devis/societe/${filters.societeId}/client/${filters.clientId}`;
  }
  if (filters?.societeId) return `/devis/societe/${filters.societeId}`;
  if (filters?.clientId) return `/devis/client/${filters.clientId}`;
  return "/devis";
}

function filterMockDevis(filters?: {
  societeId?: number | string;
  clientId?: number | string;
}): DevisDTO[] {
  if (!filters) return mockDevis;
  return mockDevis.filter((devis) => {
    const matchSociete =
      filters.societeId === undefined ||
      devis.societeId === Number(filters.societeId);
    const matchClient =
      filters.clientId === undefined ||
      devis.clientId === Number(filters.clientId);
    return matchSociete && matchClient;
  });
}

async function localDevisFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${LOCAL_API_BASE}${endpoint}`, {
    cache: "no-store",
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  if (!res.ok) {
    const message = await res.text().catch(() => res.statusText);
    throw new Error(
      `[devis-local] ${res.status} ${res.statusText}${
        message ? ` - ${message}` : ""
      }`
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
      `[devis-api] API distante indisponible pour ${endpoint}, fallback local`,
      err
    );
    return localDevisFetch<T>(endpoint, options);
  }
}

export async function getDevis(filters?: {
  societeId?: number | string;
  clientId?: number | string;
}): Promise<DevisDTO[]> {
  const endpoint = buildDevisEndpoint(filters);
  try {
    return await requestWithLocalFallback<DevisDTO[]>(endpoint);
  } catch (err) {
    console.error(
      "[getDevis] Fallback local indisponible, retour mockDevis",
      err
    );
    return filterMockDevis(filters);
  }
}

export async function getDevisById(id: number | string): Promise<DevisDTO> {
  try {
    return await requestWithLocalFallback<DevisDTO>(`/devis/${id}`);
  } catch (err) {
    console.error(
      "[getDevisById] Fallback local indisponible, tentative mockDevis",
      err
    );
    const numericId = Number(id);
    const fallback = mockDevis.find((devis) => devis.id === numericId);
    if (fallback) {
      return fallback;
    }
    throw err;
  }
}

export const getUnDevis = getDevisById;

export function createDevis(data: DevisCreateDTO): Promise<DevisDTO> {
  return requestWithLocalFallback("/devis", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function updateDevis(id: number | string, data: DevisUpdateDTO): Promise<DevisDTO> {
  return requestWithLocalFallback(`/devis/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}

export function deleteDevis(id: number | string): Promise<void> {
  return requestWithLocalFallback(`/devis/${id}`, { method: "DELETE" });
}
