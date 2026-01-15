/**
 * Types pour les préférences utilisateur des calculateurs
 */

import type { CircuitType, InstallationType, Tension } from './calculateur';

// ============================================================================
// Préférences Calculateur
// ============================================================================

export interface CalculateurPreferences {
  // Valeurs par défaut pour les formulaires
  defaultVoltage: Tension;
  defaultCircuitType: CircuitType;
  defaultInstallationType: InstallationType;

  // Seuils de tolérance pour la chute de tension
  voltageDrop: {
    warningThreshold: number; // % (défaut: 3)
    errorThreshold: number; // % (défaut: 5)
  };

  // Type de câble (V1: cuivre uniquement)
  cableType: 'cuivre';

  // Options avancées (pour futures versions)
  showAdvancedOptions?: boolean;
}

// Valeurs par défaut
export const DEFAULT_CALCULATEUR_PREFERENCES: CalculateurPreferences = {
  defaultVoltage: 230,
  defaultCircuitType: 'prises',
  defaultInstallationType: 'neuf',
  voltageDrop: {
    warningThreshold: 3,
    errorThreshold: 5,
  },
  cableType: 'cuivre',
  showAdvancedOptions: false,
};

// DTO pour mise à jour partielle
export type CalculateurPreferencesUpdateDTO = Partial<CalculateurPreferences>;
