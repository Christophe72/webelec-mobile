// modules/account-validation/domain/rules.ts

export interface CountryRules {
  country: string; // "BE", "FR", ...
  ibanLength: number;
  bbanPattern?: RegExp;
  bicRequired?: boolean;
  supportsBbanValidation: boolean;
}

export const DEFAULT_COUNTRY_RULES: CountryRules[] = [
  {
    country: "BE",
    ibanLength: 16,
    bbanPattern: /^\d{12}$/,
    bicRequired: false,
    supportsBbanValidation: true
  },
  {
    country: "FR",
    ibanLength: 27,
    bbanPattern: /^\d{10}[A-Z0-9]{11}\d{2}$/,
    bicRequired: false,
    supportsBbanValidation: true
  },
  {
    country: "DE",
    ibanLength: 22,
    bbanPattern: /^\d{18}$/,
    bicRequired: false,
    supportsBbanValidation: true
  },
  {
    country: "NL",
    ibanLength: 18,
    bbanPattern: /^[A-Z]{4}\d{10}$/,
    bicRequired: false,
    supportsBbanValidation: true
  },
  {
    country: "LU",
    ibanLength: 20,
    bbanPattern: /^\d{3}[A-Z0-9]{13}$/,
    bicRequired: false,
    supportsBbanValidation: true
  },
  {
    country: "IT",
    ibanLength: 27,
    bbanPattern: /^[A-Z]\d{10}[A-Z0-9]{12}$/,
    bicRequired: false,
    supportsBbanValidation: true
  },
  {
    country: "ES",
    ibanLength: 24,
    bbanPattern: /^\d{20}$/,
    bicRequired: false,
    supportsBbanValidation: true
  },
  {
    country: "PT",
    ibanLength: 25,
    bbanPattern: /^\d{21}$/,
    bicRequired: false,
    supportsBbanValidation: true
  },
];

export function getRules(country: string): CountryRules | undefined {
  return DEFAULT_COUNTRY_RULES.find((r) => r.country === country);
}
