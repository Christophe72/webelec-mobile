import { api } from "./base";
import { ChantierDTO, ChantierCreateDTO, ChantierUpdateDTO } from "@/types";

function buildChantierEndpoint(societeId?: number | string): string {
  if (societeId !== undefined && societeId !== null && societeId !== "") {
    return `/chantiers/societe/${societeId}`;
  }
  return "/chantiers";
}

export async function getChantiers(
  token: string,
  societeId?: number | string
): Promise<ChantierDTO[]> {
  const endpoint = buildChantierEndpoint(societeId);
  return api<ChantierDTO[]>(token, endpoint);
}

export function getChantier(
  token: string,
  id: number | string
): Promise<ChantierDTO> {
  return api(token, `/chantiers/${id}`);
}

export function createChantier(
  token: string,
  data: ChantierCreateDTO
): Promise<ChantierDTO> {
  return api(token, "/chantiers", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function updateChantier(
  token: string,
  id: number | string,
  data: ChantierUpdateDTO
): Promise<ChantierDTO> {
  return api(token, `/chantiers/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}

export function deleteChantier(
  token: string,
  id: number | string
): Promise<void> {
  return api(token, `/chantiers/${id}`, { method: "DELETE" });
}
