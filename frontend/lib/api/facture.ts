import { api } from "./base";
import { FactureDTO, FactureCreateDTO, FactureUpdateDTO, PaiementDTO } from "@/types";

export function getFactures(): Promise<FactureDTO[]> {
  return api("/factures");
}

export function getFacture(id: string): Promise<FactureDTO> {
  return api(`/factures/${id}`);
}

export function createFacture(data: FactureCreateDTO): Promise<FactureDTO> {
  return api("/factures", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function updateFacture(id: string, data: FactureUpdateDTO): Promise<FactureDTO> {
  return api(`/factures/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data)
  });
}

export function payerFacture(id: string, data: PaiementDTO): Promise<PaiementDTO> {
  return api(`/factures/${id}/paiements`, {
    method: "POST",
    body: JSON.stringify(data)
  });
}
