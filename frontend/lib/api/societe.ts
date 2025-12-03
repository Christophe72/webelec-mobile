import { SocieteRequest, SocieteResponse } from "@/types";
import { mockSocietes } from "./mockSocietes";
import { api } from "@/lib/api/base";

export async function getSocietes(): Promise<SocieteResponse[]> {
  try {
    return (await api<SocieteResponse[]>("/societes")) ?? [];
  } catch (err) {
    console.error("[getSocietes] Erreur réseau, utilisation du fallback mockSocietes", err);
    return mockSocietes;
  }
}


export async function getSociete(
  id: number | string
): Promise<SocieteResponse> {
  try {
    return await api<SocieteResponse>(`/societes/${id}`);
  } catch (err) {
    console.error(
      "[getSociete] Erreur réseau, tentative avec le fallback mockSocietes",
      err
    );
    const numericId = Number(id);
    const fallback = mockSocietes.find((s) => s.id === numericId);
    if (fallback) {
      return fallback;
    }
    throw err;
  }
}

export async function createSociete(
  data: SocieteRequest
): Promise<SocieteResponse> {
  try {
    return await api<SocieteResponse>("/societes", {
      method: "POST",
      body: JSON.stringify(data)
    });
  } catch (err) {
    console.error("[createSociete] Erreur réseau", err);
    throw err;
  }
}

export async function deleteSocieteById(id: string): Promise<void> {
  try {
    await api<void>(`/societes/${id}`, {
      method: "DELETE"
    });
  } catch (err) {
    console.error("[deleteSocieteById] Erreur réseau", err);
    throw err;
  }
}
