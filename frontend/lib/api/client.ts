import { api } from "./base";
import { ClientDTO, ClientCreateDTO, ClientUpdateDTO } from "@/types";
import { mockClients } from "./mockClients";

const LOCAL_API_BASE = "/api";

function filterMockClients(societeId?: number | string): ClientDTO[] {
  if (societeId === undefined || societeId === null || societeId === "") {
    return mockClients;
  }
  const numericId = Number(societeId);
  return mockClients.filter((client) => client.societe?.id === numericId);
}

async function localClientFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
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
      `[clients-local] ${res.status} ${res.statusText}${message ? ` - ${message}` : ""}`
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
    console.warn(`[clients-api] API distante indisponible pour ${endpoint}, fallback local`, err);
    return localClientFetch<T>(endpoint, options);
  }
}

export async function getClients(societeId?: number | string): Promise<ClientDTO[]> {
  try {
    const data = await requestWithLocalFallback<ClientDTO[]>("/clients");
    if (societeId === undefined || societeId === null || societeId === "") {
      return data;
    }
    const numericId = Number(societeId);
    return data.filter((client) => client.societe?.id === numericId);
  } catch (err) {
    console.error("[getClients] Fallback local indisponible, utilisation des mocks", err);
    return filterMockClients(societeId);
  }
}

export async function getClient(id: number | string): Promise<ClientDTO> {
  try {
    return await requestWithLocalFallback<ClientDTO>(`/clients/${id}`);
  } catch (err) {
    console.error("[getClient] Fallback local indisponible, tentative mocks", err);
    const numericId = Number(id);
    const fallback = mockClients.find((client) => client.id === numericId);
    if (fallback) {
      return fallback;
    }
    throw err;
  }
}

export function createClient(data: ClientCreateDTO): Promise<ClientDTO> {
  return requestWithLocalFallback("/clients", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function updateClient(id: number | string, data: ClientUpdateDTO): Promise<ClientDTO> {
  return requestWithLocalFallback(`/clients/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}

export function deleteClient(id: number | string): Promise<void> {
  return requestWithLocalFallback(`/clients/${id}`, { method: "DELETE" });
}
