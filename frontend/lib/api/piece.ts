import { PieceJustificativeResponse, PieceUploadDTO } from "@/types";
import { bffFetch } from "@/lib/api/bffFetch";

function buildHeaders(token: string, init?: RequestInit): Headers {
  const headers = new Headers(init?.headers ?? undefined);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return headers;
}

async function fetchJson<T>(
  token: string,
  endpoint: string,
  init: RequestInit = {}
): Promise<T> {
  return bffFetch<T>(`/api${endpoint}`, token, init);
}

async function fetchBinary(token: string, endpoint: string): Promise<Response> {
  const res = await fetch(`/api${endpoint}`, {
    headers: buildHeaders(token),
    cache: "no-store"
  });
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  return res;
}

function buildFormData(data: PieceUploadDTO): FormData {
  const form = new FormData();
  form.append("type", data.type);
  if (data.interventionId) {
    form.append("interventionId", data.interventionId.toString());
  }
  if (data.devisId) {
    form.append("devisId", data.devisId.toString());
  }
  if (data.factureId) {
    form.append("factureId", data.factureId.toString());
  }
  form.append("file", data.file);
  return form;
}

export async function uploadPiece(
  token: string,
  data: PieceUploadDTO
): Promise<PieceJustificativeResponse> {
  return bffFetch<PieceJustificativeResponse>("/api/pieces/upload", token, {
    method: "POST",
    body: buildFormData(data),
  });
}

export function getPiece(
  token: string,
  id: number
): Promise<PieceJustificativeResponse> {
  return fetchJson<PieceJustificativeResponse>(token, `/pieces/${id}`);
}

export async function downloadPiece(token: string, id: number): Promise<void> {
  const res = await fetchBinary(token, `/pieces/${id}/download`);
  if (!res.ok) {
    throw new Error(`Failed to download piece: ${res.statusText}`);
  }

  const blob = await res.blob();
  const contentDisposition = res.headers.get("Content-Disposition");
  let filename = `download-${id}`;

  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
    if (filenameMatch) {
      filename = filenameMatch[1];
    }
  }

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

export function getPiecesByIntervention(
  token: string,
  interventionId: number
): Promise<PieceJustificativeResponse[]> {
  return fetchJson(token, `/pieces/intervention/${interventionId}`);
}

export function getPiecesByDevis(
  token: string,
  devisId: number
): Promise<PieceJustificativeResponse[]> {
  return fetchJson(token, `/pieces/devis/${devisId}`);
}

export function getPiecesByFacture(
  token: string,
  factureId: number
): Promise<PieceJustificativeResponse[]> {
  return fetchJson(token, `/pieces/facture/${factureId}`);
}

export function deletePiece(token: string, id: number): Promise<void> {
  return fetchJson(token, `/pieces/${id}`, {
    method: "DELETE"
  });
}
