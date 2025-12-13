import { api } from "./base";
import {
  InterventionDTO,
  InterventionCreateDTO,
  InterventionUpdateDTO
} from "@/types";
import { mockInterventions } from "./mockInterventions";

const LOCAL_API_BASE = "/api";

function buildInterventionEndpoint(filters?: {
  societeId?: number | string;
  chantierId?: number | string;
}): string {
  if (filters?.societeId) {
    return `/interventions/societe/${filters.societeId}`;
  }
  if (filters?.chantierId) {
    return `/interventions/chantier/${filters.chantierId}`;
  }
  return "/interventions";
}

function filterMockInterventions(filters?: {
  societeId?: number | string;
  chantierId?: number | string;
}): InterventionDTO[] {
  if (!filters) return mockInterventions;
  return mockInterventions.filter((intervention) => {
    const matchSociete =
      filters.societeId === undefined ||
      intervention.societeId === Number(filters.societeId);
    const matchChantier =
      filters.chantierId === undefined ||
      intervention.chantierId === Number(filters.chantierId);
    return matchSociete && matchChantier;
  });
}

async function localInterventionFetch<T>(
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
      `[interventions-local] ${res.status} ${res.statusText}${
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
      `[interventions-api] API distante indisponible pour ${endpoint}, fallback local`,
      err
    );
    return localInterventionFetch<T>(endpoint, options);
  }
}

export async function getInterventions(filters?: {
  societeId?: number | string;
  chantierId?: number | string;
}): Promise<InterventionDTO[]> {
  const endpoint = buildInterventionEndpoint(filters);
  try {
    return await requestWithLocalFallback<InterventionDTO[]>(endpoint);
  } catch (err) {
    console.warn(
      "[getInterventions] Fallback local indisponible, retour mockInterventions",
      err
    );
    return filterMockInterventions(filters);
  }
}

export async function getIntervention(
  id: number | string
): Promise<InterventionDTO> {
  try {
    return await requestWithLocalFallback<InterventionDTO>(
      `/interventions/${id}`
    );
  } catch (err) {
    console.warn(
      "[getIntervention] Fallback local indisponible, tentative mockInterventions",
      err
    );
    const numericId = Number(id);
    const fallback = mockInterventions.find(
      (intervention) => intervention.id === numericId
    );
    if (fallback) {
      return fallback;
    }
    throw err;
  }
}

export function createIntervention(data: InterventionCreateDTO): Promise<InterventionDTO> {
  return requestWithLocalFallback("/interventions", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function updateIntervention(id: number | string, data: InterventionUpdateDTO): Promise<InterventionDTO> {
  return requestWithLocalFallback(`/interventions/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}

export function deleteIntervention(id: number | string): Promise<void> {
  return requestWithLocalFallback(`/interventions/${id}`, { method: "DELETE" });
}
