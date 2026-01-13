# Workflow n8n - WebElec

Système d'automatisation intelligente pour la gestion des demandes de démonstration WebElec.

---

## 📋 Vue d'ensemble

Ce workflow automatise entièrement le traitement des demandes entrantes sur [support@webelec.be](mailto:support@webelec.be) :

1. **Récupération** des emails depuis Gmail
2. **Filtrage** anti-spam intelligent
3. **Analyse IA** (OpenAI GPT-4o) pour classifier et extraire les informations
4. **Routage** selon l'urgence détectée
5. **Sauvegarde** dans Google Sheets
6. **Réponse automatique** personnalisée au client
7. **Notification** de l'équipe pour les cas urgents

---

## 🎯 Fonctionnalités

### ✅ Détection intelligente de l'urgence

- Analyse des mots-clés (panne, court-circuit, danger, urgence...)
- Score d'urgence de 1 à 10
- Classification automatique : Urgent / Moyen / Faible

### ✅ Extraction automatique des données

- Nom et prénom du client
- Email et téléphone
- Entreprise (si mentionnée)
- Type de travaux demandés
- Adresse du chantier
- Délai souhaité
- Description résumée de la demande

### ✅ Anti-spam intégré

- Détection des emails suspects (casino, viagra, lottery, prince...)
- Marquage automatique comme spam dans Gmail
- Emails bloqués avant analyse IA (économie de coûts)

### ✅ Réponses personnalisées

- Email de confirmation immédiat au client
- Template différent selon l'urgence
- Design professionnel responsive (mobile-friendly)
- Signature WebElec avec toutes les coordonnées

### ✅ Notifications d'urgence

- Email d'alerte envoyé à votre boîte perso pour les cas urgents
- Contient toutes les informations pour rappel immédiat
- Format structuré pour action rapide

### ✅ Suivi et reporting

- Toutes les demandes sauvegardées dans Google Sheets
- Colonnes : Date, Urgence, Nom, Email, Tél, Type, Description, Statut, etc.
- Historique complet pour analyse et suivi commercial

---

## 📁 Fichiers fournis

```n8n
n8n/
├── workflow-webelec-n8n.json    # Workflow complet à importer dans n8n
├── GUIDE_CONFIGURATION.md       # Guide pas-à-pas pour configurer n8n
├── email-templates.md           # Collection de templates d'emails
└── README.md                    # Ce fichier
```

---

## 🚀 Installation rapide

### Étape 1 : Prérequis

Créer/vérifier vos comptes :

- [x] **n8n Cloud** : [https://app.n8n.cloud/](https://app.n8n.cloud/)
- [x] **Gmail** avec [support@webelec.be](mailto:support@webelec.be) configuré en "Envoyer en tant que"
- [x] **OpenAI** avec clé API active
- [x] **Google Sheets** accessible depuis votre compte Google

### Étape 2 : Importer le workflow

1. Se connecter à n8n Cloud
2. Workflows → Import from file
3. Sélectionner `workflow-webelec-n8n.json`
4. Le workflow s'ouvre automatiquement

### Étape 3 : Configurer les credentials

Vous devez connecter 3 comptes dans n8n :

#### A. Gmail OAuth2

- Node : **Gmail Trigger**
- Credential : Create New → Gmail OAuth2
- Autoriser n8n à accéder à Gmail
- Répéter pour tous les nodes Gmail

#### B. OpenAI API

- Node : **AI Analysis (GPT-4o)**
- Credential : Create New → OpenAI
- Coller votre clé API OpenAI
- Tester la connexion

#### C. Google Sheets OAuth2

- Node : **Save to Google Sheets**
- Credential : Create New → Google Sheets OAuth2
- Autoriser n8n

### Étape 4 : Créer le Google Sheet

1. Créer un fichier : **WebElec - Demandes Support 2025**
2. En-têtes (ligne 1) :

   | Date | Heure | Urgence | Score | Type | Nom | Email | Téléphone | Entreprise | Type travaux | Adresse | Délai | Description | Sentiment | Langue | Statut | Assigné à | Notes | Email ID |

3. Dans n8n, lier le node **Save to Google Sheets** à ce fichier

### Étape 5 : Tester

1. Envoyer un email de test à votre Gmail
2. Dans n8n : Execute Workflow
3. Vérifier :
   - Données dans Google Sheets ✅
   - Email de confirmation reçu ✅
   - Email marqué comme traité dans Gmail ✅

### Étape 6 : Activer

- Switch **Active** en haut à droite de n8n
- Le workflow tourne automatiquement toutes les minutes

---

## 📊 Architecture du workflow

```js
┌─────────────────────┐
│  Gmail Trigger      │ ← Polling toutes les minutes
│  (emails non lus)   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Extract Email Data  │ ← Nettoyage et structuration
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Spam Detector      │ ← Détection mots-clés spam
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Filter Spam       │ ← Bifurcation
└─────┬───────┬───────┘
      │       │
 Spam │       │ Valide
      ▼       ▼
   [Mark]  ┌──────────────────────┐
   [Spam]  │ AI Analysis (GPT-4o) │ ← Analyse intelligente
           └──────────┬───────────┘
                      │
                      ▼
           ┌─────────────────────┐
           │ Parse AI Response   │ ← Extraction JSON
           └──────────┬──────────┘
                      │
                      ▼
           ┌─────────────────────┐
           │  Check Urgency      │ ← Routage urgent/normal
           └─────┬───────┬───────┘
                 │       │
            Urgent│       │Normal
                 │       │
                 ▼       ▼
         [Notification] [Continue]
                 │       │
                 └───┬───┘
                     ▼
           ┌─────────────────────┐
           │ Save to Sheets      │ ← Sauvegarde données
           └──────────┬──────────┘
                      │
                      ▼
           ┌─────────────────────┐
           │  Send Auto Reply    │ ← Email client
           └──────────┬──────────┘
                      │
                      ▼
           ┌─────────────────────┐
           │ Mark as Processed   │ ← Label Gmail
           └─────────────────────┘
```

---

## 💡 Exemples de cas d'usage

### Scénario 1 : Demande standard

**Email reçu :**

```text
De: jean.dupont@example.com
Sujet: Demande de démo

Bonjour,
Je souhaite une démonstration de WebElec pour mon entreprise.
Cordialement,
Jean Dupont
```

**Traitement automatique :**

1. ✅ Email analysé par l'IA
2. ✅ Classé "moyen" (pas urgent)
3. ✅ Données extraites : Nom, Email
4. ✅ Sauvegardé dans Google Sheets
5. ✅ Email de confirmation envoyé (délai 24h)
6. ✅ Pas de notification urgente

---

### Scénario 2 : Urgence détectée

**Email reçu :**

```markdown
De: marie.martin@example.com
Sujet: URGENT - Panne électrique

Bonjour,
Court-circuit dans mon atelier, plus de courant depuis ce matin.
Besoin d'intervention rapide !
Marie Martin - 0471 23 45 67
Rue de la Gare 15, Bruxelles
```

**Traitement automatique :**

1. ✅ Mots-clés urgents détectés (URGENT, panne, court-circuit)
2. ✅ Score d'urgence : 9/10
3. ✅ Données extraites : Nom, Email, Tél, Adresse
4. ✅ **Email d'alerte envoyé à VOUS**
5. ✅ Sauvegardé dans Google Sheets (colonne Urgence = "urgent")
6. ✅ Email de confirmation envoyé au client (délai 2h)

---

## 🔧 Personnalisation

### Modifier les critères d'urgence

Dans le node **AI Analysis (GPT-4o)**, modifier le prompt :

```markdown
CRITÈRES D'URGENCE:

- Mots urgents: panne, court-circuit, danger, incendie, électrocution, urgent, immédiat, SOS = urgent (score 8-10)
- Demande standard = moyen (score 4-7)
- Simple info = faible (score 1-3)
```

Ajouter vos propres mots-clés ou ajuster les scores.

### Modifier les templates d'emails

1. Node **Send Auto Reply**
2. Champ **Message** → Modifier le HTML
3. Utiliser les variables `{{ $json.client_nom }}`, etc.
4. Voir `email-templates.md` pour des exemples

### Ajouter des champs au Google Sheet

1. Modifier les en-têtes dans Google Sheets
2. Dans node **Save to Google Sheets** → Section **Columns**
3. Ajouter une nouvelle mapping avec la variable correspondante

---

## 📈 Améliorations futures

### Intégrations prévues

- [ ] **Google Calendar** : Proposer des créneaux de RDV automatiques
- [ ] **WhatsApp Business** : Notification client par WhatsApp
- [ ] **PostgreSQL** : Base de données pour historique long terme
- [ ] **CRM** : Intégration HubSpot/Pipedrive
- [ ] **Calendly** : Lien de prise de RDV dans l'email

### Fonctionnalités additionnelles

- [ ] Email de relance automatique après 48h sans réponse
- [ ] Détection des doublons (même email en 48h)
- [ ] Support multilingue (NL/EN détecté automatiquement)
- [ ] Scoring de lead (priorité commerciale)
- [ ] Webhook vers API externe
- [ ] Dashboard de statistiques (Grafana/Metabase)

---

## 💰 Coûts estimés

### n8n Cloud

- **Gratuit** : 5000 exécutions/mois (largement suffisant pour démarrer)
- Si dépassement : **Starter** 9€/mois → 10 000 exécutions

### OpenAI GPT-4o

- **Prix** : ~5$/million de tokens
- **Estimation** : 0.005€ par email analysé
- **Volume** : 100 emails/mois = ~0.50€/mois
- **Volume** : 1000 emails/mois = ~5€/mois

### Total

- **Petit volume** (< 100 emails/mois) : **GRATUIT** ✅
- **Volume moyen** (500 emails/mois) : **~2.50€/mois**
- **Gros volume** (1000+ emails/mois) : **~10-15€/mois**

---

## 🆘 Support et documentation

### Documentation complète

- **Installation détaillée** : Voir `GUIDE_CONFIGURATION.md`
- **Templates d'emails** : Voir `email-templates.md`

### Ressources externes

- **n8n Docs** : [https://docs.n8n.io/](https://docs.n8n.io/)
- **n8n Community** : [https://community.n8n.io/](https://community.n8n.io/)
- **OpenAI API Docs** : [https://platform.openai.com/docs/](https://platform.openai.com/docs/)

### Dépannage

Voir la section "Dépannage" dans `GUIDE_CONFIGURATION.md`

---

## 📞 Contact

Pour toute question sur ce workflow :

- **WebElec** : [support@webelec.be](mailto:support@webelec.be)
- **Téléphone** : +32 497 50 65 36

---

## 📝 Changelog

### v1.0 - 2025-01-11

- ✅ Workflow initial complet
- ✅ Intégration Gmail + OpenAI + Google Sheets
- ✅ Anti-spam basique
- ✅ Détection d'urgence par mots-clés
- ✅ Templates d'emails professionnels
- ✅ Notifications internes pour urgences
- ✅ Documentation complète

---

## Merci d'avoir choisi WebElec ! ⚡
