# Guide de configuration n8n - WebElec

Guide complet pour configurer le workflow d'automatisation des demandes de démonstration WebElec.

---

## Table des matières

1. [Prérequis](#1-prérequis)
2. [Configuration des comptes](#2-configuration-des-comptes)
3. [Importation du workflow](#3-importation-du-workflow)
4. [Configuration des credentials](#4-configuration-des-credentials)
5. [Paramétrage du Google Sheet](#5-paramétrage-du-google-sheet)
6. [Test du workflow](#6-test-du-workflow)
7. [Activation et monitoring](#7-activation-et-monitoring)
8. [Dépannage](#8-dépannage)

---

## 1. Prérequis

### Comptes nécessaires

- ✅ **n8n Cloud** : <https://app.n8n.cloud/>
- ✅ **Gmail** : Votre compte Gmail personnel
- ✅ **OpenAI** : Compte avec clé API (<https://platform.openai.com/>)
- ✅ **Google Sheets** : Accès via votre compte Google

### Configuration Gmail préalable

#### Étape 1 : Configurer l'envoi depuis <support@webelec.be>

1. Ouvrir Gmail → **Paramètres** (roue crantée) → **Voir tous les paramètres**
2. Aller dans l'onglet **Comptes et importation**
3. Section **Envoyer des e-mails en tant que** → Cliquer sur **Ajouter une autre adresse e-mail**
4. Entrer :
   - Nom : `Support WebElec`
   - Adresse e-mail : `support@webelec.be`
   - ☑️ Cocher "Traiter comme un alias"
5. Suivre les instructions de vérification (code envoyé à <support@webelec.be>)
6. Une fois validé, vous pourrez envoyer des emails depuis cette adresse via Gmail

#### Étape 2 : Créer un label Gmail pour le workflow

1. Dans Gmail, créer un nouveau label : **WebElec_Traité**
2. Ce label marquera automatiquement les emails traités par n8n

---

## 2. Configuration des comptes

### A. Créer un compte n8n Cloud

1. Aller sur <https://app.n8n.cloud/>
2. S'inscrire (gratuit jusqu'à 5000 exécutions/mois)
3. Confirmer votre email
4. Se connecter au dashboard n8n

### B. Obtenir la clé API OpenAI

Si vous ne l'avez pas encore :

1. Aller sur <https://platform.openai.com/>
2. Se connecter ou créer un compte
3. Aller dans **API keys** (menu gauche)
4. Cliquer sur **+ Create new secret key**
5. Nommer la clé : `n8n-webelec`
6. **COPIER LA CLÉ** (elle ne s'affichera qu'une fois !)
7. Sauvegarder dans un endroit sûr (gestionnaire de mots de passe)

**Important** : Ajouter des crédits sur votre compte OpenAI (min 5-10€) pour pouvoir utiliser l'API.

---

## 3. Importation du workflow

### Étape par étape

1. Dans n8n Cloud, cliquer sur **Workflows** (menu gauche)
2. Cliquer sur **+ Add workflow** → **Import from file**
3. Sélectionner le fichier `workflow-webelec-n8n.json`
4. Le workflow s'ouvre avec tous les nodes configurés
5. Sauvegarder (Ctrl+S ou bouton Save en haut à droite)

---

## 4. Configuration des credentials

Vous devez configurer 3 credentials (identifiants) :

### A. Gmail OAuth2

1. Cliquer sur le node **Gmail Trigger**
2. Dans le panneau de droite, section **Credential to connect with**
3. Cliquer sur **Create New Credential**
4. Sélectionner **Gmail OAuth2**
5. Cliquer sur **Connect my account**
6. Choisir votre compte Gmail
7. Autoriser n8n à accéder à Gmail
8. Nommer le credential : `Gmail - WebElec`
9. Sauvegarder

**Répéter pour tous les nodes Gmail** (ou sélectionner le même credential).

### B. OpenAI API

1. Cliquer sur le node **AI Analysis (GPT-4o)**
2. Section **Credential to connect with**
3. Cliquer sur **Create New Credential**
4. Coller votre clé API OpenAI
5. Nommer : `OpenAI - WebElec`
6. Tester la connexion
7. Sauvegarder

### C. Google Sheets OAuth2

1. Cliquer sur le node **Save to Google Sheets**
2. Section **Credential to connect with**
3. Cliquer sur **Create New Credential**
4. Sélectionner **Google Sheets OAuth2**
5. Cliquer sur **Connect my account**
6. Autoriser n8n
7. Nommer : `Google Sheets - WebElec`
8. Sauvegarder

---

## 5. Paramétrage du Google Sheet

### Créer le fichier Google Sheets

1. Aller sur <https://sheets.google.com/>
2. Créer un nouveau fichier
3. Le nommer : **WebElec - Demandes Support 2025**
4. Dans la première ligne (en-têtes), entrer exactement :

| A    | B     | C       | D     | E    | F   | G     | H         | I          | J            | K       | L     | M           | N         | O      | P      | Q         | R     |
| ---- | ----- | ------- | ----- | ---- | --- | ----- | --------- | ---------- | ------------ | ------- | ----- | ----------- | --------- | ------ | ------ | --------- | ----- |
| Date | Heure | Urgence | Score | Type | Nom | Email | Téléphone | Entreprise | Type travaux | Adresse | Délai | Description | Sentiment | Langue | Statut | Assigné à | Notes |

1. Formater la première ligne en gras
2. Appliquer des couleurs (optionnel) :
   - En-tête : Fond bleu, texte blanc
   - Urgence "urgent" : Fond rouge
   - Urgence "moyen" : Fond orange
   - Urgence "faible" : Fond vert

### Copier l'ID du Sheet

1. Dans l'URL du Google Sheet, copier l'ID (entre `/d/` et `/edit`)

   Exemple :

   ```text
   https://docs.google.com/spreadsheets/d/1ABC123xyz456/edit
                                          ↑
                                   C'est cet ID
   ```

2. Dans n8n, retourner au node **Save to Google Sheets**
3. Dans le champ **Document**, cliquer sur l'icône de liste
4. Sélectionner votre fichier **WebElec - Demandes Support 2025**
5. Dans **Sheet**, sélectionner **Sheet1** (ou renommer selon votre besoin)

---

## 6. Test du workflow

### Test manuel étape par étape

1. **Désactiver le trigger Gmail** temporairement (pour tester manuellement)
2. Cliquer sur le node **Gmail Trigger**
3. Cliquer sur **Execute Node** (bouton play)
4. Si vous avez des emails non lus, ils seront récupérés

**OU envoyer un email de test :**

1. Depuis une autre adresse, envoyer un email à votre Gmail avec :

   - Sujet : `Demande de démo WebElec - TEST`
   - Corps :

     ```text
     Bonjour,

     Je suis Jean Dupont, gérant de ElectroPro SPRL.
     Je souhaiterais une démonstration de WebElec pour gérer mes chantiers.

     Téléphone : 0471 23 45 67
     Adresse : Rue de la Gare 15, 1000 Bruxelles

     Cordialement,
     Jean Dupont
     ```

2. Dans n8n, cliquer sur **Execute Workflow** (en bas à droite)
3. Observer l'exécution node par node
4. Vérifier :
   - ✅ Email récupéré
   - ✅ Données extraites
   - ✅ Pas détecté comme spam
   - ✅ Analyse IA effectuée
   - ✅ Données sauvegardées dans Google Sheets
   - ✅ Email de confirmation envoyé

### Vérifications post-test

1. **Gmail** : Vérifier que l'email de confirmation est bien envoyé au demandeur
2. **Google Sheets** : Vérifier qu'une nouvelle ligne a été ajoutée avec toutes les données
3. **Votre email** : Si test "urgent", vérifier que vous avez reçu la notification

---

## 7. Activation et monitoring

### Activer le workflow

1. En haut à droite de n8n, basculer le switch sur **Active**
2. Le workflow se déclenchera automatiquement toutes les minutes pour vérifier les nouveaux emails

### Configuration du polling (fréquence)

Par défaut : **toutes les minutes**

Pour modifier :

1. Cliquer sur **Gmail Trigger**
2. Section **Poll Times**
3. Choisir :
   - Every minute (recommandé)
   - Every 5 minutes (si peu de demandes)
   - Every 15 minutes (économise des exécutions)

### Monitoring

Dans n8n :

1. Menu **Executions** (menu gauche)
2. Voir l'historique de toutes les exécutions
3. Cliquer sur une exécution pour voir les détails
4. En cas d'erreur, elle apparaîtra en rouge

### Alertes en cas d'erreur

n8n peut vous envoyer un email si le workflow échoue :

1. Menu **Settings** → **Workflow**
2. Section **Error Workflow**
3. Configurer une notification email

---

## 8. Dépannage

### Problèmes courants

#### ❌ "Gmail authentication failed"

**Solution :**

- Vérifier que vous avez bien autorisé n8n dans votre compte Google
- Aller sur <https://myaccount.google.com/permissions>
- Vérifier que n8n a les permissions Gmail
- Recréer le credential Gmail si nécessaire

#### ❌ "OpenAI API error: insufficient_quota"

**Solution :**

- Votre compte OpenAI n'a plus de crédits
- Aller sur <https://platform.openai.com/account/billing>
- Ajouter des crédits (min 5€)

#### ❌ "Google Sheets: Document not found"

**Solution :**

- Vérifier l'ID du Google Sheet
- S'assurer que le compte Google connecté à n8n a accès au fichier
- Partager le Sheet avec le compte si nécessaire

#### ❌ "Unable to send email from <support@webelec.be>"

**Solution :**

- Vérifier la configuration "Envoyer en tant que" dans Gmail
- S'assurer que <support@webelec.be> est bien vérifié
- Vérifier que le champ "From" dans le node Gmail utilise le bon alias

#### ❌ Le workflow ne se déclenche pas

**Solution :**

- Vérifier que le workflow est bien **Active** (switch en haut à droite)
- Vérifier qu'il y a bien des emails **non lus** dans Gmail
- Vérifier les logs dans **Executions**

#### ❌ L'IA analyse mal les emails

**Solution :**

- Vérifier le prompt dans le node **AI Analysis**
- Augmenter la température (0.3 → 0.5) pour plus de flexibilité
- Vérifier les crédits OpenAI
- Essayer avec GPT-3.5-turbo si GPT-4o est trop cher

---

## 9. Optimisations futures

### Ajout d'un calendrier Google Calendar

Pour proposer automatiquement des créneaux de RDV :

1. Ajouter un node **Google Calendar**
2. Chercher les créneaux disponibles
3. Inclure un lien Calendly dans l'email de réponse

### Intégration WhatsApp Business

Pour envoyer une notification WhatsApp au client :

1. Créer un compte WhatsApp Business API
2. Ajouter un node **WhatsApp** dans n8n
3. Envoyer un message de confirmation

### CRM (Airtable, HubSpot, Pipedrive)

Pour gérer les leads :

1. Ajouter un node **Airtable** ou autre CRM
2. Créer automatiquement un contact/lead
3. Assigner à un commercial

---

## 10. Coûts estimés

### n8n Cloud

- **Gratuit** : jusqu'à 5000 exécutions/mois
- **Starter** (9€/mois) : 10 000 exécutions
- **Pro** (29€/mois) : 50 000 exécutions

### OpenAI

- **GPT-4o** : ~5$/million tokens
- **Estimation** : 0.005€ par email analysé
- **Volume** : 1000 emails/mois = ~5€/mois

### Google Workspace (si nécessaire)

- Si vous voulez un vrai compte <support@webelec.be>
- **Business Starter** : 6€/utilisateur/mois

**Total estimé** : 10-15€/mois pour 1000 demandes

---

## Support

Pour toute question :

- Documentation n8n : <https://docs.n8n.io/>
- Forum n8n : <https://community.n8n.io/>
- OpenAI API docs : <https://platform.openai.com/docs/>

---

## Bon workflow ! 🚀

## Généré pour WebElec - 2025
