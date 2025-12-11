import { api } from "./base";
import { ModuleDTO, ModuleCreateDTO, ModuleUpdateDTO } from "@/types";
import { mockModules } from "./mockModules";

const LOCAL_API_BASE = "/api";

async function localModulesFetch<T>(
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
      `[modules-local] ${res.status} ${res.statusText}${
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
      `[modules-api] API distante indisponible pour ${endpoint}, fallback local`,
      err
    );
    return localModulesFetch<T>(endpoint, options);
  }
}

export async function getModules(): Promise<ModuleDTO[]> {
  try {
    return (await requestWithLocalFallback<ModuleDTO[]>("/modules")) ?? [];
  } catch (err) {
    console.error(
      "[getModules] Fallback local indisponible, retour mockModules",
      err
    );
    return mockModules;
  }
}

export async function getModule(id: number | string): Promise<ModuleDTO> {
  try {
    return await requestWithLocalFallback<ModuleDTO>(`/modules/${id}`);
  } catch (err) {
    console.error(
      "[getModule] Fallback local indisponible, tentative mockModules",
      err
    );
    const numericId = Number(id);
    const fallback = mockModules.find((module) => module.id === numericId);
    if (fallback) {
      return fallback;
    }
    throw err;
  }
}

export function createModule(data: ModuleCreateDTO): Promise<ModuleDTO> {
  return requestWithLocalFallback<ModuleDTO>("/modules", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function updateModule(
  id: number | string,
  data: ModuleUpdateDTO
): Promise<ModuleDTO> {
  return requestWithLocalFallback<ModuleDTO>(`/modules/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}

export function deleteModule(id: number | string): Promise<void> {
  return requestWithLocalFallback<void>(`/modules/${id}`, { method: "DELETE" });
}
