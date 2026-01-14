import { api } from "./base";
import { ClientDTO, ClientCreateDTO, ClientUpdateDTO } from "@/types";

export async function getClients(
  societeId?: number | string
): Promise<ClientDTO[]> {
  const data = await api<ClientDTO[]>("/clients");
  if (societeId === undefined || societeId === null || societeId === "") {
    return data;
  }
  const numericId = Number(societeId);
  return data.filter((client) => client.societe?.id === numericId);
}

export function getClient(id: number | string): Promise<ClientDTO> {
  return api(`/clients/${id}`);
}

export function createClient(data: ClientCreateDTO): Promise<ClientDTO> {
  return api("/clients", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function updateClient(
  id: number | string,
  data: ClientUpdateDTO
): Promise<ClientDTO> {
  return api(`/clients/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}

export function deleteClient(id: number | string): Promise<void> {
  return api(`/clients/${id}`, { method: "DELETE" });
}
