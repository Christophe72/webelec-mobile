import { SocieteRequest, SocieteResponse } from "@/types";
import { api } from "@/lib/api/base";

export async function getSocietes(token: string): Promise<SocieteResponse[]> {
  return (await api<SocieteResponse[]>(token, "/societes")) ?? [];
}

export function getSociete(
  token: string,
  id: number | string
): Promise<SocieteResponse> {
  return api(token, `/societes/${id}`);
}

export function createSociete(
  token: string,
  data: SocieteRequest
): Promise<SocieteResponse> {
  return api(token, "/societes", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function deleteSocieteById(
  token: string,
  id: string
): Promise<void> {
  return api(token, `/societes/${id}`, { method: "DELETE" });
}
