import { api } from "./base";
import { ProduitDTO, ProduitCreateDTO, StockMouvementDTO } from "@/types";
import { mockProduits } from "./mockProduits";

const LOCAL_API_BASE = "/api";

function buildProduitEndpoint(societeId?: number | string): string {
  if (societeId !== undefined && societeId !== null && societeId !== "") {
    return `/produits/societe/${societeId}`;
  }
  return "/produits";
}

function filterMockProduits(societeId?: number | string): ProduitDTO[] {
  if (societeId === undefined || societeId === null || societeId === "") {
    return mockProduits;
  }
  const numericId = Number(societeId);
  return mockProduits.filter((produit) => produit.societeId === numericId);
}

async function localCatalogueFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${LOCAL_API_BASE}${endpoint}`, {
    cache: "no-store",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (!res.ok) {
    const message = await res.text().catch(() => res.statusText);
    throw new Error(
      `[catalogue-local] ${res.status} ${res.statusText}${
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
      `[catalogue-api] API distante indisponible pour ${endpoint}, fallback local`,
      err
    );
    return localCatalogueFetch<T>(endpoint, options);
  }
}

export async function getProduits(
  societeId?: number | string
): Promise<ProduitDTO[]> {
  const endpoint = buildProduitEndpoint(societeId);
  try {
    return await requestWithLocalFallback<ProduitDTO[]>(endpoint);
  } catch (err) {
    console.error(
      "[getProduits] Fallback local indisponible, retour mockProduits",
      err
    );
    return filterMockProduits(societeId);
  }
}

export async function getProduit(id: number | string): Promise<ProduitDTO> {
  try {
    return await requestWithLocalFallback<ProduitDTO>(`/produits/${id}`);
  } catch (err) {
    console.error(
      "[getProduit] Fallback local indisponible, tentative mockProduits",
      err
    );
    const numericId = Number(id);
    const fallback = mockProduits.find((produit) => produit.id === numericId);
    if (fallback) {
      return fallback;
    }
    throw err;
  }
}

export function createProduit(data: ProduitCreateDTO): Promise<ProduitDTO> {
  return requestWithLocalFallback("/produits", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function updateProduit(
  id: number | string,
  data: ProduitCreateDTO
): Promise<ProduitDTO> {
  return requestWithLocalFallback(`/produits/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}

export function deleteProduit(id: number | string): Promise<void> {
  return requestWithLocalFallback(`/produits/${id}`, { method: "DELETE" });
}

export function mouvementStock(
  data: StockMouvementDTO
): Promise<StockMouvementDTO> {
  return requestWithLocalFallback("/stock/mouvements", {
    method: "POST",
    body: JSON.stringify(data)
  });
}
