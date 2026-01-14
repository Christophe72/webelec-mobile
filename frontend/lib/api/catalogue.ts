import { api } from "./base";
import { ProduitDTO, ProduitCreateDTO, StockMouvementDTO } from "@/types";

function buildProduitEndpoint(societeId?: number | string): string {
  if (societeId !== undefined && societeId !== null && societeId !== "") {
    return `/produits/societe/${societeId}`;
  }
  return "/produits";
}

export async function getProduits(
  societeId?: number | string
): Promise<ProduitDTO[]> {
  const endpoint = buildProduitEndpoint(societeId);
  return api<ProduitDTO[]>(endpoint);
}

export async function getProduit(id: number | string): Promise<ProduitDTO> {
  return api(`/produits/${id}`);
}

export function createProduit(data: ProduitCreateDTO): Promise<ProduitDTO> {
  return api("/produits", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function updateProduit(
  id: number | string,
  data: ProduitCreateDTO
): Promise<ProduitDTO> {
  return api(`/produits/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}

export function deleteProduit(id: number | string): Promise<void> {
  return api(`/produits/${id}`, { method: "DELETE" });
}

export function mouvementStock(
  data: StockMouvementDTO
): Promise<StockMouvementDTO> {
  return api("/stock/mouvements", {
    method: "POST",
    body: JSON.stringify(data)
  });
}
