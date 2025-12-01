import { api } from "./base";
import { ClientDTO, ClientCreateDTO, ClientUpdateDTO } from "@/types";

export function getClients(): Promise<ClientDTO[]> {
  return api("/clients");
}

export function getClient(id: string): Promise<ClientDTO> {
  return api(`/clients/${id}`);
}

export function createClient(data: ClientCreateDTO): Promise<ClientDTO> {
  return api("/clients", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function updateClient(id: string, data: ClientUpdateDTO): Promise<ClientDTO> {
  return api(`/clients/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data)
  });
}

export function deleteClient(id: string): Promise<void> {
  return api(`/clients/${id}`, { method: "DELETE" });
}
