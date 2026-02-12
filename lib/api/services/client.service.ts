import { apiClient } from "../client";
import { API_ENDPOINTS } from "../config";
import { ClientRequest, ClientResponse } from "../types";

export const clientService = {
  /**
   * Récupérer tous les clients
   */
  async getAll(): Promise<ClientResponse[]> {
    return apiClient.get<ClientResponse[]>(API_ENDPOINTS.CLIENTS.BASE);
  },

  /**
   * Récupérer un client par ID
   */
  async getById(id: number): Promise<ClientResponse> {
    return apiClient.get<ClientResponse>(API_ENDPOINTS.CLIENTS.BY_ID(id));
  },

  /**
   * Créer un nouveau client
   */
  async create(data: ClientRequest): Promise<ClientResponse> {
    return apiClient.post<ClientResponse>(API_ENDPOINTS.CLIENTS.BASE, data);
  },

  /**
   * Mettre à jour un client
   */
  async update(id: number, data: ClientRequest): Promise<ClientResponse> {
    return apiClient.put<ClientResponse>(API_ENDPOINTS.CLIENTS.BY_ID(id), data);
  },

  /**
   * Supprimer un client
   */
  async delete(id: number): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.CLIENTS.BY_ID(id));
  },
};
