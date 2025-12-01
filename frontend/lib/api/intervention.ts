import { api } from "./base";
import { InterventionDTO, InterventionCreateDTO, InterventionUpdateDTO } from "@/types";

export function getInterventions(): Promise<InterventionDTO[]> {
  return api("/interventions");
}

export function getIntervention(id: string): Promise<InterventionDTO> {
  return api(`/interventions/${id}`);
}

export function createIntervention(data: InterventionCreateDTO): Promise<InterventionDTO> {
  return api("/interventions", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function updateIntervention(id: string, data: InterventionUpdateDTO): Promise<InterventionDTO> {
  return api(`/interventions/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data)
  });
}
