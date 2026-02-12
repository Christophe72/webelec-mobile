// Types correspondant aux DTOs du backend Spring

export interface AuthLoginRequest {
  email: string;
  password: string;
}

export interface AuthRegisterRequest {
  email: string;
  password: string;
  nom: string;
  prenom: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  utilisateur: UtilisateurResponse;
}

export interface UtilisateurResponse {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: string;
  societe?: SocieteSummary;
}

export interface SocieteSummary {
  id: number;
  nom: string;
}

export interface ClientSummary {
  id: number;
  nom: string;
  prenom: string;
}

// Client
export interface ClientRequest {
  nom: string;
  prenom: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  societeId: number;
}

export interface ClientResponse {
  id: number;
  nom: string;
  prenom: string;
  telephone?: string;
  adresse?: string;
  societe: SocieteSummary;
}

// Chantier
export interface ChantierRequest {
  nom: string;
  adresse?: string;
  description?: string;
  societeId: number;
  clientId: number;
}

export interface ChantierResponse {
  id: number;
  nom: string;
  adresse?: string;
  description?: string;
  societe: SocieteSummary;
  client: ClientSummary;
}

// Erreur API
export interface ApiError {
  message: string;
  status: number;
  timestamp?: string;
  path?: string;
}
