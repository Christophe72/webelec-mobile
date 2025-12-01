import { api } from "./base";
import { DevisDTO, DevisCreateDTO, DevisUpdateDTO } from "@/types";

export function getDevis(filters?: {
  societeId?: number | string;
  clientId?: number | string;
}): Promise<DevisDTO[]> {
  if (filters?.societeId && filters?.clientId) {
    return api(`/devis/societe/${filters.societeId}/client/${filters.clientId}`);
  }
  if (filters?.societeId) return api(`/devis/societe/${filters.societeId}`);
  if (filters?.clientId) return api(`/devis/client/${filters.clientId}`);
  return api("/devis");
}

export function getDevisById(id: number | string): Promise<DevisDTO> {
  return api(`/devis/${id}`);
}

export const getUnDevis = getDevisById;

export function createDevis(data: DevisCreateDTO): Promise<DevisDTO> {
  return api("/devis", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function updateDevis(id: number | string, data: DevisUpdateDTO): Promise<DevisDTO> {
  return api(`/devis/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}

export function deleteDevis(id: number | string): Promise<void> {
  return api(`/devis/${id}`, { method: "DELETE" });
}
