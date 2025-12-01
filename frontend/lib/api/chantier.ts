import { api } from "./base";
import { ChantierDTO, ChantierCreateDTO, ChantierUpdateDTO } from "@/types";

export function getChantiers(societeId?: number | string): Promise<ChantierDTO[]> {
  const endpoint = societeId ? `/chantiers/societe/${societeId}` : "/chantiers";
  return api(endpoint);
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

export function updateChantier(id: number | string, data: ChantierUpdateDTO): Promise<ChantierDTO> {
  return api(`/chantiers/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}

export function deleteChantier(id: number | string): Promise<void> {
  return api(`/chantiers/${id}`, { method: "DELETE" });
}
