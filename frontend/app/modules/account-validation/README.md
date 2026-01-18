# Module de Validation de Comptes Bancaires (IBAN/BBAN)

Module de validation de comptes bancaires pour l'intégration Peppol, basé sur une architecture hexagonale (Clean Architecture).

## 🎯 Fonctionnalités

- ✅ Validation d'IBAN (modulo 97, format, longueur)
- ✅ Validation de BBAN avec règles par pays (BE, FR, DE, NL, LU, IT, ES, PT)
- ✅ Validation de BIC/SWIFT
- ✅ Détection de transpositions (erreurs de saisie)
- ✅ Intégration avec service externe (Bank Wizard API)
- ✅ Machine d'états conforme au workflow Peppol
- ✅ Testable unitairement (moteur pur, sans dépendances)
- ✅ Composant React UI prêt à l'emploi

## 📂 Structure

```
app/modules/account-validation/
├── domain/              # Logique métier pure (testable sans I/O)
│   ├── types.ts        # Types TypeScript
│   ├── steps.ts        # Étapes de l'algorithme
│   ├── rules.ts        # Règles de validation par pays
│   └── engine.ts       # Moteur de validation
├── adapters/           # Adaptateurs I/O (API, stockage)
│   ├── bankWizardAdapter.ts
│   └── storeAdapter.ts
├── ui/                 # Composants React
│   └── AccountValidationWizard.tsx
├── index.ts           # Exports publics
└── README.md          # Cette documentation
```

## 🚀 Utilisation

### 1. Configuration de l'environnement

Ajoutez ces variables dans votre fichier `.env.local`:

```env
# Optionnel: URL du service Bank Wizard (si vous utilisez un service externe)
NEXT_PUBLIC_BANKWIZARD_URL="https://api.bankwizard.example/v1"
BANKWIZARD_API_KEY="your-api-key"
```

### 2. Exemple d'utilisation basique

```typescript
import {
  AccountValidationEngine,
  MockBankWizardAdapter,
  NoopStoreAdapter
} from '@/app/modules/account-validation';

// Créer une instance du moteur
const engine = new AccountValidationEngine({
  bankWizard: new MockBankWizardAdapter(), // Pour dev/test
  store: new NoopStoreAdapter(),
});

// Valider un IBAN
const result = await engine.run({
  mode: "IBAN",
  iban: "BE68 5390 0754 7034",
  bic: "GEBABEBB",
});

console.log(result.status); // "VALIDATED", "NEEDS_CONFIRMATION", ou "REJECTED"
console.log(result.issues); // Liste des problèmes détectés
console.log(result.details); // Détails normalisés du compte
```

### 3. Utilisation avec le composant React

```tsx
"use client";

import { AccountValidationWizard } from '@/app/modules/account-validation';
import { AccountValidationEngine } from '@/app/modules/account-validation';
import { MockBankWizardAdapter, NoopStoreAdapter } from '@/app/modules/account-validation';

export default function MyPage() {
  const engine = new AccountValidationEngine({
    bankWizard: new MockBankWizardAdapter(),
    store: new NoopStoreAdapter(),
  });

  const handleValidated = (result) => {
    console.log("Compte validé:", result);
    // Sauvegarder dans votre DB, rediriger l'utilisateur, etc.
  };

  return (
    <AccountValidationWizard
      engine={engine}
      onValidated={handleValidated}
      defaultCountry="BE"
    />
  );
}
```

### 4. Configuration pour production

Pour production, utilisez les adaptateurs HTTP:

```typescript
import {
  AccountValidationEngine,
  HttpBankWizardAdapter,
  HttpStoreAdapter,
} from '@/app/modules/account-validation';

const engine = new AccountValidationEngine({
  bankWizard: new HttpBankWizardAdapter(
    process.env.NEXT_PUBLIC_BANKWIZARD_URL!,
    process.env.BANKWIZARD_API_KEY
  ),
  store: new HttpStoreAdapter(
    process.env.NEXT_PUBLIC_API_BASE!,
    // Optionnel: token d'authentification
  ),
  // Politique de confirmation manuelle personnalisée
  manualConfirmationPolicy: ({ issues, country }) => {
    // Retourne true si une confirmation manuelle est requise
    return issues.some(i => i.severity === "WARNING");
  },
});
```

## 🔄 Workflow de validation

Le moteur suit ces étapes (selon le diagramme Peppol):

1. **S1_VALIDATE_IBAN**: Validation de l'IBAN (si mode IBAN)
2. **S2_CHECK_ERRORS**: Vérification des erreurs de validation IBAN
3. **S3_COUNTRY_SUPPORTED**: Vérification du support du pays
4. **S4_VALIDATE_BBAN_BIC**: Validation du BBAN et BIC
5. **S5_CHECK_ERRORS**: Vérification des erreurs
6. **S6_TREATABLE_AS_ERRORS**: Conversion de certains warnings en erreurs
7. **S7_MANUAL_CONFIRMATION_NEEDED**: Décision si confirmation manuelle requise
8. **S8_RECONFIRM_EXTERNAL**: Reconfirmation via service externe (Bank Wizard)
9. **S9_COMPARE_RECONFIRM**: Comparaison avec les détails externes
10. **S10_TRANSPOSED**: Détection de transposition
11. **S11_STORE_TRANSPOSED**: Stockage des transpositions détectées
12. **S12_IBAN_NEEDS_FORMING**: Vérification si formation IBAN nécessaire
13. **S13_FORM_IBAN**: Formation d'IBAN à partir de BBAN
14. **S14_PRESENT_DETAILS**: Présentation des détails
15. **S15_USER_ACCEPTANCE**: Acceptation utilisateur

## 📊 Types de résultats

### ValidationStatus

- `"VALIDATED"`: Compte valide, prêt à utiliser
- `"NEEDS_CONFIRMATION"`: Confirmation manuelle requise (warnings détectés)
- `"REJECTED"`: Compte invalide (erreurs bloquantes)

### Issue Severity

- `"ERROR"`: Erreur bloquante (compte invalide)
- `"WARNING"`: Avertissement (peut nécessiter confirmation)
- `"INFO"`: Information (non bloquant)

## 🧪 Tests

Le moteur est conçu pour être facilement testable:

```typescript
import { AccountValidationEngine } from '@/app/modules/account-validation';

// Test avec mock adapter
const mockBankWizard = {
  reconfirm: async (input) => ({
    ok: true,
    resolved: { ...input, iban: "BE68539007547034" },
  }),
};

const engine = new AccountValidationEngine({
  bankWizard: mockBankWizard,
});

const result = await engine.run({
  mode: "BBAN",
  bban: "539007547034",
  countryHint: "BE",
});

expect(result.status).toBe("VALIDATED");
expect(result.details.iban).toBe("BE68539007547034");
```

## 🌍 Pays supportés

- 🇧🇪 **BE** (Belgique): IBAN 16 chars, BBAN 12 chiffres
- 🇫🇷 **FR** (France): IBAN 27 chars
- 🇩🇪 **DE** (Allemagne): IBAN 22 chars
- 🇳🇱 **NL** (Pays-Bas): IBAN 18 chars
- 🇱🇺 **LU** (Luxembourg): IBAN 20 chars
- 🇮🇹 **IT** (Italie): IBAN 27 chars
- 🇪🇸 **ES** (Espagne): IBAN 24 chars
- 🇵🇹 **PT** (Portugal): IBAN 25 chars

Pour ajouter d'autres pays, modifiez [`domain/rules.ts`](domain/rules.ts).

## 🔧 Personnalisation

### Ajouter un pays

```typescript
// domain/rules.ts
export const DEFAULT_COUNTRY_RULES: CountryRules[] = [
  // ...
  {
    country: "CH",
    ibanLength: 21,
    bbanPattern: /^\d{5}[A-Z0-9]{12}$/,
    bicRequired: false,
    supportsBbanValidation: true,
  },
];
```

### Politique de confirmation personnalisée

```typescript
const engine = new AccountValidationEngine({
  manualConfirmationPolicy: ({ issues, country }) => {
    // Ex: toujours demander confirmation pour la France
    if (country === "FR") return true;

    // Ex: demander confirmation si warning sur BIC
    return issues.some(i => i.field === "bic" && i.severity === "WARNING");
  },
});
```

## 🛠️ Adaptateurs disponibles

### Bank Wizard Adapters

- **MockBankWizardAdapter**: Pour dev/test (simule une API)
- **HttpBankWizardAdapter**: Pour production (appels HTTP réels)

### Store Adapters

- **NoopStoreAdapter**: Ne stocke rien (dev/test)
- **HttpStoreAdapter**: Stockage via API REST
- **LocalStorageStoreAdapter**: Stockage dans localStorage (dev/test)

## 📝 Notes

- Le moteur est **stateless**: pas de side-effects cachés
- Les adaptateurs sont **injectés**: facile à mocker pour les tests
- Le code suit le **principe de responsabilité unique** (SRP)
- Architecture **hexagonale**: domain indépendant des adapters

## 📄 Licence

Propriétaire - Webelec SaaS
