import { api } from "./base";
import { ClientDTO, ClientCreateDTO, ClientUpdateDTO } from "@/types";

export async function getClients(
  token: string,
  societeId?: number | string
): Promise<ClientDTO[]> {
  const data = await api<ClientDTO[]>(token, "/clients");
  if (societeId === undefined || societeId === null || societeId === "") {
    return data;
  }
  const numericId = Number(societeId);
  return data.filter((client) => client.societe?.id === numericId);
}

export function getClient(token: string, id: number | string): Promise<ClientDTO> {
  return api(token, `/clients/${id}`);
}

export function createClient(token: string, data: ClientCreateDTO): Promise<ClientDTO> {
  return api(token, "/clients", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function updateClient(
  token: string,
  id: number | string,
  data: ClientUpdateDTO
): Promise<ClientDTO> {
  return api(token, `/clients/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}

export function deleteClient(token: string, id: number | string): Promise<void> {
  return api(token, `/clients/${id}`, { method: "DELETE" });
}
