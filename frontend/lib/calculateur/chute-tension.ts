/**
 * Calcul de la chute de tension selon le RGIE
 *
 * Évalue la chute de tension d'un circuit électrique en fonction :
 * - De la section du câble (mm²)
 * - De la longueur du circuit (m)
 * - Du courant (A)
 * - De la tension (230V ou 400V)
 * - Du type de circuit et d'installation
 *
 * Conforme au RGIE belge (Article 5.2.3)
 */

import type { ChuteTensionInputs, ChuteTensionResult, CalculStatus } from '@/types/dto/calculateur';
import { RESISTANCE_TABLE, VOLTAGE_DROP_LIMITS, MESSAGES } from './rgie-constants';

/**
 * Calcule la chute de tension du circuit
 *
 * @param inputs - Paramètres du circuit
 * @returns Résultat avec chute en % et V, statut et message
 */
export function calculateVoltageDrop(inputs: ChuteTensionInputs): ChuteTensionResult {
  const { section, longueur, courant, tension, typeCircuit, typeInstallation = 'neuf' } = inputs;

  // Validation basique
  if (section <= 0 || longueur <= 0 || courant <= 0) {
    return {
      chutePourcentage: 0,
      chuteVolts: 0,
      status: 'non-conforme',
      message: 'Valeurs invalides : section, longueur et courant doivent être positifs',
    };
  }

  // Vérifier que la section existe dans la table de résistance
  const resistancePerKm = RESISTANCE_TABLE[section];
  if (!resistancePerKm) {
    return {
      chutePourcentage: 0,
      chuteVolts: 0,
      status: 'non-conforme',
      message: `Section ${section}mm² non reconnue`,
    };
  }

  // Calcul de la chute de tension
  // Formule RGIE : ΔU = 2 × L × I × R
  // - Facteur 2 : aller-retour du courant
  // - L : longueur en mètres (aller simple)
  // - I : courant en ampères
  // - R : résistance linéique en Ω/m
  const resistancePerMeter = resistancePerKm / 1000; // Conversion Ω/km → Ω/m
  const chuteVolts = 2 * longueur * courant * resistancePerMeter;
  const chutePourcentage = (chuteVolts / tension) * 100;

  // Arrondir à 1 décimale
  const roundedPercent = Math.round(chutePourcentage * 10) / 10;
  const roundedVolts = Math.round(chuteVolts * 10) / 10;

  // Déterminer le statut et le message
  const { status, message } = evaluateCompliance(
    roundedPercent,
    typeCircuit,
    typeInstallation,
    section,
    roundedVolts
  );

  return {
    chutePourcentage: roundedPercent,
    chuteVolts: roundedVolts,
    status,
    message,
  };
}

/**
 * Évalue la conformité de la chute de tension selon les limites RGIE
 */
function evaluateCompliance(
  voltageDrop: number,
  typeCircuit: string,
  typeInstallation: string,
  section: number,
  voltageDropVolts: number
): {
  status: CalculStatus;
  message: string;
} {
  const isEclairage = typeCircuit === 'eclairage';

  // Récupérer les limites selon le type de circuit et d'installation
  let okLimit: number;
  let warningLimit: number;

  if (typeInstallation === 'neuf') {
    const limit = isEclairage ? VOLTAGE_DROP_LIMITS.neuf.eclairage : VOLTAGE_DROP_LIMITS.neuf.autres;
    okLimit = limit;
    warningLimit = limit;
  } else {
    // Rénovation
    const limits = isEclairage
      ? VOLTAGE_DROP_LIMITS.renovation.eclairage
      : VOLTAGE_DROP_LIMITS.renovation.autres;
    okLimit = limits.ok;
    warningLimit = limits.limite;
  }

  // Déterminer le statut
  let status: CalculStatus;
  let baseMessage: string;

  if (voltageDrop <= okLimit) {
    status = 'ok';
    baseMessage = MESSAGES.chuteTension.conforme;
  } else if (voltageDrop <= warningLimit) {
    status = 'limite';
    baseMessage = MESSAGES.chuteTension.limite;
  } else {
    status = 'non-conforme';
    baseMessage = MESSAGES.chuteTension.nonConforme;
  }

  // Construire le message final
  const detailsMsg = `Chute : ${voltageDrop}% (${voltageDropVolts}V) | Section ${section}mm²`;
  const message = `${detailsMsg}. ${baseMessage}`;

  return { status, message };
}
