import { api } from "./base";
import { ProduitDTO, ProduitCreateDTO, StockMouvementDTO } from "@/types";

function buildProduitEndpoint(societeId?: number | string): string {
  if (societeId !== undefined && societeId !== null && societeId !== "") {
    return `/produits/societe/${societeId}`;
  }
  return "/produits";
}

export async function getProduits(
  token: string,
  societeId?: number | string
): Promise<ProduitDTO[]> {
  const endpoint = buildProduitEndpoint(societeId);
  return api<ProduitDTO[]>(token, endpoint);
}

export async function getProduit(
  token: string,
  id: number | string
): Promise<ProduitDTO> {
  return api(token, `/produits/${id}`);
}

export function createProduit(
  token: string,
  data: ProduitCreateDTO
): Promise<ProduitDTO> {
  return api(token, "/produits", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function updateProduit(
  token: string,
  id: number | string,
  data: ProduitCreateDTO
): Promise<ProduitDTO> {
  return api(token, `/produits/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}

export function deleteProduit(
  token: string,
  id: number | string
): Promise<void> {
  return api(token, `/produits/${id}`, { method: "DELETE" });
}

export function mouvementStock(
  token: string,
  data: StockMouvementDTO
): Promise<StockMouvementDTO> {
  return api(token, "/stock/mouvements", {
    method: "POST",
    body: JSON.stringify(data)
  });
}
