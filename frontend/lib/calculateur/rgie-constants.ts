/**
 * Constantes RGIE (Règlement Général sur les Installations Électriques - Belgique)
 *
 * Tables de référence pour les calculs électriques conformes aux normes belges.
 *
 * IMPORTANT: Ces valeurs sont basées sur :
 * - Câbles cuivre uniquement (pas aluminium en V1)
 * - Installation type B (encastré standard)
 * - Température ambiante 30°C
 * - Circuit unique (pas de facteur de groupement)
 */

// ============================================================================
// AMPACITÉ DES CÂBLES (RGIE Table 52-C1)
// ============================================================================

/**
 * Intensité maximale admissible (en Ampères) par section de câble en cuivre
 * Méthode de pose B1 (conduits encastrés dans parois thermiquement isolantes)
 *
 * Key: Section en mm²
 * Value: Intensité max en A
 */
export const AMPACITY_TABLE: Record<number, number> = {
  1.5: 17.5,
  2.5: 24,
  4: 32,
  6: 41,
  10: 57,
  16: 76,
  25: 101,
  35: 125,
  50: 157,
  70: 196,
  95: 238,
  120: 276,
  150: 315,
  185: 361,
  240: 430,
};

/**
 * Liste des sections standard disponibles (triées par ordre croissant)
 */
export const STANDARD_SECTIONS = Object.keys(AMPACITY_TABLE)
  .map(Number)
  .sort((a, b) => a - b);

// ============================================================================
// RÉSISTANCE DES CÂBLES (RGIE Table normative)
// ============================================================================

/**
 * Résistance linéique des conducteurs en cuivre (en Ω/km à 20°C)
 *
 * Key: Section en mm²
 * Value: Résistance en Ω/km
 */
export const RESISTANCE_TABLE: Record<number, number> = {
  1.5: 12.1,
  2.5: 7.41,
  4: 4.61,
  6: 3.08,
  10: 1.83,
  16: 1.15,
  25: 0.727,
  35: 0.524,
  50: 0.387,
  70: 0.268,
  95: 0.193,
  120: 0.153,
  150: 0.124,
  185: 0.099,
  240: 0.0754,
};

// ============================================================================
// CALIBRES STANDARD DES DISJONCTEURS (RGIE 7.6.4)
// ============================================================================

/**
 * Calibres nominaux standard des disjoncteurs (en Ampères)
 * Triés par ordre croissant
 */
export const STANDARD_BREAKER_RATINGS = [
  6, 10, 13, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125,
];

// ============================================================================
// LIMITES DE CHUTE DE TENSION (RGIE Article 5.2.3)
// ============================================================================

/**
 * Chutes de tension maximales admissibles selon le type d'installation
 *
 * RGIE 5.2.3.1 : Limites pour installations domestiques/similaires
 * - Éclairage : 3% max
 * - Autres usages : 5% max
 *
 * Tolérance supplémentaire pour installations en rénovation (usage pratique)
 */
export const VOLTAGE_DROP_LIMITS = {
  neuf: {
    eclairage: 3, // % max pour circuits d'éclairage
    autres: 5, // % max pour autres circuits (prises, dédié)
  },
  renovation: {
    eclairage: {
      ok: 3, // % conforme
      limite: 5, // % toléré avec avertissement
    },
    autres: {
      ok: 5, // % conforme
      limite: 7, // % toléré avec avertissement
    },
  },
};

// ============================================================================
// SECTIONS MINIMALES PAR TYPE DE CIRCUIT (RGIE 4.4.3.2)
// ============================================================================

/**
 * Sections minimales requises selon le type de circuit
 *
 * RGIE 4.4.3.2.2 : Sections minimales des conducteurs
 * - Éclairage : 1.5 mm² minimum
 * - Prises de courant : 2.5 mm² minimum
 * - Circuits dédiés : calculé selon le courant
 */
export const MINIMUM_SECTIONS: Record<string, number> = {
  eclairage: 1.5,
  prises: 2.5,
  dedie: 0, // Calculated based on current
};

// ============================================================================
// CALIBRES MAX PAR TYPE DE CIRCUIT (RGIE 7.6.4)
// ============================================================================

/**
 * Calibres maximaux des disjoncteurs par type de circuit et section
 *
 * RGIE 7.6.4 : Protection contre les surintensités
 * - Éclairage 1.5mm² : 10A max (16A toléré si < 10 points lumineux)
 * - Prises 2.5mm² : 20A max (usage courant 16A)
 * - Autres : selon ampacité du câble
 */
export const MAX_BREAKER_BY_CIRCUIT: Record<string, Record<number, number>> = {
  eclairage: {
    1.5: 10, // 10A max pour 1.5mm² (éclairage)
    2.5: 16,
    4: 20,
  },
  prises: {
    2.5: 20, // 20A max pour 2.5mm² (prises)
    4: 25,
    6: 32,
  },
  dedie: {}, // Calculated based on cable ampacity
};

// ============================================================================
// COURBES DE DÉCLENCHEMENT (RGIE 7.6.4.2)
// ============================================================================

/**
 * Courbes de déclenchement magnéto-thermique des disjoncteurs
 *
 * - Courbe B : 3 à 5 × In (résidentiel, éclairage)
 * - Courbe C : 5 à 10 × In (usage général, le plus courant)
 * - Courbe D : 10 à 20 × In (moteurs, transformateurs)
 *
 * V1 : On utilise uniquement la courbe C (usage général)
 */
export const COURBE_DEFAULT = "C" as const;

/**
 * Facteur de sécurité pour la protection câble/disjoncteur
 * Le calibre du disjoncteur ne doit pas dépasser 110% de l'ampacité du câble
 */
export const CABLE_PROTECTION_FACTOR = 1.1;

// ============================================================================
// MESSAGES STANDARD
// ============================================================================

export const MESSAGES = {
  section: {
    ok: "Section adaptée. Installation conforme au RGIE.",
    limite: "Chute de tension proche de la limite. Acceptable en rénovation.",
    nonConforme:
      "Chute de tension excessive ! Augmentez la section ou réduisez la longueur.",
  },
  disjoncteur: {
    ok: "Disjoncteur adapté. Protection correcte du câble.",
    alerte: "Le disjoncteur ne protège pas correctement le câble !",
  },
  chuteTension: {
    conforme: "Chute de tension acceptable selon RGIE.",
    limite: "Tolérable en rénovation, correction recommandée en neuf.",
    nonConforme:
      "Chute excessive ! Augmentez la section ou réduisez la longueur.",
  },
};

// ============================================================================
// DISCLAIMER RGIE
// ============================================================================

export const RGIE_DISCLAIMER =
  "Ces calculs sont fournis à titre indicatif selon le RGIE belge. " +
  "Une validation par un électricien agréé est requise pour toute installation électrique.";
