/**
 * API client pour les préférences utilisateur
 */

import { api } from './base';
import {
  DEFAULT_CALCULATEUR_PREFERENCES,
  type CalculateurPreferences,
  type CalculateurPreferencesUpdateDTO,
} from '@/types/dto/preferences';

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
  try {
    return await api<CalculateurPreferences>('/calculateur/preferences', {
      method: 'PUT',
      body: JSON.stringify({ preferences }),
    });
  } catch (error) {
    console.warn('Failed to save preferences to backend:', error);
    return {
      ...DEFAULT_CALCULATEUR_PREFERENCES,
      ...preferences,
      voltageDrop: {
        ...DEFAULT_CALCULATEUR_PREFERENCES.voltageDrop,
        ...(preferences.voltageDrop ?? {}),
      },
    };
  }
}
