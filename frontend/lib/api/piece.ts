import { PieceJustificativeResponse, PieceUploadDTO } from "@/types";
import { getToken } from "@/lib/api/auth-storage";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE ||
  "http://localhost:8080/api";
const LOCAL_API_BASE = "/api";

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

async function fetchJsonFromBase<T>(
  base: string,
  endpoint: string,
  init: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${base}${endpoint}`, init);
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

async function fetchJsonWithFallback<T>(
  endpoint: string,
  init: RequestInit = {}
): Promise<T> {
  try {
    return await fetchJsonFromBase<T>(
      API_URL,
      endpoint,
      withAuth({ cache: "no-store", ...init })
    );
  } catch (err) {
    console.warn(
      `[pieces-api] API distante indisponible pour ${endpoint}, fallback local`,
      err
    );
    return fetchJsonFromBase<T>(LOCAL_API_BASE, endpoint, {
      cache: "no-store",
      credentials: "include",
      ...init
    });
  }
}

async function fetchBinaryWithFallback(
  endpoint: string
): Promise<Response> {
  try {
    const res = await fetch(
      `${API_URL}${endpoint}`,
      withAuth({ cache: "no-store" })
    );
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    return res;
  } catch (err) {
    console.warn(
      `[pieces-download] API distante indisponible pour ${endpoint}, fallback local`,
      err
    );
    return fetch(`${LOCAL_API_BASE}${endpoint}`, {
      cache: "no-store",
      credentials: "include"
    });
  }
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
  const attempt = async (base: string, init: RequestInit) => {
    const res = await fetch(`${base}/pieces/upload`, init);
    if (!res.ok) {
      const msg = await res.text().catch(() => res.statusText);
      throw new Error(msg);
    }
    return (await res.json()) as PieceJustificativeResponse;
  };

  try {
    return await attempt(
      API_URL,
      withAuth({
        method: "POST",
        body: buildFormData(data),
        cache: "no-store"
      })
    );
  } catch (err) {
    console.warn("[uploadPiece] API distante indisponible, fallback local", err);
    return attempt(LOCAL_API_BASE, {
      method: "POST",
      body: buildFormData(data),
      cache: "no-store",
      credentials: "include"
    });
  }
}

export function getPiece(
  id: number
): Promise<PieceJustificativeResponse> {
  return fetchJsonWithFallback<PieceJustificativeResponse>(`/pieces/${id}`);
}

export async function downloadPiece(id: number): Promise<void> {
  const res = await fetchBinaryWithFallback(`/pieces/${id}/download`);
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
  return fetchJsonWithFallback(`/pieces/intervention/${interventionId}`);
}

export function getPiecesByDevis(
  devisId: number
): Promise<PieceJustificativeResponse[]> {
  return fetchJsonWithFallback(`/pieces/devis/${devisId}`);
}

export function getPiecesByFacture(
  factureId: number
): Promise<PieceJustificativeResponse[]> {
  return fetchJsonWithFallback(`/pieces/facture/${factureId}`);
}

export function deletePiece(id: number): Promise<void> {
  return fetchJsonWithFallback(`/pieces/${id}`, {
    method: "DELETE"
  });
}
