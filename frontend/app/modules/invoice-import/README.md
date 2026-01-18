# Module d'Import de Factures CSV

Module d'import de factures clients depuis des fichiers CSV avec validation automatique, création de clients et gestion d'erreurs détaillée. Conçu pour l'intégration PEPPOL avec une architecture hexagonale (Clean Architecture).

## 🎯 Fonctionnalités

- ✅ Import de factures depuis fichiers CSV
- ✅ Validation complète des données (dates, montants, cohérence HT+TVA=TTC)
- ✅ Création automatique des clients si inexistants
- ✅ Détection de doublons (numéro de facture)
- ✅ Support de lignes multiples par facture (format séparé par `;`)
- ✅ Import partiel (importe les lignes valides, rapporte les erreurs)
- ✅ Reporting détaillé avec warnings et erreurs par ligne
- ✅ Téléchargement de rapport d'erreurs
- ✅ Template CSV téléchargeable
- ✅ Architecture testable (adapters injectables)

## 📂 Structure

```
app/modules/invoice-import/
├── domain/              # Logique métier pure
│   └── types.ts        # Types TypeScript
├── adapters/           # Adaptateurs I/O (API, mocks)
│   └── apiAdapter.ts   # HTTP et Mock adapters
├── ui/                 # Composants React
│   └── InvoiceImportDialog.tsx
├── index.ts           # Exports publics
└── README.md          # Cette documentation
```

## 🚀 Utilisation

### 1. Import basique

```tsx
"use client";

import {
  InvoiceImportDialog,
  HttpInvoiceImportAdapter,
} from "@/app/modules/invoice-import";
import { useState } from "react";

export default function InvoicesPage() {
  const [importOpen, setImportOpen] = useState(false);
  const adapter = new HttpInvoiceImportAdapter();

  const handleSuccess = () => {
    console.log("Import réussi!");
    // Rafraîchir la liste des factures
  };

  return (
    <div>
      <button onClick={() => setImportOpen(true)}>
        Importer des factures
      </button>

      <InvoiceImportDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        societeId={1}
        adapter={adapter}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
```

### 2. Configuration personnalisée

```tsx
import {
  InvoiceImportDialog,
  HttpInvoiceImportAdapter,
  InvoiceImportConfig,
} from "@/app/modules/invoice-import";

const customConfig: Partial<InvoiceImportConfig> = {
  maxFileSize: 20 * 1024 * 1024, // 20MB au lieu de 10MB
  allowedFileTypes: [".csv", ".txt"],
  autoCreateClients: false, // Ne pas créer de clients automatiquement
};

<InvoiceImportDialog
  adapter={new HttpInvoiceImportAdapter()}
  societeId={societeId}
  config={customConfig}
  // ... autres props
/>
```

### 3. Utilisation en développement (Mock)

```tsx
import {
  InvoiceImportDialog,
  MockInvoiceImportAdapter,
} from "@/app/modules/invoice-import";

// L'adaptateur mock simule une réponse sans appeler le backend
const mockAdapter = new MockInvoiceImportAdapter();

<InvoiceImportDialog
  adapter={mockAdapter}
  societeId={1}
  // ... autres props
/>
```

### 4. Utilisation programmatique (sans UI)

```tsx
import { HttpInvoiceImportAdapter } from "@/app/modules/invoice-import";

const adapter = new HttpInvoiceImportAdapter();

const handleFileUpload = async (file: File) => {
  try {
    const result = await adapter.import({
      file,
      societeId: 1,
    });

    console.log(`Import terminé: ${result.successCount}/${result.totalRows} réussies`);
    console.log("Erreurs:", result.results.filter(r => !r.success));
  } catch (error) {
    console.error("Erreur import:", error);
  }
};
```

## 📄 Format CSV

### Headers (première ligne obligatoire)

```csv
numero,dateEmission,dateEcheance,montantHT,montantTVA,montantTTC,statut,clientNom,clientPrenom,clientEmail,clientTelephone,clientAdresse,lignes
```

### Colonnes

| Colonne | Type | Requis | Description | Exemple |
|---------|------|--------|-------------|---------|
| `numero` | String | ✅ | Numéro unique de facture | `FAC-2025-001` |
| `dateEmission` | Date ISO | ✅ | Date d'émission (YYYY-MM-DD) | `2025-01-15` |
| `dateEcheance` | Date ISO | ✅ | Date d'échéance (YYYY-MM-DD) | `2025-02-15` |
| `montantHT` | Decimal | ✅ | Montant HT (2 décimales) | `1000.00` |
| `montantTVA` | Decimal | ✅ | Montant TVA (2 décimales) | `210.00` |
| `montantTTC` | Decimal | ✅ | Montant TTC (2 décimales) | `1210.00` |
| `statut` | String | ✅ | Statut de la facture | `EN_ATTENTE`, `PAYEE` |
| `clientNom` | String | ✅ | Nom du client | `Dupont` |
| `clientPrenom` | String | ✅ | Prénom du client | `Marc` |
| `clientEmail` | String | ❌ | Email (pour lookup) | `marc@email.com` |
| `clientTelephone` | String | ❌ | Téléphone | `0601020304` |
| `clientAdresse` | String | ❌ | Adresse | `10 rue de Paris` |
| `lignes` | String | ✅ | Lignes de facture (format spécial) | Voir ci-dessous |

### Format des lignes de facture

Les lignes sont séparées par `;` et chaque ligne a le format: `description|quantite|prixUnitaire|total`

**Exemple:**
```
"Installation électrique|1|500.00|500.00;Tableau électrique|1|500.00|500.00"
```

**Décomposition:**
- Ligne 1: `Installation électrique` | quantité `1` | prix unitaire `500.00` | total `500.00`
- Ligne 2: `Tableau électrique` | quantité `1` | prix unitaire `500.00` | total `500.00`

### Exemple complet

```csv
numero,dateEmission,dateEcheance,montantHT,montantTVA,montantTTC,statut,clientNom,clientPrenom,clientEmail,clientTelephone,clientAdresse,lignes
FAC-2025-001,2025-01-15,2025-02-15,1000.00,210.00,1210.00,EN_ATTENTE,Dupont,Marc,marc.dupont@email.com,0601020304,"10 rue de Paris, 75001 Paris","Installation électrique|1|500.00|500.00;Tableau électrique|1|500.00|500.00"
FAC-2025-002,2025-01-16,2025-02-16,2500.00,525.00,3025.00,EN_ATTENTE,Martin,Sophie,sophie.martin@email.com,0602030405,"25 avenue des Champs, 75008 Paris","Borne de recharge|2|800.00|1600.00;Installation|1|400.00|400.00;Câblage|1|500.00|500.00"
```

**Template téléchargeable:** Disponible dans l'UI à `/factures-import-template.csv`

## 🔄 Workflow d'import

1. **Sélection fichier**: L'utilisateur sélectionne un fichier CSV
2. **Validation client**: Vérification du type et de la taille du fichier
3. **Upload**: Envoi au backend via FormData
4. **Parsing CSV**: Backend parse le CSV avec OpenCSV
5. **Validation ligne par ligne**:
   - Champs requis présents
   - Dates au format ISO valides
   - Montants positifs et cohérents (HT + TVA = TTC)
   - Numéro de facture unique
   - Format lignes valide
6. **Résolution clients**:
   - Lookup par email (si fourni)
   - Sinon lookup par nom+prénom+societeId
   - Sinon création automatique (si `autoCreateClients = true`)
7. **Insert batch**: Toutes les lignes valides insérées en transaction
8. **Reporting**: Résultats détaillés avec erreurs et warnings par ligne

## 📊 Types de résultats

### ImportStatus

- `COMPLETE_SUCCESS`: Toutes les factures importées avec succès
- `PARTIAL_SUCCESS`: Certaines factures importées, d'autres en échec
- `COMPLETE_FAILURE`: Toutes les factures en échec

### Erreurs vs Warnings

**Erreurs (bloquantes):**
- Champs obligatoires manquants
- Format de date invalide
- Montants négatifs ou invalides
- Numéro de facture déjà existant
- Format de lignes invalide

**Warnings (non-bloquants):**
- Nouveau client créé automatiquement
- Client existant trouvé par email
- Incohérence montants (HT + TVA ≠ TTC)
- Date d'échéance antérieure à la date d'émission

## 🧪 Tests

Le module est conçu pour être facilement testable avec des adapters injectables.

### Test avec mock adapter

```tsx
import {
  InvoiceImportDialog,
  MockInvoiceImportAdapter,
} from "@/app/modules/invoice-import";
import { render, screen, fireEvent } from "@testing-library/react";

test("should display import dialog", () => {
  const mockAdapter = new MockInvoiceImportAdapter();

  render(
    <InvoiceImportDialog
      open={true}
      onOpenChange={() => {}}
      societeId={1}
      adapter={mockAdapter}
    />
  );

  expect(screen.getByText(/Import de factures CSV/i)).toBeInTheDocument();
});
```

### Test avec custom mock adapter

```tsx
import { IInvoiceImportAdapter } from "@/app/modules/invoice-import";

class CustomMockAdapter implements IInvoiceImportAdapter {
  async import() {
    return {
      totalRows: 5,
      successCount: 5,
      errorCount: 0,
      results: [],
      status: "COMPLETE_SUCCESS",
      message: "Toutes les factures importées",
    };
  }
}

const customAdapter = new CustomMockAdapter();
// Utiliser dans les tests...
```

## 🔧 Configuration

### Configuration par défaut

```typescript
export const DEFAULT_IMPORT_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFileTypes: ['.csv'],
  autoCreateClients: true,
};
```

### Personnalisation

Passez une configuration partielle via la prop `config`:

```tsx
<InvoiceImportDialog
  config={{
    maxFileSize: 5 * 1024 * 1024, // 5MB
    autoCreateClients: false,
  }}
  // ... autres props
/>
```

## 🛠️ Adaptateurs disponibles

### API Adapters

- **HttpInvoiceImportAdapter**: Pour production (appels HTTP réels au backend)
- **MockInvoiceImportAdapter**: Pour dev/test (simule une réponse)

### Créer un adaptateur personnalisé

```typescript
import { IInvoiceImportAdapter, InvoiceImportRequest, InvoiceImportResponse } from "@/app/modules/invoice-import";

export class CustomAdapter implements IInvoiceImportAdapter {
  async import(request: InvoiceImportRequest): Promise<InvoiceImportResponse> {
    // Votre logique personnalisée
    const response = await fetch("...", { ... });
    return await response.json();
  }
}
```

## 🔗 Intégration avec PEPPOL

Ce module est conçu pour s'intégrer avec le système PEPPOL:

1. **Validation IBAN clients**: Intégrer avec le module `account-validation`
2. **Envoi PEPPOL automatique**: Après import réussi, déclencher l'envoi via PEPPOL
3. **Génération UBL**: Convertir les factures en format UBL pour PEPPOL

**Exemple d'intégration:**

```tsx
const handleSuccess = async () => {
  // Rafraîchir les factures
  await refetchInvoices();

  // Optionnel: déclencher validation IBAN + envoi PEPPOL
  const invoices = await getRecentInvoices();
  for (const invoice of invoices) {
    // Valider IBAN client
    // Générer UBL
    // Envoyer via PEPPOL
  }
};

<InvoiceImportDialog onSuccess={handleSuccess} ... />
```

## 📝 Notes techniques

- **Architecture hexagonale**: Domain indépendant des adapters
- **Stateless**: Pas de side-effects cachés
- **Injection de dépendances**: Adapters injectés pour testabilité
- **Transaction atomique**: Backend utilise `@Transactional` pour garantir la cohérence
- **Validation backend**: Double validation (client + serveur)
- **FormData multipart**: Upload sécurisé avec JWT automatique

## 🚀 Évolutions futures

- [ ] Support Excel (.xlsx, .xls) avec Apache POI
- [ ] Prévisualisation des 5 premières lignes avant import
- [ ] Import asynchrone pour gros fichiers (queue + notification)
- [ ] Historique des imports avec timestamp, user, résultats
- [ ] Mapping colonnes personnalisé (UI drag & drop)
- [ ] Export des résultats d'import en PDF
- [ ] Intégration directe PEPPOL: envoi automatique après import
- [ ] Validation IBAN automatique via module account-validation

## 📄 Licence

Propriétaire - Webelec SaaS
