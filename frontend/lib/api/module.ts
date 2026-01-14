import { api } from "./base";
import { ModuleDTO, ModuleCreateDTO, ModuleUpdateDTO } from "@/types";

export async function getModules(): Promise<ModuleDTO[]> {
  return (await api<ModuleDTO[]>("/modules")) ?? [];
}

export function getModule(id: number | string): Promise<ModuleDTO> {
  return api(`/modules/${id}`);
}

export function createModule(data: ModuleCreateDTO): Promise<ModuleDTO> {
  return api("/modules", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function updateModule(
  id: number | string,
  data: ModuleUpdateDTO
): Promise<ModuleDTO> {
  return api(`/modules/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}

export function deleteModule(id: number | string): Promise<void> {
  return api(`/modules/${id}`, { method: "DELETE" });
}
