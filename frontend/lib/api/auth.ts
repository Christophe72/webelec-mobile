import { api } from "./base";
import {
  AuthResponseDTO,
  LoginRequestDTO,
  RefreshRequestDTO,
  RegisterRequestDTO,
  UserDTO
} from "@/types";

export function login(data: LoginRequestDTO): Promise<AuthResponseDTO> {
  return api<AuthResponseDTO>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function register(data: RegisterRequestDTO): Promise<AuthResponseDTO> {
  return api<AuthResponseDTO>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function refresh(data: RefreshRequestDTO): Promise<AuthResponseDTO> {
  return api<AuthResponseDTO>("/auth/refresh", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function me(): Promise<UserDTO> {
  return api<UserDTO>("/auth/me");
}
