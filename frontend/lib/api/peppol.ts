import { api } from "./base";
import { UblDTO, PeppolResultDTO } from "@/types";

export function getUbl(factureId: number | string): Promise<UblDTO> {
  return api(`/factures/${factureId}/ubl`);
}

export function envoyerPeppol(factureId: number | string): Promise<PeppolResultDTO> {
  return api(`/factures/${factureId}/peppol`, {
    method: "POST"
  });
}
