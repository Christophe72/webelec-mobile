import { api } from "./base";
import { ProduitAvanceCreateDTO, ProduitAvanceDTO, ProduitAvanceUpdateDTO } from "@/types";

export function getProduitsAvances(societeId?: number | string): Promise<ProduitAvanceDTO[]> {
  const endpoint = societeId ? `/produits-avances/societe/${societeId}` : "/produits-avances";
  return api(endpoint);
}

export function getProduitAvance(id: number | string): Promise<ProduitAvanceDTO> {
  return api(`/produits-avances/${id}`);
}

export function createProduitAvance(data: ProduitAvanceCreateDTO): Promise<ProduitAvanceDTO> {
  return api("/produits-avances", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function updateProduitAvance(id: number | string, data: ProduitAvanceUpdateDTO): Promise<ProduitAvanceDTO> {
  return api(`/produits-avances/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}

export function deleteProduitAvance(id: number | string): Promise<void> {
  return api(`/produits-avances/${id}`, { method: "DELETE" });
}
