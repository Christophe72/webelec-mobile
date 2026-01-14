import { SocieteRequest, SocieteResponse } from "@/types";
import { api } from "@/lib/api/base";

export async function getSocietes(): Promise<SocieteResponse[]> {
  return (await api<SocieteResponse[]>("/societes")) ?? [];
}

export function getSociete(id: number | string): Promise<SocieteResponse> {
  return api(`/societes/${id}`);
}

export function createSociete(data: SocieteRequest): Promise<SocieteResponse> {
  return api("/societes", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function deleteSocieteById(id: string): Promise<void> {
  return api(`/societes/${id}`, { method: "DELETE" });
}
