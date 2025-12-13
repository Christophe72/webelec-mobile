import { api } from "./base";
import { ChantierDTO, ChantierCreateDTO, ChantierUpdateDTO } from "@/types";
import { mockChantiers } from "./mockChantiers";

const LOCAL_API_BASE = "/api";

function buildChantierEndpoint(societeId?: number | string): string {
  if (societeId !== undefined && societeId !== null && societeId !== "") {
    return `/chantiers?societeId=${societeId}`;
  }
  return "/chantiers";
}

function filterMockChantiers(societeId?: number | string): ChantierDTO[] {
  if (societeId === undefined || societeId === null || societeId === "") {
    return mockChantiers;
  }
  const numericId = Number(societeId);
  return mockChantiers.filter(
    (chantier) => chantier.societe?.id === numericId
  );
}

async function localChantierFetch<T>(
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
      `[chantiers-local] ${res.status} ${res.statusText}${
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
      `[chantiers-api] API distante indisponible pour ${endpoint}, fallback local`,
      err
    );
    return localChantierFetch<T>(endpoint, options);
  }
}

export async function getChantiers(
  societeId?: number | string
): Promise<ChantierDTO[]> {
  const endpoint = buildChantierEndpoint(societeId);
  try {
    const data = await requestWithLocalFallback<ChantierDTO[]>(endpoint);
    if (
      societeId !== undefined &&
      societeId !== null &&
      societeId !== "" &&
      !endpoint.startsWith("/chantiers/societe")
    ) {
      // local route utilise query string -> re-filtre côté client pour aligner avec l'API backend
      const numericId = Number(societeId);
      return data.filter((chantier) => chantier.societe?.id === numericId);
    }
    return data;
  } catch (err) {
    console.error(
      "[getChantiers] Fallback local indisponible, retour mockChantiers",
      err
    );
    return filterMockChantiers(societeId);
  }
}

export async function getChantier(id: number | string): Promise<ChantierDTO> {
  try {
    return await requestWithLocalFallback<ChantierDTO>(`/chantiers/${id}`);
  } catch (err) {
    console.error(
      "[getChantier] Fallback local indisponible, tentative mockChantiers",
      err
    );
    const numericId = Number(id);
    const fallback = mockChantiers.find((chantier) => chantier.id === numericId);
    if (fallback) {
      return fallback;
    }
    throw err;
  }
}

export function createChantier(data: ChantierCreateDTO): Promise<ChantierDTO> {
  return requestWithLocalFallback("/chantiers", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function updateChantier(
  id: number | string,
  data: ChantierUpdateDTO
): Promise<ChantierDTO> {
  return requestWithLocalFallback(`/chantiers/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}

export function deleteChantier(id: number | string): Promise<void> {
  return requestWithLocalFallback(`/chantiers/${id}`, { method: "DELETE" });
}
