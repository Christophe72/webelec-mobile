import { api } from "./base";
import { UblDTO, PeppolResultDTO } from "@/types";

export function getUbl(factureId: string): Promise<UblDTO> {
  return api(`/factures/${factureId}/ubl`);
}

export function envoyerPeppol(factureId: string): Promise<PeppolResultDTO> {
  return api(`/factures/${factureId}/peppol`, {
    method: "POST"
  });
}
