import { PieceJustificativeResponse, PieceUploadDTO } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export async function uploadPiece(data: PieceUploadDTO): Promise<PieceJustificativeResponse> {
  const form = new FormData();
  form.append("type", data.type);
  if (data.interventionId) form.append("interventionId", data.interventionId.toString());
  if (data.devisId) form.append("devisId", data.devisId.toString());
  if (data.factureId) form.append("factureId", data.factureId.toString());
  form.append("file", data.file);

  const res = await fetch(`${API_URL}/pieces/upload`, {
    method: "POST",
    body: form
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg);
  }

  return res.json();
}

export async function getPiece(id: number): Promise<PieceJustificativeResponse> {
  const res = await fetch(`${API_URL}/pieces/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to get piece: ${res.statusText}`);
  }
  return res.json();
}

export async function downloadPiece(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/pieces/${id}/download`);
  if (!res.ok) {
    throw new Error(`Failed to download piece: ${res.statusText}`);
  }
  
  const blob = await res.blob();
  const contentDisposition = res.headers.get('Content-Disposition');
  let filename = `download-${id}`;
  
  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
    if (filenameMatch) {
      filename = filenameMatch[1];
    }
  }
  
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

export async function getPiecesByIntervention(interventionId: number): Promise<PieceJustificativeResponse[]> {
  const res = await fetch(`${API_URL}/pieces/intervention/${interventionId}`);
  if (!res.ok) {
    throw new Error(`Failed to get pieces: ${res.statusText}`);
  }
  return res.json();
}

export async function getPiecesByDevis(devisId: number): Promise<PieceJustificativeResponse[]> {
  const res = await fetch(`${API_URL}/pieces/devis/${devisId}`);
  if (!res.ok) {
    throw new Error(`Failed to get pieces: ${res.statusText}`);
  }
  return res.json();
}

export async function getPiecesByFacture(factureId: number): Promise<PieceJustificativeResponse[]> {
  const res = await fetch(`${API_URL}/pieces/facture/${factureId}`);
  if (!res.ok) {
    throw new Error(`Failed to get pieces: ${res.statusText}`);
  }
  return res.json();
}

export async function deletePiece(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/pieces/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) {
    throw new Error(`Failed to delete piece: ${res.statusText}`);
  }
}
