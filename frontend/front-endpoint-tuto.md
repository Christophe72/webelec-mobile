# Documentation API Webelec-SaaS

## Vue d'ensemble

**Framework:** Spring Boot 3.5.8 (Java 21)
**Base URL:** `/api`
**Authentification:** JWT (access token + refresh token)
**Date de documentation:** 2026-02-04

Cette API fournit un système complet de gestion pour entreprises d'électricité avec support multi-sociétés, gestion de projets, facturation et intégration Peppol.

---

## 📋 Table des matières

1. [Authentification](#authentification)
2. [Utilisateurs](#utilisateurs)
3. [Sociétés](#sociétés)
4. [Clients](#clients)
5. [Chantiers](#chantiers)
6. [Interventions](#interventions)
7. [Devis](#devis)
8. [Factures](#factures)
9. [Produits](#produits)
10. [Produits Avancés](#produits-avancés)
11. [Pièces Justificatives](#pièces-justificatives)
12. [Sécurité](#sécurité)
13. [Gestion des erreurs](#gestion-des-erreurs)

---

## 🔐 Authentification

**Base Path:** `/api/auth`

### Endpoints disponibles

| Méthode | Endpoint | Description | Auth requise |
|---------|----------|-------------|--------------|
| POST | `/login` | Connexion utilisateur | ❌ Non |
| POST | `/register` | Inscription utilisateur | ❌ Non |
| POST | `/refresh` | Rafraîchir le token | ❌ Non |
| GET | `/me` | Profil utilisateur connecté | ✅ Oui |

### POST `/api/auth/login`

**Requête:**
```json
{
  "email": "user@example.com",
  "motDePasse": "password123"
}
```

**Réponse:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1...",
  "refreshToken": "eyJhbGciOiJIUzI1...",
  "utilisateur": {
    "id": 1,
    "nom": "Dupont",
    "prenom": "Jean",
    "email": "user@example.com",
    "societes": [...]
  }
}
```

**Utilisation Frontend:**
- Stocker le `accessToken` en localStorage/sessionStorage ou cookie
- Utiliser le `refreshToken` pour renouveler l'accès quand le token expire
- Rediriger vers le dashboard après login réussi

### POST `/api/auth/register`

**Requête:**
```json
{
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "user@example.com",
  "motDePasse": "password123",
  "role": "USER",
  "societeId": 1
}
```

**Validation:**
- `motDePasse`: minimum 6 caractères
- `email`: format email valide
- Tous les champs sont requis

**Utilisation Frontend:**
- Formulaire d'inscription avec validation
- Connexion automatique après inscription réussie

### POST `/api/auth/refresh`

**Requête:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1..."
}
```

**Utilisation Frontend:**
- Appeler automatiquement quand le `accessToken` expire (401)
- Implémenter un interceptor HTTP pour gérer le refresh automatique

### GET `/api/auth/me`

**Réponse:**
```json
{
  "id": 1,
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "user@example.com",
  "societes": [...]
}
```

**Utilisation Frontend:**
- Charger les infos utilisateur au démarrage de l'app
- Afficher le profil utilisateur
- Vérifier les permissions/rôles

---

## 👥 Utilisateurs

**Base Path:** `/api/utilisateurs`
**CORS:** Activé

### Endpoints disponibles

| Méthode | Endpoint | Description | Auth requise |
|---------|----------|-------------|--------------|
| GET | `/` | Liste tous les utilisateurs | ✅ Oui |
| GET | `/{id}` | Détails d'un utilisateur | ✅ Oui |
| GET | `/societe/{societeId}` | Utilisateurs par société | ✅ Oui |
| POST | `/` | Créer un utilisateur | ✅ Oui |
| PUT | `/{id}` | Modifier un utilisateur | ✅ Oui |
| DELETE | `/{id}` | Supprimer un utilisateur | ✅ Oui (ADMIN) |

### Structure des données

**UtilisateurRequest:**
```json
{
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "user@example.com",
  "motDePasse": "password123",
  "role": "USER",
  "societeId": 1
}
```

**UtilisateurResponse:**
```json
{
  "id": 1,
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "user@example.com",
  "societes": [
    {
      "id": 1,
      "nom": "Société Exemple"
    }
  ]
}
```

**Utilisation Frontend:**
- **Liste utilisateurs:** Tableau de bord d'administration, gestion d'équipe
- **Par société:** Filtrer les utilisateurs par entreprise
- **CRUD:** Interface de gestion des utilisateurs (admin)
- **Sélection:** Dropdown pour assigner des interventions

---

## 🏢 Sociétés

**Base Path:** `/api/societes`

### Endpoints disponibles

| Méthode | Endpoint | Description | Permissions |
|---------|----------|-------------|-------------|
| GET | `/` | Liste sociétés | Admin voit tout, autres voient leurs sociétés |
| GET | `/{id}` | Détails société | Membre de la société ou Admin |
| POST | `/` | Créer société | Admin uniquement |
| PUT | `/{id}` | Modifier société | Admin ou Gérant |
| DELETE | `/{id}` | Supprimer société | Admin uniquement |

### Structure des données

**SocieteRequest:**
```json
{
  "nom": "Électricité Martin SARL",
  "tva": "BE0123456789",
  "email": "contact@martin-elec.be",
  "telephone": "+32 2 123 45 67",
  "adresse": "Rue de la Gare 10",
  "adresseLigne1": "Bâtiment A",
  "adresseLigne2": "2ème étage",
  "codePostal": "1000",
  "ville": "Bruxelles",
  "paysCode": "BE",
  "peppolEndpointId": "0123:456789",
  "peppolEndpointScheme": "BE:VAT",
  "identifiantLegal": "BE0123456789",
  "identifiantLegalScheme": "BE:VAT",
  "iban": "BE68539007547034",
  "bic": "GKCCBEBB",
  "compteNom": "Électricité Martin SARL"
}
```

**Utilisation Frontend:**
- **Sélecteur de société:** Menu déroulant pour changer de contexte
- **Page de profil:** Afficher et modifier les infos de la société
- **Configuration Peppol:** Formulaire pour configurer l'intégration Peppol
- **Données bancaires:** Section sécurisée pour IBAN/BIC

---

## 👨‍💼 Clients

**Base Path:** `/api/clients`

### Endpoints disponibles

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/` | Liste tous les clients |
| GET | `/{id}` | Détails d'un client |
| POST | `/` | Créer un client |
| PUT | `/{id}` | Modifier un client |
| DELETE | `/{id}` | Supprimer un client |

### Structure des données

**ClientRequest:**
```json
{
  "nom": "Construction SA",
  "prenom": "Pierre",
  "email": "pierre@construction-sa.be",
  "tva": "BE0987654321",
  "telephone": "+32 2 987 65 43",
  "adresse": "Avenue du Commerce 25",
  "adresseLigne1": "Zone industrielle",
  "adresseLigne2": "",
  "codePostal": "1050",
  "ville": "Ixelles",
  "paysCode": "BE",
  "peppolEndpointId": "0987:654321",
  "peppolEndpointScheme": "BE:VAT",
  "identifiantLegal": "BE0987654321",
  "identifiantLegalScheme": "BE:VAT",
  "societeId": 1
}
```

**Utilisation Frontend:**
- **Carnet d'adresses:** Liste complète avec recherche et filtres
- **Formulaire client:** Création/édition avec validation
- **Sélection rapide:** Autocomplete pour choisir un client dans devis/factures
- **Fiche client:** Vue détaillée avec historique (chantiers, factures)
- **Export:** Possibilité d'exporter la liste clients (CSV, PDF)

---

## 🏗️ Chantiers

**Base Path:** `/api/chantiers`
**CORS:** Activé

### Endpoints disponibles

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/` | Liste tous les chantiers |
| GET | `/societe/{societeId}` | Chantiers par société |
| GET | `/{id}` | Détails d'un chantier |
| POST | `/` | Créer un chantier |
| PUT | `/{id}` | Modifier un chantier |
| DELETE | `/{id}` | Supprimer un chantier |

### Structure des données

**ChantierRequest:**
```json
{
  "nom": "Rénovation électrique Immeuble Léopold",
  "adresse": "Boulevard Léopold II, 44, 1080 Bruxelles",
  "description": "Installation complète système électrique 15 appartements",
  "societeId": 1,
  "clientId": 5
}
```

**ChantierResponse:**
```json
{
  "id": 10,
  "nom": "Rénovation électrique Immeuble Léopold",
  "adresse": "Boulevard Léopold II, 44, 1080 Bruxelles",
  "description": "Installation complète système électrique 15 appartements",
  "societe": {
    "id": 1,
    "nom": "Électricité Martin SARL"
  },
  "client": {
    "id": 5,
    "nom": "Construction SA",
    "prenom": "Pierre"
  }
}
```

**Utilisation Frontend:**
- **Dashboard chantiers:** Vue kanban ou liste avec statuts
- **Carte interactive:** Afficher les chantiers sur une carte (Google Maps, Leaflet)
- **Planning:** Calendrier des chantiers
- **Détails chantier:**
  - Informations générales
  - Liste des interventions
  - Documents associés
  - Suivi budgétaire
- **Filtres:** Par client, par société, par période

---

## 🔧 Interventions

**Base Path:** `/api/interventions`
**CORS:** Activé

### Endpoints disponibles

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/` | Liste toutes les interventions |
| GET | `/societe/{societeId}` | Interventions par société |
| GET | `/chantier/{chantierId}` | Interventions par chantier |
| GET | `/{id}` | Détails d'une intervention |
| POST | `/` | Créer une intervention |
| PUT | `/{id}` | Modifier une intervention |
| DELETE | `/{id}` | Supprimer une intervention |

### Structure des données

**InterventionRequest:**
```json
{
  "titre": "Installation tableau électrique principal",
  "description": "Mise en place du tableau électrique principal avec disjoncteurs différentiels et parafoudre. Installation de 3 circuits prises, 2 circuits lumière.",
  "dateIntervention": "2026-02-15",
  "societeId": 1,
  "chantierId": 10,
  "clientId": 5,
  "utilisateurId": 3
}
```

**Validation:**
- `titre`: max 255 caractères, requis
- `description`: max 1024 caractères
- `dateIntervention`: format LocalDate (YYYY-MM-DD)

**Utilisation Frontend:**
- **Planning technicien:** Vue calendrier des interventions par utilisateur
- **Journal de bord:** Historique des interventions par chantier
- **Formulaire mobile:** Interface simplifiée pour créer une intervention sur le terrain
- **Upload photos:** Lier des pièces justificatives (photos avant/après)
- **Rapport d'intervention:** Générer un PDF récapitulatif
- **Filtres:** Par date, technicien, chantier, client

---

## 📄 Devis

**Base Path:** `/api/devis`

### Endpoints disponibles

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/` | Liste tous les devis |
| GET | `/{id}` | Détails d'un devis |
| POST | `/` | Créer un devis |
| PUT | `/{id}` | Modifier un devis |
| DELETE | `/{id}` | Supprimer un devis |

### Structure des données

**DevisRequest:**
```json
{
  "numero": "DEV-2026-001",
  "dateEmission": "2026-02-04",
  "dateExpiration": "2026-03-04",
  "montantHT": 2500.00,
  "montantTVA": 525.00,
  "montantTTC": 3025.00,
  "statut": "EN_ATTENTE",
  "societeId": 1,
  "clientId": 5,
  "lignes": [
    {
      "description": "Installation tableau électrique 4 rangées",
      "quantite": 1.0,
      "prixUnitaire": 850.00,
      "total": 850.00
    },
    {
      "description": "Disjoncteur différentiel 40A 30mA",
      "quantite": 3.0,
      "prixUnitaire": 125.00,
      "total": 375.00
    }
  ]
}
```

**Validation:**
- `montantHT`, `montantTTC`: doivent être positifs
- `montantTVA`: doit être >= 0
- `lignes`: au moins une ligne requise
- `dateExpiration` > `dateEmission`

**Utilisation Frontend:**
- **Éditeur de devis:** Interface avec ajout/suppression de lignes dynamique
- **Calcul automatique:** Recalculer totaux HT/TVA/TTC en temps réel
- **Templates:** Sauvegarder des modèles de devis réutilisables
- **Statuts:** EN_ATTENTE, ACCEPTE, REFUSE, EXPIRE
- **Génération PDF:** Bouton pour télécharger le devis en PDF
- **Conversion:** Transformer un devis accepté en facture
- **Suivi:** Tableau de bord avec statistiques (taux d'acceptation, montants)

---

## 🧾 Factures

**Base Path:** `/api/factures`
**CORS:** Activé

### Endpoints disponibles

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/` | Liste toutes les factures |
| GET | `/societe/{societeId}` | Factures par société |
| GET | `/client/{clientId}` | Factures par client |
| GET | `/{id}` | Détails d'une facture |
| GET | `/{id}/ubl` | Facture au format UBL XML |
| POST | `/` | Créer une facture |
| POST | `/{id}/peppol` | Envoyer via Peppol |
| PUT | `/{id}` | Modifier une facture |
| DELETE | `/{id}` | Supprimer une facture |

### Structure des données

**FactureRequest:**
```json
{
  "numero": "FACT-2026-001",
  "dateEmission": "2026-02-04",
  "dateEcheance": "2026-03-04",
  "montantHT": 2500.00,
  "montantTVA": 525.00,
  "montantTTC": 3025.00,
  "statut": "EMISE",
  "typeCode": "380",
  "currencyCode": "EUR",
  "buyerReference": "CMD-2026-042",
  "orderReference": "BON-2026-001",
  "paymentMeansCode": "30",
  "paymentId": "FACT-2026-001",
  "note": "Paiement sous 30 jours",
  "dateLivraison": "2026-02-03",
  "conditionsPaiement": "Paiement à 30 jours fin de mois",
  "societeId": 1,
  "clientId": 5,
  "lignes": [
    {
      "description": "Installation tableau électrique 4 rangées",
      "quantite": 1.0,
      "prixUnitaire": 850.00,
      "total": 850.00,
      "itemName": "Tableau électrique",
      "unitCode": "C62",
      "vatCategoryCode": "S",
      "vatPercent": 21.0
    }
  ]
}
```

**Codes importants:**
- `typeCode`: 380 (facture), 381 (avoir), 384 (facture rectificative)
- `currencyCode`: EUR, USD, GBP (ISO 4217)
- `paymentMeansCode`: 30 (virement), 48 (carte bancaire), 49 (prélèvement)
- `unitCode`: C62 (pièce), HUR (heure), MTR (mètre)
- `vatCategoryCode`: S (standard), Z (taux zéro), E (exonéré)

### GET `/api/factures/{id}/ubl`

**Paramètres:**
- `strict` (query, boolean, défaut=false): Mode strict de validation UBL

**Réponse:** XML au format UBL 2.1 (Content-Type: application/xml)

**Utilisation:** Télécharger la facture au format électronique standardisé

### POST `/api/factures/{id}/peppol`

**Réponse:**
```json
{
  "status": "SUCCESS",
  "message": "Facture envoyée avec succès via Peppol",
  "factureId": 123
}
```

**Note:** Actuellement un stub, retourne toujours SUCCESS

**Utilisation Frontend:**
- **Liste factures:** Tableau avec filtres (statut, période, client)
- **Éditeur facture:** Interface similaire aux devis
- **Statuts:** BROUILLON, EMISE, PAYEE, EN_RETARD, ANNULEE
- **Génération PDF:** Télécharger la facture en PDF
- **Export UBL:** Bouton pour obtenir le XML UBL (e-invoicing)
- **Envoi Peppol:** Bouton pour envoyer électroniquement au client
- **Suivi paiements:** Marquer comme payée, relances automatiques
- **Statistiques:** CA, impayés, délais moyens de paiement
- **Comptabilité:** Export pour logiciel comptable

---

## 📦 Produits

**Base Path:** `/api/produits`
**CORS:** Activé

### Endpoints disponibles

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/` | Liste tous les produits |
| GET | `/societe/{societeId}` | Produits par société |
| GET | `/{id}` | Détails d'un produit |
| POST | `/` | Créer un produit |
| PUT | `/{id}` | Modifier un produit |
| DELETE | `/{id}` | Supprimer un produit |

### Structure des données

**ProduitRequest:**
```json
{
  "reference": "DISJ-40A-30MA",
  "nom": "Disjoncteur différentiel 40A 30mA",
  "description": "Disjoncteur différentiel type A, courbe C, 40A, sensibilité 30mA",
  "quantiteStock": 25.0,
  "prixUnitaire": 125.00,
  "societeId": 1
}
```

**Validation:**
- `prixUnitaire`: doit être positif

**Utilisation Frontend:**
- **Catalogue produits:** Liste avec recherche par référence/nom
- **Gestion stock:** Alertes quand stock faible
- **Ajout rapide:** Dans formulaire devis/facture, autocomplete de produits
- **Prix suggéré:** Pré-remplir le prix unitaire depuis le catalogue
- **Historique:** Voir l'utilisation du produit dans les factures
- **Import/Export:** Importer catalogue depuis CSV/Excel

---

## 📦+ Produits Avancés

**Base Path:** `/api/produits-avances`
**CORS:** Activé

### Endpoints disponibles

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/` | Liste tous les produits avancés |
| GET | `/societe/{societeId}` | Produits avancés par société |
| GET | `/{id}` | Détails d'un produit avancé |
| POST | `/` | Créer un produit avancé |
| PUT | `/{id}` | Modifier un produit avancé |
| DELETE | `/{id}` | Supprimer un produit avancé |

### Structure des données

**ProduitAvanceRequest:**
```json
{
  "reference": "CABLE-3G2.5",
  "nom": "Câble 3G2.5mm² R2V",
  "description": "Câble rigide 3 conducteurs 2.5mm² avec terre",
  "prixAchat": 2.50,
  "prixVente": 4.80,
  "fournisseur": "Électro Distribution SA",
  "societeId": 1
}
```

**Différences avec Produits:**
- Pas de gestion de stock
- Prix d'achat ET prix de vente (calcul de marge)
- Information fournisseur

**Utilisation Frontend:**
- **Calcul de marge:** Afficher la marge bénéficiaire (%)
- **Analyse rentabilité:** Statistiques sur les marges par produit
- **Sélection fournisseur:** Comparer les prix par fournisseur
- **Intégration devis:** Utiliser le prix de vente dans les devis/factures

---

## 📎 Pièces Justificatives

**Base Path:** `/api/pieces`
**CORS:** Activé

### Endpoints disponibles

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/upload` | Upload un fichier |
| GET | `/{id}` | Métadonnées du fichier |
| GET | `/{id}/download` | Télécharger le fichier |
| GET | `/intervention/{interventionId}` | Fichiers d'une intervention |
| GET | `/devis/{devisId}` | Fichiers d'un devis |
| GET | `/facture/{factureId}` | Fichiers d'une facture |
| DELETE | `/{id}` | Supprimer un fichier |

### POST `/api/pieces/upload`

**Requête:** Multipart form data

**Paramètres:**
- `file` (MultipartFile, requis)
- `type` (String, requis): ex. "PHOTO", "PDF", "SIGNATURE"
- `interventionId` (Long, optionnel)
- `devisId` (Long, optionnel)
- `factureId` (Long, optionnel)

**Exemple avec fetch:**
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('type', 'PHOTO');
formData.append('interventionId', '123');

fetch('/api/pieces/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

**Réponse:**
```json
{
  "id": 456,
  "filename": "abc123def456.jpg",
  "originalFilename": "photo_tableau.jpg",
  "contentType": "image/jpeg",
  "fileSize": 2048576,
  "type": "PHOTO",
  "downloadUrl": "/api/pieces/456/download",
  "uploadDate": "2026-02-04T14:30:00",
  "interventionId": 123,
  "devisId": null,
  "factureId": null
}
```

**Utilisation Frontend:**
- **Upload photos intervention:**
  - Drag & drop ou sélection fichier
  - Prévisualisation avant upload
  - Upload multiple avec barre de progression
- **Galerie photos:** Afficher toutes les photos d'une intervention
- **Pièces jointes facture:** Ajouter devis, BL, photos au PDF facture
- **Signature électronique:** Upload signature client sur devis
- **Types de fichiers:** Photos (JPG, PNG), PDF, documents (DOC, XLS)
- **Taille limite:** Vérifier côté client avant upload
- **Lightbox:** Visualiser les images en plein écran

---

## 🔒 Sécurité

### Authentification JWT

**Header requis:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Flux d'authentification:**
```
1. POST /api/auth/login → Obtenir accessToken + refreshToken
2. Stocker les tokens (localStorage, sessionStorage, cookies)
3. Inclure accessToken dans tous les appels API
4. Si 401 → POST /api/auth/refresh avec refreshToken
5. Si refresh échoue → Déconnecter et rediriger vers login
```

### Rôles et permissions

**Rôles disponibles:**
- `ADMIN`: Accès complet, gestion multi-sociétés
- `GERANT`: Gestion de sa société
- `USER`: Accès standard

**Restrictions:**
- Suppression utilisateur: ADMIN uniquement
- Création/suppression société: ADMIN uniquement
- Modification société: ADMIN ou GERANT
- Accès données: Isolation par société (sauf ADMIN)

### Interceptor HTTP recommandé (JavaScript/TypeScript)

```javascript
// Exemple avec Axios
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');
      const response = await axios.post('/api/auth/refresh', { refreshToken });

      const { accessToken } = response.data;
      localStorage.setItem('accessToken', accessToken);

      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      return axios(originalRequest);
    }

    return Promise.reject(error);
  }
);
```

---

## ⚠️ Gestion des erreurs

### Codes HTTP

| Code | Signification | Action frontend |
|------|---------------|-----------------|
| 200 | OK | Traiter la réponse |
| 201 | Created | Confirmer création |
| 204 | No Content | Confirmer suppression |
| 400 | Bad Request | Afficher erreurs de validation |
| 401 | Unauthorized | Rafraîchir token ou rediriger login |
| 403 | Forbidden | Afficher message permissions insuffisantes |
| 404 | Not Found | Ressource non trouvée |
| 500 | Server Error | Message d'erreur générique |

### Format des erreurs de validation

```json
{
  "timestamp": "2026-02-04T14:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email invalide"
    },
    {
      "field": "motDePasse",
      "message": "Le mot de passe doit contenir au moins 6 caractères"
    }
  ]
}
```

### Gestion des erreurs frontend

```javascript
try {
  const response = await api.post('/api/clients', clientData);
  showSuccessMessage('Client créé avec succès');
  navigate(`/clients/${response.data.id}`);
} catch (error) {
  if (error.response?.status === 400) {
    // Erreurs de validation
    const errors = error.response.data.errors;
    displayValidationErrors(errors);
  } else if (error.response?.status === 401) {
    // Token expiré
    await refreshToken();
  } else {
    // Erreur générique
    showErrorMessage('Une erreur est survenue');
  }
}
```

---

## 📱 Recommandations Frontend

### Architecture suggérée

```
src/
├── api/
│   ├── auth.js          # Fonctions authentification
│   ├── clients.js       # API clients
│   ├── factures.js      # API factures
│   ├── ...              # Autres ressources
│   └── interceptors.js  # Gestion tokens, erreurs
├── components/
│   ├── forms/           # Formulaires réutilisables
│   ├── tables/          # Tableaux de données
│   └── modals/          # Modales
├── pages/
│   ├── Auth/            # Login, register
│   ├── Dashboard/       # Tableau de bord
│   ├── Clients/         # Liste, détails, CRUD clients
│   ├── Factures/        # Gestion factures
│   └── ...
├── hooks/
│   ├── useAuth.js       # Hook authentification
│   └── useApi.js        # Hook appels API
└── utils/
    ├── validators.js    # Fonctions validation
    └── formatters.js    # Formatage données
```

### Pages à développer

1. **Authentification**
   - Login
   - Register
   - Mot de passe oublié

2. **Dashboard**
   - Statistiques (CA, factures en attente, interventions du jour)
   - Graphiques (évolution CA, top clients)
   - Tâches récentes

3. **Gestion Clients**
   - Liste clients (table avec recherche/filtres)
   - Fiche client (détails + historique)
   - Formulaire création/édition

4. **Gestion Chantiers**
   - Liste chantiers (kanban ou table)
   - Détails chantier (infos + interventions + documents)
   - Planning/calendrier
   - Carte géographique

5. **Interventions**
   - Planning technicien (calendrier)
   - Formulaire intervention rapide
   - Détails intervention + upload photos
   - Historique par chantier

6. **Devis & Factures**
   - Liste devis/factures (filtres avancés)
   - Éditeur devis (lignes dynamiques, calculs auto)
   - Éditeur factures (+ conversion devis → facture)
   - Prévisualisation PDF
   - Envoi email/Peppol

7. **Catalogue Produits**
   - Liste produits (recherche, catégories)
   - Gestion stock
   - Import/export

8. **Administration**
   - Gestion utilisateurs
   - Configuration société
   - Paramètres Peppol
   - Rôles et permissions

### Bibliothèques recommandées

**UI Components:**
- Material-UI (React)
- Ant Design (React)
- Vuetify (Vue)
- PrimeReact/PrimeVue

**Formulaires:**
- React Hook Form / Formik
- Vuelidate / VeeValidate
- Yup (validation schémas)

**Tables:**
- AG Grid
- React Table / TanStack Table
- Vue Good Table

**Calendrier:**
- FullCalendar
- React Big Calendar

**Graphiques:**
- Chart.js
- Recharts
- ApexCharts

**PDF:**
- jsPDF
- pdfmake
- react-pdf

**Upload fichiers:**
- React Dropzone
- vue-upload-component
- Uppy

---

## 🚀 Cas d'usage Frontend

### 1. Créer une facture complète

```javascript
// 1. Récupérer la liste des clients
const clients = await api.get('/api/clients');

// 2. Récupérer le catalogue produits
const produits = await api.get('/api/produits/societe/1');

// 3. Créer la facture avec lignes
const factureData = {
  numero: generateFactureNumber(),
  dateEmission: new Date().toISOString().split('T')[0],
  dateEcheance: addDays(new Date(), 30),
  montantHT: calculateTotalHT(lignes),
  montantTVA: calculateTVA(lignes),
  montantTTC: calculateTotalTTC(lignes),
  statut: 'EMISE',
  typeCode: '380',
  currencyCode: 'EUR',
  societeId: 1,
  clientId: selectedClientId,
  lignes: lignes
};

const facture = await api.post('/api/factures', factureData);

// 4. Générer et télécharger le PDF
downloadFacturePDF(facture.id);

// 5. Optionnel: Envoyer via Peppol
await api.post(`/api/factures/${facture.id}/peppol`);
```

### 2. Planning technicien avec interventions

```javascript
// 1. Charger les interventions du mois
const interventions = await api.get('/api/interventions/societe/1');

// 2. Filtrer par technicien
const interventionsTech = interventions.filter(
  i => i.utilisateur.id === technicienId
);

// 3. Afficher dans un calendrier
<FullCalendar
  events={interventionsTech.map(i => ({
    title: i.titre,
    start: i.dateIntervention,
    extendedProps: {
      chantier: i.chantier.nom,
      client: i.client.nom
    }
  }))}
  eventClick={handleInterventionClick}
/>
```

### 3. Dashboard avec statistiques

```javascript
// Récupérer les données en parallèle
const [factures, interventions, clients, chantiers] = await Promise.all([
  api.get('/api/factures/societe/1'),
  api.get('/api/interventions/societe/1'),
  api.get('/api/clients'),
  api.get('/api/chantiers/societe/1')
]);

// Calculer les KPIs
const stats = {
  caTotal: factures.reduce((sum, f) => sum + f.montantTTC, 0),
  caPayé: factures
    .filter(f => f.statut === 'PAYEE')
    .reduce((sum, f) => sum + f.montantTTC, 0),
  facturesEnAttente: factures.filter(f => f.statut === 'EMISE').length,
  interventionsMois: interventions.filter(i =>
    isCurrentMonth(i.dateIntervention)
  ).length,
  nbClients: clients.length,
  chantiersActifs: chantiers.length
};
```

### 4. Upload photos intervention

```javascript
const handlePhotoUpload = async (interventionId, files) => {
  const uploads = files.map(file => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'PHOTO');
    formData.append('interventionId', interventionId);

    return api.post('/api/pieces/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        updateProgress(file.name, percentCompleted);
      }
    });
  });

  await Promise.all(uploads);

  // Recharger la galerie
  const photos = await api.get(`/api/pieces/intervention/${interventionId}`);
  displayGallery(photos);
};
```

---

## 📋 Checklist Intégration

### Phase 1: Authentification ✓
- [ ] Page login
- [ ] Page register
- [ ] Stockage tokens (localStorage/cookies)
- [ ] Interceptor HTTP pour ajouter token
- [ ] Gestion refresh token automatique
- [ ] Route `/me` pour charger profil
- [ ] Protection des routes (guards)

### Phase 2: Gestion Clients
- [ ] Liste clients avec recherche
- [ ] Formulaire création client
- [ ] Formulaire édition client
- [ ] Fiche détail client
- [ ] Suppression client (confirmation)
- [ ] Validation formulaire

### Phase 3: Chantiers & Interventions
- [ ] Liste chantiers
- [ ] CRUD chantiers
- [ ] Liste interventions
- [ ] Formulaire intervention
- [ ] Upload photos intervention
- [ ] Galerie photos

### Phase 4: Devis & Factures
- [ ] Liste devis
- [ ] Éditeur devis (lignes dynamiques)
- [ ] Calculs automatiques HT/TVA/TTC
- [ ] Génération PDF devis
- [ ] Liste factures
- [ ] Éditeur factures
- [ ] Export UBL
- [ ] Envoi Peppol
- [ ] Suivi paiements

### Phase 5: Catalogue & Stock
- [ ] Liste produits
- [ ] CRUD produits
- [ ] Autocomplete produits dans formulaires
- [ ] Suivi stock
- [ ] Produits avancés (marges)

### Phase 6: Administration
- [ ] Gestion utilisateurs
- [ ] Gestion société
- [ ] Configuration Peppol
- [ ] Paramètres application

### Phase 7: Dashboard & Analytics
- [ ] KPIs (CA, factures, interventions)
- [ ] Graphiques
- [ ] Planning/calendrier
- [ ] Carte chantiers

---

## 📞 Support & Documentation

**Localisation des fichiers backend:**
- Controllers: `/backend/src/main/java/com/webelec/backend/controller/`
- DTOs: `/backend/src/main/java/com/webelec/backend/dto/`
- Services: `/backend/src/main/java/com/webelec/backend/service/`
- Models: `/backend/src/main/java/com/webelec/backend/model/`

**URLs utiles:**
- API Base URL: `http://localhost:8080/api` (dev)
- Swagger/OpenAPI: Vérifier si disponible à `http://localhost:8080/swagger-ui.html`

**Notes:**
- Tous les endpoints nécessitent authentification sauf `/auth/*`
- Les dates sont au format ISO 8601 (YYYY-MM-DD)
- Les montants sont en décimales (BigDecimal côté backend)
- Les IDs sont de type Long
- CORS activé sur plusieurs endpoints pour développement

---

*Documentation générée le 2026-02-04*
*Version API: 1.0*
*Backend: Spring Boot 3.5.8 / Java 21*
