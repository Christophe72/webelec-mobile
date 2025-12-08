export interface LoginRequestDTO {
  email: string;
  motDePasse: string;
}

export interface RegisterRequestDTO {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  role: string;
  societeId: number;
}

export interface RefreshRequestDTO {
  refreshToken: string;
}

export interface UserDTO {
  id: number;
  nom: string | null;
  prenom: string | null;
  email: string;
  role: string | null;
  // On simplifie la forme de SocieteSummary pour le front
  societe?: {
    id: number;
    nom: string;
  } | null;
}

export interface AuthResponseDTO {
  accessToken: string;
  refreshToken: string;
  utilisateur: UserDTO;
}
