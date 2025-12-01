import { api } from "./base";
import { ProduitDTO, ProduitCreateDTO, StockMouvementDTO } from "@/types";

export function getProduits(societeId?: number | string): Promise<ProduitDTO[]> {
  const endpoint = societeId ? `/produits/societe/${societeId}` : "/produits";
  return api(endpoint);
}

export function getProduit(id: number | string): Promise<ProduitDTO> {
  return api(`/produits/${id}`);
}

export function createProduit(data: ProduitCreateDTO): Promise<ProduitDTO> {
  return api("/produits", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function updateProduit(id: number | string, data: ProduitCreateDTO): Promise<ProduitDTO> {
  return api(`/produits/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}

export function deleteProduit(id: number | string): Promise<void> {
  return api(`/produits/${id}`, { method: "DELETE" });
}

export function mouvementStock(data: StockMouvementDTO): Promise<StockMouvementDTO> {
  return api("/stock/mouvements", {
    method: "POST",
    body: JSON.stringify(data)
  });
}
