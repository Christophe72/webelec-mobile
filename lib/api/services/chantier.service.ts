import { apiClient } from "../client";
import { API_ENDPOINTS } from "../config";
import { ChantierRequest, ChantierResponse } from "../types";

export const chantierService = {
  /**
   * Récupérer tous les chantiers
   */
  async getAll(): Promise<ChantierResponse[]> {
    return apiClient.get<ChantierResponse[]>(API_ENDPOINTS.CHANTIERS.BASE);
  },

  /**
   * Récupérer les chantiers d'une société
   */
  async getBySociete(societeId: number): Promise<ChantierResponse[]> {
    return apiClient.get<ChantierResponse[]>(
      API_ENDPOINTS.CHANTIERS.BY_SOCIETE(societeId)
    );
  },

  /**
   * Récupérer un chantier par ID
   */
  async getById(id: number): Promise<ChantierResponse> {
    return apiClient.get<ChantierResponse>(API_ENDPOINTS.CHANTIERS.BY_ID(id));
  },

  /**
   * Créer un nouveau chantier
   */
  async create(data: ChantierRequest): Promise<ChantierResponse> {
    return apiClient.post<ChantierResponse>(API_ENDPOINTS.CHANTIERS.BASE, data);
  },

  /**
   * Mettre à jour un chantier
   */
  async update(id: number, data: ChantierRequest): Promise<ChantierResponse> {
    return apiClient.put<ChantierResponse>(
      API_ENDPOINTS.CHANTIERS.BY_ID(id),
      data
    );
  },

  /**
   * Supprimer un chantier
   */
  async delete(id: number): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.CHANTIERS.BY_ID(id));
  },
};
