import { api } from "./base";
import { FactureDTO, FactureCreateDTO, FactureUpdateDTO, PaiementDTO } from "@/types";

export function getFactures(filters?: {
  societeId?: number | string;
  clientId?: number | string;
}): Promise<FactureDTO[]> {
  if (filters?.societeId && filters?.clientId) {
    return api(`/factures/societe/${filters.societeId}/client/${filters.clientId}`);
  }
  if (filters?.societeId) return api(`/factures/societe/${filters.societeId}`);
  if (filters?.clientId) return api(`/factures/client/${filters.clientId}`);
  return api("/factures");
}

export function getFacture(id: number | string): Promise<FactureDTO> {
  return api(`/factures/${id}`);
}

export function createFacture(data: FactureCreateDTO): Promise<FactureDTO> {
  return api("/factures", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function updateFacture(id: number | string, data: FactureUpdateDTO): Promise<FactureDTO> {
  return api(`/factures/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}

export function deleteFacture(id: number | string): Promise<void> {
  return api(`/factures/${id}`, { method: "DELETE" });
}

export function payerFacture(id: number | string, data: PaiementDTO): Promise<PaiementDTO> {
  return api(`/factures/${id}/paiements`, {
    method: "POST",
    body: JSON.stringify(data)
  });
}

import { FactureImportResponse } from "@/types";
import { getToken } from "./auth-storage";

const API_URL = process.env.NEXT_PUBLIC_API_BASE;

export async function importFactures(file: File, societeId: number): Promise<FactureImportResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('societeId', societeId.toString());

  const token = getToken();
  const headers: HeadersInit = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  // Do NOT set Content-Type - browser will set it with boundary for multipart

  const response = await fetch(`${API_URL}/factures/import`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Import failed' }));
    throw new Error(errorData.message || 'Import failed');
  }

  return await response.json();
}
