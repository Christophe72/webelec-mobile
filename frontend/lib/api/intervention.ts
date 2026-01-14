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


export async function getInterventions(filters?: {
  societeId?: number | string;
  chantierId?: number | string;
}): Promise<InterventionDTO[]> {
  const endpoint = buildInterventionEndpoint(filters);
  return api<InterventionDTO[]>(endpoint);
}

export function getIntervention(id: number | string): Promise<InterventionDTO> {
  return api(`/interventions/${id}`);
}

export function createIntervention(data: InterventionCreateDTO): Promise<InterventionDTO> {
  return api("/interventions", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function updateIntervention(id: number | string, data: InterventionUpdateDTO): Promise<InterventionDTO> {
  return api(`/interventions/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}

export function deleteIntervention(id: number | string): Promise<void> {
  return api(`/interventions/${id}`, { method: "DELETE" });
}
