import { api } from "./base";
import { ChantierDTO, ChantierCreateDTO, ChantierUpdateDTO } from "@/types";

function buildChantierEndpoint(societeId?: number | string): string {
  if (societeId !== undefined && societeId !== null && societeId !== "") {
    return `/chantiers/societe/${societeId}`;
  }
  return "/chantiers";
}

export async function getChantiers(
  societeId?: number | string
): Promise<ChantierDTO[]> {
  const endpoint = buildChantierEndpoint(societeId);
  return api<ChantierDTO[]>(endpoint);
}

export function getChantier(id: number | string): Promise<ChantierDTO> {
  return api(`/chantiers/${id}`);
}

export function createChantier(data: ChantierCreateDTO): Promise<ChantierDTO> {
  return api("/chantiers", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function updateChantier(
  id: number | string,
  data: ChantierUpdateDTO
): Promise<ChantierDTO> {
  return api(`/chantiers/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}

export function deleteChantier(id: number | string): Promise<void> {
  return api(`/chantiers/${id}`, { method: "DELETE" });
}
