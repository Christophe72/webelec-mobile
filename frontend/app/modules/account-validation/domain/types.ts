// modules/account-validation/domain/types.ts

export type InputMode = "IBAN" | "BBAN";

export interface AccountInput {
  mode: InputMode;
  iban?: string; // required if mode=IBAN
  bban?: string; // required if mode=BBAN
  bic?: string;  // optional by country/business rules
  countryHint?: string; // optional (if user selected country)
}

export type ValidationStatus =
  | "REJECTED"
  | "NEEDS_CONFIRMATION"
  | "VALIDATED";

export type IssueSeverity = "ERROR" | "WARNING" | "INFO";

export interface Issue {
  code: string;           // stable code for UI + analytics
  severity: IssueSeverity;
  message: string;        // user-friendly
  field?: "iban" | "bban" | "bic" | "country";
}

export interface NormalizedAccountDetails {
  country?: string;
  iban?: string;
  bban?: string;
  bic?: string;
}

export interface ValidationResult {
  status: ValidationStatus;
  issues: Issue[];
  details: NormalizedAccountDetails;        // what to display
  proposedDetails?: NormalizedAccountDetails; // if confirmation needed
  meta: {
    steps: string[];       // executed steps (audit)
    transposedDetected?: boolean;
    externalResolved?: boolean;
  };
}
