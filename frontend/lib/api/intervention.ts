import { api } from "./base";
import {
  InterventionDTO,
  InterventionCreateDTO,
  InterventionUpdateDTO
} from "@/types";

function buildInterventionEndpoint(filters?: {
  societeId?: number | string;
  chantierId?: number | string;
}): string {
  if (filters?.societeId) {
    return `/interventions/societe/${filters.societeId}`;
  }
  if (filters?.chantierId) {
    return `/interventions/chantier/${filters.chantierId}`;
  }
  return "/interventions";
}


export async function getInterventions(
  token: string,
  filters?: {
  societeId?: number | string;
  chantierId?: number | string;
}): Promise<InterventionDTO[]> {
  const endpoint = buildInterventionEndpoint(filters);
  return api<InterventionDTO[]>(token, endpoint);
}

export function getIntervention(
  token: string,
  id: number | string
): Promise<InterventionDTO> {
  return api(token, `/interventions/${id}`);
}

export function createIntervention(
  token: string,
  data: InterventionCreateDTO
): Promise<InterventionDTO> {
  return api(token, "/interventions", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function updateIntervention(
  token: string,
  id: number | string,
  data: InterventionUpdateDTO
): Promise<InterventionDTO> {
  return api(token, `/interventions/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}

export function deleteIntervention(
  token: string,
  id: number | string
): Promise<void> {
  return api(token, `/interventions/${id}`, { method: "DELETE" });
}
