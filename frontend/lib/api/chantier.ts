import { api } from "./base";
import { ChantierDTO, ChantierCreateDTO, ChantierUpdateDTO } from "@/types";

export function getChantiers(): Promise<ChantierDTO[]> {
  return api("/chantiers");
}

export function getChantier(id: string): Promise<ChantierDTO> {
  return api(`/chantiers/${id}`);
}

export function createChantier(data: ChantierCreateDTO): Promise<ChantierDTO> {
  return api("/chantiers", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function updateChantier(id: string, data: ChantierUpdateDTO): Promise<ChantierDTO> {
  return api(`/chantiers/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data)
  });
}
