/**
 * Calcul de la section de câble selon le RGIE
 *
 * Détermine la section minimale requise d'un câble en cuivre en fonction :
 * - Du courant à transporter (A)
 * - De la longueur du circuit (m)
 * - De la tension (230V ou 400V)
 * - Du type de circuit (éclairage, prises, dédié)
 *
 * Conforme au RGIE belge (Articles 4.4.3.2, 5.2.3, Table 52-C1)
 */

import type { SectionInputs, SectionResult, CalculStatus } from '@/types/dto/calculateur';
import {
  AMPACITY_TABLE,
  RESISTANCE_TABLE,
  VOLTAGE_DROP_LIMITS,
  MINIMUM_SECTIONS,
  STANDARD_SECTIONS,
  MESSAGES,
} from './rgie-constants';

/**
 * Calcule la section de câble recommandée
 *
 * @param inputs - Paramètres du circuit (courant, longueur, tension, type)
 * @returns Résultat avec section recommandée, statut et message
 */
export function calculateCableSection(inputs: SectionInputs): SectionResult {
  const { courant, longueur, tension, typeCircuit, typeInstallation = 'neuf' } = inputs;

  // Validation basique des entrées
  if (courant <= 0 || longueur <= 0) {
    return {
      sectionRecommandee: 0,
      status: 'non-conforme',
      message: 'Valeurs invalides : courant et longueur doivent être positifs',
      details: {
        chuteCalculee: 0,
        intensiteAdmissible: 0,
      },
    };
  }

  // Étape 1 : Section minimale selon le type de circuit (RGIE 4.4.3.2)
  const minSection = typeCircuit === 'dedie' ? 0 : MINIMUM_SECTIONS[typeCircuit];

  // Étape 2 : Section selon l'intensité (RGIE Table 52-C1)
  let sectionByAmpacity = 0;
  for (const section of STANDARD_SECTIONS) {
    const ampacity = AMPACITY_TABLE[section];
    if (ampacity >= courant) {
      sectionByAmpacity = section;
      break;
    }
  }

  // Si aucune section ne convient, prendre la plus grande
  if (sectionByAmpacity === 0) {
    const maxSection = STANDARD_SECTIONS[STANDARD_SECTIONS.length - 1];
    return {
      sectionRecommandee: maxSection,
      status: 'non-conforme',
      message: `Courant trop élevé (${courant}A). Section maximale : ${maxSection}mm² (${AMPACITY_TABLE[maxSection]}A max)`,
      details: {
        chuteCalculee: 0,
        intensiteAdmissible: AMPACITY_TABLE[maxSection],
      },
    };
  }

  // Prendre le max entre section min et section par ampacité
  let candidateSection = Math.max(minSection, sectionByAmpacity);

  // Étape 3 : Vérification chute de tension (RGIE 5.2.3)
  // On augmente la section si nécessaire pour respecter les limites
  let finalSection = candidateSection;
  let voltageDrop = 0;

  for (const section of STANDARD_SECTIONS) {
    if (section < candidateSection) continue;

    voltageDrop = calculateVoltageDrop(section, longueur, courant, tension);

    const limits = getVoltageDropLimits(typeCircuit, typeInstallation);

    if (voltageDrop <= limits.ok) {
      finalSection = section;
      break;
    }

    // Pour rénovation, on accepte jusqu'à la limite
    if (typeInstallation === 'renovation' && voltageDrop <= limits.limite) {
      finalSection = section;
      break;
    }
  }

  // Recalculer la chute finale avec la section choisie
  const finalVoltageDrop = calculateVoltageDrop(finalSection, longueur, courant, tension);
  const status = determineStatus(finalVoltageDrop, typeCircuit, typeInstallation);
  const message = buildMessage(status, finalVoltageDrop, finalSection, typeCircuit);

  return {
    sectionRecommandee: finalSection,
    status,
    message,
    details: {
      chuteCalculee: finalVoltageDrop,
      intensiteAdmissible: AMPACITY_TABLE[finalSection],
    },
  };
}

/**
 * Calcule la chute de tension en pourcentage
 *
 * Formule RGIE : ΔU% = (2 × L × I × R) / U × 100
 * - Facteur 2 : aller-retour du courant
 * - L : longueur en mètres (aller simple)
 * - I : courant en ampères
 * - R : résistance linéique en Ω/m (table RGIE en Ω/km)
 * - U : tension en volts
 *
 * @param section - Section du câble en mm²
 * @param longueur - Longueur aller simple en mètres
 * @param courant - Intensité en ampères
 * @param tension - Tension en volts
 * @returns Chute de tension en pourcentage
 */
function calculateVoltageDrop(
  section: number,
  longueur: number,
  courant: number,
  tension: number
): number {
  const resistancePerKm = RESISTANCE_TABLE[section];
  if (!resistancePerKm) return 999; // Section non trouvée

  const resistancePerMeter = resistancePerKm / 1000; // Conversion Ω/km → Ω/m
  const voltageDropVolts = 2 * longueur * courant * resistancePerMeter;
  const voltageDropPercent = (voltageDropVolts / tension) * 100;

  return Math.round(voltageDropPercent * 10) / 10; // Arrondi à 1 décimale
}

/**
 * Retourne les limites de chute de tension selon le type de circuit et d'installation
 */
function getVoltageDropLimits(
  typeCircuit: string,
  typeInstallation: string
): { ok: number; limite: number } {
  const isEclairage = typeCircuit === 'eclairage';

  if (typeInstallation === 'neuf') {
    const limit = isEclairage ? VOLTAGE_DROP_LIMITS.neuf.eclairage : VOLTAGE_DROP_LIMITS.neuf.autres;
    return { ok: limit, limite: limit };
  }

  // Rénovation
  return isEclairage
    ? VOLTAGE_DROP_LIMITS.renovation.eclairage
    : VOLTAGE_DROP_LIMITS.renovation.autres;
}

/**
 * Détermine le statut selon la chute de tension calculée
 */
function determineStatus(
  voltageDrop: number,
  typeCircuit: string,
  typeInstallation: string
): CalculStatus {
  const limits = getVoltageDropLimits(typeCircuit, typeInstallation);

  if (voltageDrop <= limits.ok) {
    return 'ok';
  }

  if (typeInstallation === 'renovation' && voltageDrop <= limits.limite) {
    return 'limite';
  }

  return 'non-conforme';
}

/**
 * Construit un message clair et contextualisé
 */
function buildMessage(
  status: CalculStatus,
  voltageDrop: number,
  section: number,
  typeCircuit: string
): string {
  const baseMsg = `Section ${section}mm² | Chute : ${voltageDrop}%`;

  switch (status) {
    case 'ok':
      return `${baseMsg}. ${MESSAGES.section.ok}`;
    case 'limite':
      return `${baseMsg}. ${MESSAGES.section.limite}`;
    case 'non-conforme':
      return `${baseMsg}. ${MESSAGES.section.nonConforme}`;
    default:
      return baseMsg;
  }
}
