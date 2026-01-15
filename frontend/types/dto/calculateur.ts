// Types pour le module de calculatrices électriques

// ============================================================================
// Types de base
// ============================================================================

export type CircuitType = 'eclairage' | 'prises' | 'dedie';
export type InstallationType = 'renovation' | 'neuf';
export type Tension = 230 | 400;
export type CalculStatus = 'ok' | 'limite' | 'non-conforme';
export type CalculatorType = 'section' | 'disjoncteur' | 'chuteTension';
export type CourbeDisjoncteur = 'B' | 'C' | 'D';
export type TypeInstallation = 'monophase' | 'triphase';

// ============================================================================
// Section de câble
// ============================================================================

export interface SectionInputs {
  courant: number; // Amperes (A)
  longueur: number; // Meters (one-way)
  tension: Tension; // Volts
  typeCircuit: CircuitType;
  typeInstallation?: InstallationType;
}

export interface SectionResult {
  sectionRecommandee: number; // mm²
  status: CalculStatus;
  message: string;
  details: {
    chuteCalculee: number; // % voltage drop
    intensiteAdmissible: number; // Max ampacity for this section
  };
}

// ============================================================================
// Disjoncteur
// ============================================================================

export interface DisjoncteurInputs {
  section: number; // mm² (from section calculator)
  typeCircuit: CircuitType;
  typeInstallation: TypeInstallation;
  courant?: number; // Optional: appliance current for dedicated circuits
}

export interface DisjoncteurResult {
  calibreRecommande: number; // Amperes (A)
  courbe: CourbeDisjoncteur;
  status: CalculStatus;
  message: string;
  alerte?: string; // Cable/breaker mismatch warning
}

// ============================================================================
// Chute de tension
// ============================================================================

export interface ChuteTensionInputs {
  section: number; // mm²
  longueur: number; // Meters
  courant: number; // Amperes
  tension: Tension;
  typeCircuit: CircuitType;
  typeInstallation?: InstallationType;
}

export interface ChuteTensionResult {
  chutePourcentage: number; // %
  chuteVolts: number; // V
  status: CalculStatus;
  message: string;
}

// ============================================================================
// Historique des calculs
// ============================================================================

export interface CalculHistoryDTO {
  id: number;
  userId: number;
  chantierId: number | null; // Optional link to job site
  calculatorType: CalculatorType;
  inputs: Record<string, unknown>; // JSON blob of inputs
  results: Record<string, unknown>; // JSON blob of results
  notes?: string;
  createdAt: string;
}

export type CalculHistoryCreateDTO = Omit<CalculHistoryDTO, 'id' | 'userId' | 'createdAt'>;

// ============================================================================
// Préférences utilisateur
// ============================================================================

export interface CalculateurPreferences {
  defaultVoltage: Tension;
  defaultCircuitType: CircuitType;
  defaultInstallationType: InstallationType;
  voltageDrop: {
    warningThreshold: number; // % (default: 3)
    errorThreshold: number; // % (default: 5)
  };
  cableType: 'cuivre'; // V1: Only copper
  showAdvancedOptions?: boolean; // Future: Temperature corrections, etc.
}

export const DEFAULT_PREFERENCES: CalculateurPreferences = {
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

// ============================================================================
// State du panneau principal
// ============================================================================

export interface CalculatorState {
  section: SectionInputs;
  disjoncteur: DisjoncteurInputs;
  chuteTension: ChuteTensionInputs;
  activeTab: CalculatorType;
}
