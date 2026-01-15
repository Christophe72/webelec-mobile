/**
 * API client pour les préférences utilisateur
 */

import { api } from './base';
import type { CalculateurPreferences, CalculateurPreferencesUpdateDTO } from '@/types/dto/preferences';

/**
 * Récupère les préférences de l'utilisateur pour les calculateurs
 */
export async function getCalculateurPreferences(): Promise<CalculateurPreferences | null> {
  try {
    return await api<CalculateurPreferences>('/calculateur/preferences');
  } catch (error) {
    // Si l'endpoint n'existe pas encore ou erreur, retourner null
    console.warn('Failed to load preferences from backend:', error);
    return null;
  }
}

/**
 * Met à jour les préférences de l'utilisateur
 */
export async function updateCalculateurPreferences(
  preferences: CalculateurPreferencesUpdateDTO
): Promise<CalculateurPreferences> {
  return api<CalculateurPreferences>('/calculateur/preferences', {
    method: 'PUT',
    body: JSON.stringify({ preferences }),
  });
}
