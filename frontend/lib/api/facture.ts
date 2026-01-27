import { api } from "./base";
import { bffFetch } from "@/lib/api/bffFetch";
import { FactureDTO, FactureCreateDTO, FactureUpdateDTO, PaiementDTO, FactureImportResponse } from "@/types";

export function getFactures(
  token: string,
  filters?: {
  societeId?: number | string;
  clientId?: number | string;
}): Promise<FactureDTO[]> {
  if (filters?.societeId && filters?.clientId) {
    return api(token, `/factures/societe/${filters.societeId}/client/${filters.clientId}`);
  }
  if (filters?.societeId) return api(token, `/factures/societe/${filters.societeId}`);
  if (filters?.clientId) return api(token, `/factures/client/${filters.clientId}`);
  return api(token, "/factures");
}

export function getFacture(token: string, id: number | string): Promise<FactureDTO> {
  return api(token, `/factures/${id}`);
}

export function createFacture(token: string, data: FactureCreateDTO): Promise<FactureDTO> {
  return api(token, "/factures", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function updateFacture(
  token: string,
  id: number | string,
  data: FactureUpdateDTO
): Promise<FactureDTO> {
  return api(token, `/factures/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}

export function deleteFacture(token: string, id: number | string): Promise<void> {
  return api(token, `/factures/${id}`, { method: "DELETE" });
}

export function payerFacture(
  token: string,
  id: number | string,
  data: PaiementDTO
): Promise<PaiementDTO> {
  return api(token, `/factures/${id}/paiements`, {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export async function importFactures(
  token: string,
  file: File,
  societeId: number
): Promise<FactureImportResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('societeId', societeId.toString());
  
  // Do NOT set Content-Type - browser will set it with boundary for multipart

  const response = await bffFetch<FactureImportResponse>("/api/factures/import", token, {
    method: "POST",
    body: formData,
  });

  return response;
}
