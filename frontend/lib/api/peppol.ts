import { api } from "./base";
import { UblDTO, PeppolResultDTO } from "@/types";

export function getUbl(
  token: string,
  factureId: number | string
): Promise<UblDTO> {
  return api(token, `/factures/${factureId}/ubl`);
}

export function envoyerPeppol(
  token: string,
  factureId: number | string
): Promise<PeppolResultDTO> {
  return api(token, `/factures/${factureId}/peppol`, {
    method: "POST"
  });
}
