/**
 * Calcul du disjoncteur associé selon le RGIE
 *
 * Détermine le calibre et la courbe du disjoncteur en fonction :
 * - De la section du câble (mm²)
 * - Du type de circuit (éclairage, prises, dédié)
 * - Du type d'installation (monophasé, triphasé)
 * - Du courant de l'appareil (optionnel, pour circuits dédiés)
 *
 * Conforme au RGIE belge (Article 7.6.4)
 */

import type { DisjoncteurInputs, DisjoncteurResult, CalculStatus } from '@/types/dto/calculateur';
import {
  AMPACITY_TABLE,
  STANDARD_BREAKER_RATINGS,
  MAX_BREAKER_BY_CIRCUIT,
  CABLE_PROTECTION_FACTOR,
  COURBE_DEFAULT,
  MESSAGES,
} from './rgie-constants';

/**
 * Calcule le disjoncteur recommandé
 *
 * @param inputs - Paramètres du circuit (section, type, installation, courant optionnel)
 * @returns Résultat avec calibre, courbe, statut et alertes
 */
export function calculateCircuitBreaker(inputs: DisjoncteurInputs): DisjoncteurResult {
  const { section, typeCircuit, typeInstallation, courant } = inputs;

  // Validation basique
  if (section <= 0) {
    return {
      calibreRecommande: 0,
      courbe: COURBE_DEFAULT,
      status: 'non-conforme',
      message: 'Section invalide',
    };
  }

  // Vérifier que la section existe dans la table d'ampacité
  const cableMaxCurrent = AMPACITY_TABLE[section];
  if (!cableMaxCurrent) {
    return {
      calibreRecommande: 0,
      courbe: COURBE_DEFAULT,
      status: 'non-conforme',
      message: `Section ${section}mm² non reconnue`,
    };
  }

  // Étape 1 : Déterminer le calibre maximum selon le type de circuit
  let maxBreakerRating: number;

  if (typeCircuit === 'dedie' && courant) {
    // Circuit dédié : calibre basé sur le courant de l'appareil
    // On cherche le calibre standard immédiatement supérieur ou égal au courant
    maxBreakerRating = findNextStandardRating(courant);
  } else {
    // Éclairage ou prises : vérifier les limites spécifiques
    const circuitLimits = MAX_BREAKER_BY_CIRCUIT[typeCircuit];
    if (circuitLimits && circuitLimits[section]) {
      maxBreakerRating = circuitLimits[section];
    } else {
      // Pas de limite spécifique, utiliser l'ampacité du câble
      maxBreakerRating = cableMaxCurrent;
    }
  }

  // Étape 2 : Protection du câble (RGIE 7.6.4)
  // Le disjoncteur ne doit pas dépasser 110% de l'ampacité du câble
  const cableProtectionLimit = Math.floor(cableMaxCurrent * CABLE_PROTECTION_FACTOR);

  // Étape 3 : Choisir le calibre final
  const recommendedRating = Math.min(maxBreakerRating, cableProtectionLimit);

  // Trouver le calibre standard immédiatement inférieur ou égal
  const finalRating = findPreviousStandardRating(recommendedRating);

  // Étape 4 : Vérifications et alertes
  const { status, alerte, message } = validateBreakerSelection(
    finalRating,
    cableMaxCurrent,
    section,
    typeCircuit,
    courant
  );

  return {
    calibreRecommande: finalRating,
    courbe: COURBE_DEFAULT, // V1 : toujours courbe C
    status,
    message,
    alerte,
  };
}

/**
 * Trouve le calibre standard immédiatement supérieur ou égal à la valeur donnée
 */
function findNextStandardRating(value: number): number {
  for (const rating of STANDARD_BREAKER_RATINGS) {
    if (rating >= value) {
      return rating;
    }
  }
  // Si aucun calibre ne convient, retourner le maximum
  return STANDARD_BREAKER_RATINGS[STANDARD_BREAKER_RATINGS.length - 1];
}

/**
 * Trouve le calibre standard immédiatement inférieur ou égal à la valeur donnée
 */
function findPreviousStandardRating(value: number): number {
  let previous = STANDARD_BREAKER_RATINGS[0];
  for (const rating of STANDARD_BREAKER_RATINGS) {
    if (rating > value) {
      return previous;
    }
    previous = rating;
  }
  return previous;
}

/**
 * Valide la sélection du disjoncteur et génère le statut, message et alertes
 */
function validateBreakerSelection(
  breakerRating: number,
  cableMaxCurrent: number,
  section: number,
  typeCircuit: string,
  courant?: number
): {
  status: CalculStatus;
  message: string;
  alerte?: string;
} {
  // Vérification 1 : Le disjoncteur protège-t-il le câble ?
  if (breakerRating > cableMaxCurrent * CABLE_PROTECTION_FACTOR) {
    return {
      status: 'non-conforme',
      message: `Disjoncteur ${breakerRating}A trop élevé pour câble ${section}mm² (max ${cableMaxCurrent}A)`,
      alerte: MESSAGES.disjoncteur.alerte,
    };
  }

  // Vérification 2 : Le disjoncteur convient-il au courant demandé ?
  if (courant && breakerRating < courant) {
    return {
      status: 'non-conforme',
      message: `Disjoncteur ${breakerRating}A insuffisant pour courant ${courant}A`,
      alerte: 'Augmentez la section du câble ou réduisez le courant',
    };
  }

  // Vérification 3 : Alerte si le disjoncteur est proche de la limite du câble
  const utilisationRatio = breakerRating / cableMaxCurrent;
  if (utilisationRatio > 0.9) {
    return {
      status: 'limite',
      message: `Disjoncteur ${breakerRating}A | Courbe ${COURBE_DEFAULT} | Câble ${section}mm²`,
      alerte: `Utilisation proche du maximum du câble (${Math.round(utilisationRatio * 100)}%)`,
    };
  }

  // Tout est OK
  let typeLabel = '';
  switch (typeCircuit) {
    case 'eclairage':
      typeLabel = 'éclairage';
      break;
    case 'prises':
      typeLabel = 'prises';
      break;
    case 'dedie':
      typeLabel = 'circuit dédié';
      break;
  }

  return {
    status: 'ok',
    message: `Disjoncteur ${breakerRating}A | Courbe ${COURBE_DEFAULT} | ${typeLabel.charAt(0).toUpperCase() + typeLabel.slice(1)} ${section}mm². ${MESSAGES.disjoncteur.ok}`,
  };
}
