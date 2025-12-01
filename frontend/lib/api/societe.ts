import { api } from "./base";
import { SocieteRequest, SocieteResponse } from "@/types";

export function getSocietes(): Promise<SocieteResponse[]> {
  return api("/societes");
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

export function deleteSociete(id: number | string): Promise<void> {
  return api(`/societes/${id}`, { method: "DELETE" });
}
