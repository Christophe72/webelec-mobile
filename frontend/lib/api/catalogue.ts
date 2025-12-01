import { api } from "./base";
import { ProduitDTO, ProduitCreateDTO, StockMouvementDTO } from "@/types";

export function getProduits(): Promise<ProduitDTO[]> {
  return api("/produits");
}

export function createProduit(data: ProduitCreateDTO): Promise<ProduitDTO> {
  return api("/produits", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function getProduit(id: string): Promise<ProduitDTO> {
  return api(`/produits/${id}`);
}

export function updateProduit(id: string, data: Partial<ProduitCreateDTO>): Promise<ProduitDTO> {
  return api(`/produits/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data)
  });
}

export function mouvementStock(data: StockMouvementDTO): Promise<StockMouvementDTO> {
  return api("/stock/mouvements", {
    method: "POST",
    body: JSON.stringify(data)
  });
}
