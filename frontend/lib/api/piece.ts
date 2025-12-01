import { PieceDTO, PieceUploadDTO } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export async function uploadPiece(data: PieceUploadDTO): Promise<PieceDTO> {
  const form = new FormData();
  form.append("type", data.type);
  if (data.interventionId) form.append("interventionId", data.interventionId);
  if (data.devisId) form.append("devisId", data.devisId);
  if (data.factureId) form.append("factureId", data.factureId);
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

export function getPiece(id: string): Promise<PieceDTO> {
  return fetch(`${API_URL}/pieces/${id}`).then(r => r.json());
}
