import { api } from "./base";
import { ModuleDTO, ModuleCreateDTO, ModuleUpdateDTO } from "@/types";

export async function getModules(token: string): Promise<ModuleDTO[]> {
  return (await api<ModuleDTO[]>(token, "/modules")) ?? [];
}

export function getModule(
  token: string,
  id: number | string
): Promise<ModuleDTO> {
  return api(token, `/modules/${id}`);
}

export function createModule(
  token: string,
  data: ModuleCreateDTO
): Promise<ModuleDTO> {
  return api(token, "/modules", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function updateModule(
  token: string,
  id: number | string,
  data: ModuleUpdateDTO
): Promise<ModuleDTO> {
  return api(token, `/modules/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}

export function deleteModule(
  token: string,
  id: number | string
): Promise<void> {
  return api(token, `/modules/${id}`, { method: "DELETE" });
}
