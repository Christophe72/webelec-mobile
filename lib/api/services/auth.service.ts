import { apiClient } from "../client";
import { API_ENDPOINTS } from "../config";
import {
  AuthLoginRequest,
  AuthRegisterRequest,
  AuthResponse,
  UtilisateurResponse,
} from "../types";

export const authService = {
  /**
   * Connexion d'un utilisateur
   */
  async login(credentials: AuthLoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );

    // Stocker les tokens
    apiClient.setTokens(response.accessToken, response.refreshToken);

    return response;
  },

  /**
   * Inscription d'un nouvel utilisateur
   */
  async register(data: AuthRegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      data
    );

    // Stocker les tokens
    apiClient.setTokens(response.accessToken, response.refreshToken);

    return response;
  },

  /**
   * Rafraîchir le token d'accès
   */
  async refresh(refreshToken: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REFRESH, {
      refreshToken,
    });

    // Mettre à jour les tokens
    apiClient.setTokens(response.accessToken, response.refreshToken);

    return response;
  },

  /**
   * Récupérer les informations de l'utilisateur connecté
   */
  async me(): Promise<UtilisateurResponse> {
    return apiClient.get<UtilisateurResponse>(API_ENDPOINTS.AUTH.ME);
  },

  /**
   * Déconnexion
   */
  logout(): void {
    apiClient.clearTokens();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  },

  /**
   * Vérifier si l'utilisateur est authentifié
   */
  isAuthenticated(): boolean {
    return apiClient.isAuthenticated();
  },
};
