import { api } from "./base";
import { LoginRequestDTO, LoginResponseDTO } from "@/types";

export function login(data: LoginRequestDTO): Promise<LoginResponseDTO> {
  return api<LoginResponseDTO>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function me(): Promise<LoginResponseDTO["user"]> {
  return api("/auth/me");
}
