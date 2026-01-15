/**
 * API client pour les calculateurs électriques
 * Gestion de l'historique des calculs
 */

import { api } from './base';
import type { CalculHistoryDTO, CalculHistoryCreateDTO } from '@/types/dto/calculateur';

/**
 * Récupère l'historique des calculs avec filtres optionnels
 */
export async function getCalculHistory(filters?: {
  chantierId?: number;
  type?: string;
}): Promise<CalculHistoryDTO[]> {
  const params = new URLSearchParams();
  if (filters?.chantierId) {
    params.set('chantierId', String(filters.chantierId));
  }
  if (filters?.type) {
    params.set('type', filters.type);
  }

  const queryString = params.toString();
  const endpoint = queryString ? `/calculateur/history?${queryString}` : '/calculateur/history';

  return (await api<CalculHistoryDTO[]>(endpoint)) ?? [];
}

/**
 * Sauvegarde un calcul dans l'historique
 */
export async function saveCalculHistory(
  data: CalculHistoryCreateDTO
): Promise<CalculHistoryDTO> {
  return api<CalculHistoryDTO>('/calculateur/history', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Supprime un calcul de l'historique
 */
export async function deleteCalculHistory(id: number): Promise<void> {
  return api<void>(`/calculateur/history/${id}`, {
    method: 'DELETE',
  });
}
