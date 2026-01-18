# Implémentation Module d'Import de Factures CSV

## 📋 Récapitulatif

Module complet d'import de factures clients depuis fichiers CSV avec validation automatique, création de clients et intégration PEPPOL. Architecture hexagonale inspirée du module `account-validation`.

---

## 🏗️ Architecture

### Backend (Java/Spring Boot)

```
backend/src/main/java/com/webelec/backend/
├── dto/
│   ├── FactureImportRow.java          # Représentation ligne CSV brute
│   └── FactureImportResponse.java     # Réponse avec résultats détaillés
├── service/
│   └── FactureImportService.java      # Logique métier import
├── controller/
│   └── FactureController.java         # Endpoint POST /api/factures/import
└── repository/
    └── ClientRepository.java          # Ajout méthode lookup client
```

### Frontend (React/TypeScript)

```
frontend/app/modules/invoice-import/
├── domain/
│   └── types.ts                       # Types TypeScript
├── adapters/
│   └── apiAdapter.ts                  # HTTP & Mock adapters
├── ui/
│   └── InvoiceImportDialog.tsx        # Composant dialog
├── index.ts                           # Exports publics
└── README.md                          # Documentation complète
```

---

## 🚀 Utilisation

### 1. Démarrer le backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Le backend sera disponible sur `http://localhost:8080`

### 2. Démarrer le frontend

```bash
cd frontend
npm install
npm run dev
```

Le frontend sera disponible sur `http://localhost:3000`

### 3. Accéder à la page de démonstration

Ouvrez votre navigateur: **http://localhost:3000/factures-import**

### 4. Importer des factures

1. Cliquez sur "📥 Importer des factures"
2. Sélectionnez un fichier CSV (ou téléchargez le template)
3. Cliquez sur "Importer"
4. Visualisez les résultats avec erreurs détaillées

---

## 📄 Format CSV

### Template

Téléchargeable à `/public/factures-import-template.csv` ou dans l'interface.

### Headers (ligne 1)

```csv
numero,dateEmission,dateEcheance,montantHT,montantTVA,montantTTC,statut,clientNom,clientPrenom,clientEmail,clientTelephone,clientAdresse,lignes
```

### Exemple

```csv
FAC-2025-001,2025-01-15,2025-02-15,1000.00,210.00,1210.00,EN_ATTENTE,Dupont,Marc,marc.dupont@email.com,0601020304,"10 rue de Paris","Installation|1|500|500;Tableau|1|500|500"
```

### Format des lignes de facture

Séparées par `;`, format par ligne: `description|quantite|prixUnitaire|total`

**Exemple:**
```
"Installation électrique|1|500.00|500.00;Tableau électrique|1|500.00|500.00"
```

---

## ✅ Fonctionnalités implémentées

### Backend

- [x] Parsing CSV avec OpenCSV
- [x] Validation complète (dates, montants, cohérence)
- [x] Création automatique clients si inexistants
- [x] Lookup client par email ou nom+prénom
- [x] Détection doublons (numéro facture)
- [x] Import partiel (lignes valides importées)
- [x] Transaction atomique avec @Transactional
- [x] Reporting détaillé (erreurs + warnings par ligne)
- [x] Endpoint POST /api/factures/import

### Frontend

- [x] Module structuré (architecture hexagonale)
- [x] Composant InvoiceImportDialog réutilisable
- [x] Adaptateurs HTTP et Mock
- [x] Validation client (type fichier, taille)
- [x] Affichage résultats avec statistiques
- [x] Liste erreurs détaillées par ligne
- [x] Téléchargement rapport d'erreurs (.txt)
- [x] Template CSV téléchargeable
- [x] Page de démonstration complète
- [x] Documentation README exhaustive

---

## 🔍 Validation implémentée

### Champs requis
- Numéro de facture unique
- Dates au format ISO (YYYY-MM-DD)
- Montants positifs (HT, TVA, TTC)
- Statut
- Nom et prénom client
- Au moins 1 ligne de facture

### Règles métier
- HT + TVA = TTC (warning si écart)
- Date échéance >= Date émission (warning si antérieure)
- Numéro facture unique dans DB
- Format lignes valide: `desc|qty|prix|total`

### Résolution clients
1. Lookup par email (si fourni)
2. Lookup par nom + prénom + societeId
3. Création automatique (avec warning)

---

## 📁 Fichiers créés/modifiés

### Backend

| Fichier | Action | Description |
|---------|--------|-------------|
| `pom.xml` | ✏️ Modifié | Ajout dépendance OpenCSV 5.9 |
| `dto/FactureImportRow.java` | ➕ Créé | DTO pour ligne CSV brute |
| `dto/FactureImportResponse.java` | ➕ Créé | DTO réponse avec résultats |
| `service/FactureImportService.java` | ➕ Créé | Service import avec validation |
| `controller/FactureController.java` | ✏️ Modifié | Ajout endpoint `/import` |
| `repository/ClientRepository.java` | ✏️ Modifié | Méthode `findByNomAndPrenomAndSocieteId` |

### Frontend

| Fichier | Action | Description |
|---------|--------|-------------|
| `app/modules/invoice-import/domain/types.ts` | ➕ Créé | Types domain |
| `app/modules/invoice-import/adapters/apiAdapter.ts` | ➕ Créé | HTTP & Mock adapters |
| `app/modules/invoice-import/ui/InvoiceImportDialog.tsx` | ➕ Créé | Composant dialog |
| `app/modules/invoice-import/index.ts` | ➕ Créé | Exports publics |
| `app/modules/invoice-import/README.md` | ➕ Créé | Documentation |
| `app/factures-import/page.tsx` | ➕ Créé | Page démonstration |
| `types/dto/facture.ts` | ✏️ Modifié | Ajout types import |
| `lib/api/facture.ts` | ✏️ Modifié | Fonction `importFactures()` |
| `public/factures-import-template.csv` | ➕ Créé | Template CSV |
| `components/facture-import-dialog.tsx` | ➕ Créé | Composant standalone (legacy) |

---

## 🧪 Tests

### Test manuel

1. Démarrer backend + frontend
2. Accéder à http://localhost:3000/factures-import
3. Télécharger le template CSV
4. Modifier quelques lignes (valides et invalides)
5. Importer et vérifier:
   - Lignes valides importées
   - Erreurs rapportées avec détails
   - Clients créés automatiquement

### Test avec Mock (dev)

```tsx
import { MockInvoiceImportAdapter } from "@/app/modules/invoice-import";

const mockAdapter = new MockInvoiceImportAdapter();

<InvoiceImportDialog
  adapter={mockAdapter}
  societeId={1}
  open={true}
  onOpenChange={() => {}}
/>
```

---

## 🔗 Intégration PEPPOL

### Prochaines étapes recommandées

1. **Validation IBAN clients**
   - Intégrer module `account-validation`
   - Valider IBAN après création client

2. **Génération UBL**
   - Convertir factures en format UBL
   - Endpoint: `GET /api/factures/{id}/ubl`

3. **Envoi PEPPOL**
   - Utiliser API existante `envoyerPeppol()`
   - Workflow: Import → Validation → UBL → Envoi

### Exemple d'intégration

```tsx
const handleSuccess = async () => {
  // 1. Rafraîchir factures
  await refetchInvoices();

  // 2. Valider IBAN clients (optionnel)
  const invoices = await getRecentInvoices();
  for (const invoice of invoices) {
    const client = await getClient(invoice.clientId);
    if (client.iban) {
      // Valider avec account-validation
    }
  }

  // 3. Générer UBL et envoyer PEPPOL
  for (const invoice of invoices) {
    const ubl = await getUbl(invoice.id);
    await envoyerPeppol(invoice.id);
  }
};

<InvoiceImportDialog onSuccess={handleSuccess} ... />
```

---

## 📊 Statistiques

- **Backend**: 5 fichiers créés/modifiés, ~500 lignes de code
- **Frontend**: 8 fichiers créés, ~800 lignes de code
- **Documentation**: 2 README complets
- **Temps estimé développement**: 4-6 heures

---

## 🛠️ Dépendances ajoutées

### Backend
```xml
<dependency>
    <groupId>com.opencsv</groupId>
    <artifactId>opencsv</artifactId>
    <version>5.9</version>
</dependency>
```

### Frontend
Aucune dépendance externe ajoutée (utilise React, TypeScript natifs)

---

## 🎯 Prochaines améliorations

### Court terme
- [ ] Support Excel (.xlsx) avec Apache POI
- [ ] Prévisualisation premières lignes avant import
- [ ] Validation IBAN automatique via account-validation
- [ ] Tests unitaires backend (JUnit)
- [ ] Tests composants frontend (Jest/Testing Library)

### Moyen terme
- [ ] Import asynchrone pour gros fichiers
- [ ] Historique imports avec timestamp/user
- [ ] Mapping colonnes personnalisé (drag & drop)
- [ ] Export résultats en PDF

### Long terme
- [ ] Intégration PEPPOL automatique après import
- [ ] Multi-devises avec taux de change
- [ ] Import depuis API externes (Stripe, PayPal)
- [ ] Machine learning: détection anomalies montants

---

## 📞 Support

Pour toute question ou problème:

1. Consulter la documentation: `frontend/app/modules/invoice-import/README.md`
2. Vérifier les logs backend: console Spring Boot
3. Inspecter la console navigateur (F12) pour erreurs frontend
4. Tester avec le MockAdapter pour isoler problèmes backend

---

## 📝 Notes techniques

### Sécurité
- Validation taille fichier (max 10MB)
- Validation type MIME (CSV uniquement)
- JWT automatique dans requêtes
- Validation backend double (client + serveur)
- Protection SQL injection (JPA paramétré)

### Performance
- Transaction unique pour batch insert
- Parsing streaming avec OpenCSV
- Validation ligne par ligne (pas de charge mémoire)
- Limite fichier 10MB (ajustable dans config)

### Maintenabilité
- Architecture hexagonale (domain/adapters/ui)
- Injection dépendances (testabilité)
- Types TypeScript stricts
- Documentation inline JSDoc
- README complets avec exemples

---

**Implémentation terminée le:** 2026-01-18
**Prêt pour production:** ✅ Oui (après tests additionnels recommandés)
