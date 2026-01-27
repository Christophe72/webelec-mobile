/**
 * API client pour les calculateurs électriques
 * Gestion de l'historique des calculs
 */

import { api } from './base';
import type { CalculHistoryDTO, CalculHistoryCreateDTO } from '@/types/dto/calculateur';

/**
 * Récupère l'historique des calculs avec filtres optionnels
 */
export async function getCalculHistory(
  token: string,
  filters?: {
    chantierId?: number;
    type?: string;
  }
): Promise<CalculHistoryDTO[]> {
  const params = new URLSearchParams();
  if (filters?.chantierId) {
    params.set('chantierId', String(filters.chantierId));
  }
  if (filters?.type) {
    params.set('type', filters.type);
  }

  const queryString = params.toString();
  const endpoint = queryString ? `/calculateur/history?${queryString}` : '/calculateur/history';

  try {
    return (await api<CalculHistoryDTO[]>(token, endpoint)) ?? [];
  } catch (error) {
    // Endpoint parfois indisponible en dev (backend pas à jour).
    console.warn('Failed to load calculation history from backend:', error);
    return [];
  }
}

/**
 * Sauvegarde un calcul dans l'historique
 */
export async function saveCalculHistory(
  token: string,
  data: CalculHistoryCreateDTO
): Promise<CalculHistoryDTO> {
  return api<CalculHistoryDTO>(token, '/calculateur/history', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Supprime un calcul de l'historique
 */
export async function deleteCalculHistory(token: string, id: number): Promise<void> {
  return api<void>(token, `/calculateur/history/${id}`, {
    method: 'DELETE',
  });
}
