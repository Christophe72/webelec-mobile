import { api } from "./base";
import { DevisDTO, DevisCreateDTO, DevisUpdateDTO } from "@/types";

export function getDevis(): Promise<DevisDTO[]> {
  return api("/devis");
}

export function getUnDevis(id: string): Promise<DevisDTO> {
  return api(`/devis/${id}`);
}

export function createDevis(data: DevisCreateDTO): Promise<DevisDTO> {
  return api("/devis", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function updateDevis(id: string, data: DevisUpdateDTO): Promise<DevisDTO> {
  return api(`/devis/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data)
  });
}
