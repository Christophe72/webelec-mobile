export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface UserDTO {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

export interface LoginResponseDTO {
  token: string;
  user: UserDTO;
}
