import { api } from "./base";
import { DevisDTO, DevisCreateDTO, DevisUpdateDTO } from "@/types";

function filterDevis(
  devis: DevisDTO[],
  filters?: {
    societeId?: number | string;
    clientId?: number | string;
  }
): DevisDTO[] {
  if (!filters) return devis;
  return devis.filter((item) => {
    const matchSociete =
      filters.societeId === undefined ||
      item.societeId === Number(filters.societeId);
    const matchClient =
      filters.clientId === undefined ||
      item.clientId === Number(filters.clientId);
    return matchSociete && matchClient;
  });
}

export async function getDevis(
  token: string,
  filters?: {
  societeId?: number | string;
  clientId?: number | string;
}): Promise<DevisDTO[]> {
  const data = await api<DevisDTO[]>(token, "/devis");
  return filterDevis(data, filters);
}

export function getDevisById(
  token: string,
  id: number | string
): Promise<DevisDTO> {
  return api(token, `/devis/${id}`);
}

export const getUnDevis = getDevisById;

export function createDevis(
  token: string,
  data: DevisCreateDTO
): Promise<DevisDTO> {
  return api(token, "/devis", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function updateDevis(
  token: string,
  id: number | string,
  data: DevisUpdateDTO
): Promise<DevisDTO> {
  return api(token, `/devis/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}

export function deleteDevis(
  token: string,
  id: number | string
): Promise<void> {
  return api(token, `/devis/${id}`, { method: "DELETE" });
}
