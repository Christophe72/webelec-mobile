// modules/account-validation/domain/engine.ts
import { AccountInput, Issue, NormalizedAccountDetails, ValidationResult } from "./types";
import { Steps } from "./steps";
import { getRules } from "./rules";

export interface BankWizardPort {
  // Resolve/reconfirm: returns authoritative normalized details (or errors)
  reconfirm(input: { iban?: string; bban?: string; bic?: string; country?: string }): Promise<{
    ok: boolean;
    issues?: Issue[];
    resolved?: NormalizedAccountDetails;
  }>;
}

export interface StorePort {
  storeTransposed(details: { original: NormalizedAccountDetails; resolved: NormalizedAccountDetails }): Promise<void>;
}

export interface EngineOptions {
  bankWizard?: BankWizardPort; // optional
  store?: StorePort;           // optional
  isCountrySupported?: (country: string) => boolean; // override
  manualConfirmationPolicy?: (ctx: { issues: Issue[]; country?: string }) => boolean;
}

function reject(issues: Issue[], details: NormalizedAccountDetails, steps: string[]): ValidationResult {
  return { status: "REJECTED", issues, details, meta: { steps } };
}

function needsConfirmation(
  issues: Issue[],
  policy?: (ctx: { issues: Issue[]; country?: string }) => boolean,
  country?: string
) {
  if (policy) return policy({ issues, country });
  // défaut : confirmation si WARNING sur champs bancaires ou si bic manquant mais requis
  return issues.some((i) => i.severity === "WARNING");
}

/** Utilitaire : modulo 97 IBAN (version simplifiée, ok pour prod si bien testée) */
function validateIbanBasic(iban: string): { ok: boolean; country?: string; issues: Issue[] } {
  const cleaned = iban.replace(/\s+/g, "").toUpperCase();
  if (!/^[A-Z0-9]+$/.test(cleaned)) {
    return { ok: false, issues: [{ code: "IBAN_CHARS", severity: "ERROR", message: "IBAN: caractères invalides", field: "iban" }] };
  }
  if (cleaned.length < 15 || cleaned.length > 34) {
    return { ok: false, issues: [{ code: "IBAN_LENGTH", severity: "ERROR", message: "IBAN: longueur invalide", field: "iban" }] };
  }
  const country = cleaned.slice(0, 2);
  // Mod97
  const rearranged = cleaned.slice(4) + cleaned.slice(0, 4);
  const expanded = rearranged.replace(/[A-Z]/g, (ch) => String(ch.charCodeAt(0) - 55));
  let remainder = 0;
  for (let i = 0; i < expanded.length; i += 7) {
    const block = String(remainder) + expanded.slice(i, i + 7);
    remainder = Number(block) % 97;
  }
  if (remainder !== 1) {
    return { ok: false, country, issues: [{ code: "IBAN_CHECKSUM", severity: "ERROR", message: "IBAN: checksum invalide", field: "iban" }] };
  }
  return { ok: true, country, issues: [] };
}

function validateBicBasic(bic?: string): Issue[] {
  if (!bic) return [];
  const cleaned = bic.replace(/\s+/g, "").toUpperCase();
  if (!/^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(cleaned)) {
    return [{ code: "BIC_FORMAT", severity: "ERROR", message: "BIC: format invalide", field: "bic" }];
  }
  return [];
}

function compareDetails(a: NormalizedAccountDetails, b: NormalizedAccountDetails): boolean {
  const norm = (s?: string) => (s ?? "").replace(/\s+/g, "").toUpperCase();
  return norm(a.iban) === norm(b.iban) && norm(a.bban) === norm(b.bban) && norm(a.bic) === norm(b.bic);
}

function detectTransposition(a: NormalizedAccountDetails, b: NormalizedAccountDetails): boolean {
  // Heuristique minimaliste : même longueur + 2 chars inversés dans IBAN/BBAN
  const x = (a.iban ?? a.bban ?? "").replace(/\s+/g, "");
  const y = (b.iban ?? b.bban ?? "").replace(/\s+/g, "");
  if (!x || !y || x.length !== y.length) return false;
  let diff = 0;
  for (let i = 0; i < x.length; i++) if (x[i] !== y[i]) diff++;
  return diff > 0 && diff <= 2; // simple, améliorable
}

export class AccountValidationEngine {
  constructor(private opts: EngineOptions = {}) {}

  async run(input: AccountInput): Promise<ValidationResult> {
    const steps: string[] = [];
    const issues: Issue[] = [];
    const details: NormalizedAccountDetails = {};

    // Step 1: Validate IBAN (si mode IBAN ou si on peut en former un plus tard)
    if (input.mode === "IBAN") {
      steps.push(Steps.S1_VALIDATE_IBAN);
      const ibanCheck = validateIbanBasic(input.iban ?? "");
      if (!ibanCheck.ok) {
        steps.push(Steps.S2_CHECK_ERRORS);
        return reject(ibanCheck.issues, { iban: input.iban, bic: input.bic }, steps);
      }
      details.iban = (input.iban ?? "").replace(/\s+/g, "").toUpperCase();
      details.country = ibanCheck.country;
      issues.push(...validateBicBasic(input.bic));
      details.bic = input.bic?.replace(/\s+/g, "").toUpperCase();
    } else {
      // mode BBAN: on garde les champs pour validation Step 4
      details.bban = input.bban?.replace(/\s+/g, "");
      details.bic = input.bic?.replace(/\s+/g, "").toUpperCase();
      details.country = input.countryHint;
    }

    // Step 3: Country supported?
    steps.push(Steps.S3_COUNTRY_SUPPORTED);
    const country = details.country ?? input.countryHint;
    if (!country) {
      return reject([{ code: "COUNTRY_MISSING", severity: "ERROR", message: "Pays manquant", field: "country" }], details, steps);
    }
    const supported = this.opts.isCountrySupported
      ? this.opts.isCountrySupported(country)
      : Boolean(getRules(country));
    if (!supported) {
      return reject([{ code: "COUNTRY_UNSUPPORTED", severity: "ERROR", message: "Pays non supporté", field: "country" }], details, steps);
    }

    // Step 4: Validate BBAN (and BIC)
    steps.push(Steps.S4_VALIDATE_BBAN_BIC);
    const rules = getRules(country);
    if (input.mode === "BBAN") {
      if (!rules?.supportsBbanValidation) {
        return reject([{ code: "BBAN_RULES_MISSING", severity: "ERROR", message: "Règles BBAN indisponibles pour ce pays" }], details, steps);
      }
      if (rules.bbanPattern && !rules.bbanPattern.test(details.bban ?? "")) {
        issues.push({ code: "BBAN_FORMAT", severity: "ERROR", message: "BBAN: format invalide", field: "bban" });
      }
      issues.push(...validateBicBasic(details.bic));
      if (rules.bicRequired && !details.bic) {
        issues.push({ code: "BIC_REQUIRED", severity: "ERROR", message: "BIC requis pour ce pays", field: "bic" });
      }
    } else {
      // mode IBAN: ici on peut valider BIC et éventuellement extraire/valider BBAN via external
      if (rules?.bicRequired && !details.bic) {
        issues.push({ code: "BIC_REQUIRED", severity: "ERROR", message: "BIC requis pour ce pays", field: "bic" });
      }
    }

    // Step 5: Errors?
    steps.push(Steps.S5_CHECK_ERRORS);
    const blockingErrors = issues.filter((i) => i.severity === "ERROR");
    if (blockingErrors.length) {
      return reject(issues, details, steps);
    }

    // Step 6: Treatable as errors? (ici tu peux décider que certains WARNING => ERROR)
    steps.push(Steps.S6_TREATABLE_AS_ERRORS);
    // Par défaut: rien. (Tu peux brancher une DMN/policy ici)
    // Exemple: si warning "BIC_OPTIONAL_MISSING" => error selon ton métier.

    // Step 7: Manual confirmation needed?
    steps.push(Steps.S7_MANUAL_CONFIRMATION_NEEDED);
    const needManual = needsConfirmation(issues, this.opts.manualConfirmationPolicy, country);

    let proposedDetails: NormalizedAccountDetails | undefined;
    if (needManual && this.opts.bankWizard) {
      // Step 8: reconfirm external
      steps.push(Steps.S8_RECONFIRM_EXTERNAL);
      const ext = await this.opts.bankWizard.reconfirm({
        iban: details.iban,
        bban: details.bban,
        bic: details.bic,
        country,
      });
      if (!ext.ok) {
        return reject(ext.issues ?? [{ code: "EXTERNAL_FAILED", severity: "ERROR", message: "Validation externe impossible" }], details, steps);
      }
      proposedDetails = ext.resolved;

      // Step 9: different?
      steps.push(Steps.S9_COMPARE_RECONFIRM);
      if (proposedDetails && !compareDetails(details, proposedDetails)) {
        // Dans ton schéma: si différent => Reject
        return reject([{ code: "DETAILS_MISMATCH", severity: "ERROR", message: "Détails bancaires incohérents après reconfirmation" }], details, steps);
      }
    }

    // Step 10: transposed?
    steps.push(Steps.S10_TRANSPOSED);
    const transposedDetected = proposedDetails ? detectTransposition(details, proposedDetails) : false;

    // Step 11: store transposed
    if (transposedDetected && proposedDetails && this.opts.store) {
      steps.push(Steps.S11_STORE_TRANSPOSED);
      await this.opts.store.storeTransposed({ original: details, resolved: proposedDetails });
    }

    // Step 12/13: form IBAN if needed (si entrée BBAN et pas d'IBAN)
    steps.push(Steps.S12_IBAN_NEEDS_FORMING);
    if (!details.iban && input.mode === "BBAN") {
      // Ici: idéalement via bankWizard. Sinon impossible de former pour tous pays sans règles complètes.
      if (this.opts.bankWizard) {
        steps.push(Steps.S13_FORM_IBAN);
        const ext = await this.opts.bankWizard.reconfirm({ bban: details.bban, bic: details.bic, country });
        if (ext.ok && ext.resolved?.iban) details.iban = ext.resolved.iban;
      }
    }

    // Step 14: present details
    steps.push(Steps.S14_PRESENT_DETAILS);

    // Si on arrive ici, on peut demander acceptation utilisateur
    if (needManual) {
      return {
        status: "NEEDS_CONFIRMATION",
        issues,
        details,
        proposedDetails: proposedDetails ?? details,
        meta: { steps, transposedDetected, externalResolved: Boolean(proposedDetails) },
      };
    }

    // Step 15: user acceptance se fait côté UI. Ici on retourne VALIDATED "pré-acceptation" si tu veux,
    // ou NEEDS_CONFIRMATION si tu veux toujours un "OK" utilisateur.
    return {
      status: "VALIDATED",
      issues,
      details,
      meta: { steps, transposedDetected, externalResolved: Boolean(proposedDetails) },
    };
  }
}
