import { api } from "./base";
import { ProduitAvanceCreateDTO, ProduitAvanceDTO, ProduitAvanceUpdateDTO } from "@/types";

export function getProduitsAvances(
  token: string,
  societeId?: number | string
): Promise<ProduitAvanceDTO[]> {
  const endpoint = societeId ? `/produits-avances/societe/${societeId}` : "/produits-avances";
  return api(token, endpoint);
}

export function getProduitAvance(
  token: string,
  id: number | string
): Promise<ProduitAvanceDTO> {
  return api(token, `/produits-avances/${id}`);
}

export function createProduitAvance(
  token: string,
  data: ProduitAvanceCreateDTO
): Promise<ProduitAvanceDTO> {
  return api(token, "/produits-avances", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function updateProduitAvance(
  token: string,
  id: number | string,
  data: ProduitAvanceUpdateDTO
): Promise<ProduitAvanceDTO> {
  return api(token, `/produits-avances/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}

export function deleteProduitAvance(
  token: string,
  id: number | string
): Promise<void> {
  return api(token, `/produits-avances/${id}`, { method: "DELETE" });
}
