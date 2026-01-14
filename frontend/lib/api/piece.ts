import { PieceJustificativeResponse, PieceUploadDTO } from "@/types";
import { getToken } from "@/lib/api/auth-storage";

const API_URL: string = process.env.NEXT_PUBLIC_API_BASE ?? (() => {
  throw new Error("NEXT_PUBLIC_API_BASE is not defined");
})();

function withAuth(init: RequestInit = {}): RequestInit {
  const headers = new Headers(init.headers ?? undefined);
  if (typeof window !== "undefined") {
    const token = getToken();
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }
  return { ...init, headers };
}

async function fetchJson<T>(
  endpoint: string,
  init: RequestInit = {}
): Promise<T> {
  const res = await fetch(
    `${API_URL}${endpoint}`,
    withAuth({ cache: "no-store", ...init })
  );
  if (!res.ok) {
    const message = await res.text().catch(() => res.statusText);
    throw new Error(
      `[pieces] ${res.status} ${res.statusText}${
        message ? ` - ${message}` : ""
      }`
    );
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return (await res.json()) as T;
}

async function fetchBinary(endpoint: string): Promise<Response> {
  const res = await fetch(`${API_URL}${endpoint}`, withAuth({ cache: "no-store" }));
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
  data: PieceUploadDTO
): Promise<PieceJustificativeResponse> {
  const res = await fetch(
    `${API_URL}/pieces/upload`,
    withAuth({
      method: "POST",
      body: buildFormData(data),
      cache: "no-store"
    })
  );
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(msg);
  }
  return (await res.json()) as PieceJustificativeResponse;
}

export function getPiece(
  id: number
): Promise<PieceJustificativeResponse> {
  return fetchJson<PieceJustificativeResponse>(`/pieces/${id}`);
}

export async function downloadPiece(id: number): Promise<void> {
  const res = await fetchBinary(`/pieces/${id}/download`);
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
  interventionId: number
): Promise<PieceJustificativeResponse[]> {
  return fetchJson(`/pieces/intervention/${interventionId}`);
}

export function getPiecesByDevis(
  devisId: number
): Promise<PieceJustificativeResponse[]> {
  return fetchJson(`/pieces/devis/${devisId}`);
}

export function getPiecesByFacture(
  factureId: number
): Promise<PieceJustificativeResponse[]> {
  return fetchJson(`/pieces/facture/${factureId}`);
}

export function deletePiece(id: number): Promise<void> {
  return fetchJson(`/pieces/${id}`, {
    method: "DELETE"
  });
}
