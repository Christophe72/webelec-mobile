# Guide Utilisateur WebElec SaaS

<div align="center">
  <img src="https://img.icons8.com/color/96/000000/electrical--v2.png" alt="Logo WebElec" />
  <h2>Plateforme de gestion pour artisans électriciens</h2>
  <p><em>Centralisez votre métier, réduisez les erreurs et garantissez la conformité RGIE</em></p>
</div>

---

## 📚 Table des matières

1. [Introduction](#-introduction)
2. [Première connexion](#-première-connexion)
3. [Interface principale](#️-interface-principale)
4. [Gestion des sociétés](#-gestion-des-sociétés)
5. [Gestion des clients](#-gestion-des-clients)
6. [Gestion des chantiers](#️-gestion-des-chantiers)
7. [Interventions](#-interventions)
8. [Devis et factures](#-devis-et-factures)
9. [Catalogue produits](#-catalogue-produits)
10. [Gestion des fichiers](#-gestion-des-fichiers)
11. [Module RGIE (Conformité)](#-module-rgie-conformité)
12. [Assistant IA](#-assistant-ia)
13. [Conseils et bonnes pratiques](#-conseils-et-bonnes-pratiques)

---

## 🎯 Introduction

**WebElec SaaS** est une plateforme professionnelle destinée aux **électriciens**, **PME techniques** et **bureaux d'étude** en Belgique.

### À quoi sert WebElec ?

WebElec vous permet de :
- ✅ Gérer vos sociétés et vos clients
- ✅ Suivre vos chantiers et interventions
- ✅ Créer des devis et factures
- ✅ Gérer votre catalogue de produits et votre stock
- ✅ Stocker des pièces justificatives (photos, PDF, tickets)
- ✅ Vérifier la conformité électrique selon le RGIE 2025
- ✅ Obtenir de l'aide via l'assistant IA

### Qui peut utiliser WebElec ?

- **Électriciens indépendants** : Gestion complète de votre activité
- **PME techniques** : Multi-utilisateurs, multi-sociétés
- **Bureaux d'étude** : Conformité RGIE et documentation

---

## 🔐 Première connexion

### Prérequis

Avant de commencer, assurez-vous que :
- Le backend est démarré sur `http://localhost:8080`
- Le frontend est démarré sur `http://localhost:3000`

### Étapes de connexion

1. **Accédez à l'application**
   - Ouvrez votre navigateur
   - Rendez-vous sur `http://localhost:3000`
   - Vous serez automatiquement redirigé vers la page de connexion

2. **Connectez-vous**
   - Entrez votre **email**
   - Entrez votre **mot de passe**
   - Cliquez sur **"Se connecter"**

3. **Première utilisation**
   - Si vous n'avez pas encore de compte, contactez votre administrateur
   - Un message de confirmation apparaîtra après une connexion réussie
   - Votre token d'authentification sera automatiquement stocké

### Déconnexion

Pour vous déconnecter :
- Retournez sur la page de login
- Si vous êtes déjà connecté, un bouton **"Déconnexion"** sera visible
- Cliquez dessus pour supprimer votre session

---

## 🖥️ Interface principale

### Page d'accueil (après connexion)

Une fois connecté, vous accédez à la page de login qui affiche :
- ✅ **Statut de connexion** : Indique si vous avez un token actif
- 🚀 **Accès rapide** : Liens directs vers tous les modules

### Modules disponibles

| Module | Description | Lien rapide |
|--------|-------------|-------------|
| **Sociétés** | Gérer vos sociétés (CRUD complet) | `/societes` |
| **Clients** | Gérer vos contacts clients | `/clients` |
| **Modules** | Activer/désactiver des fonctionnalités | `/modules` |
| **Chantiers** | Piloter vos chantiers | `/chantiers` |
| **Interventions** | Enregistrer les interventions terrain | `/interventions` |
| **Devis** | Créer et gérer des devis | `/devis` |
| **Catalogue** | Gérer produits et stock | `/catalogue` |
| **Fichiers** | Uploader des pièces jointes | `/files-demo` |
| **Auditeur RGIE** | Vérifier la conformité électrique | `/rgie/auditeur-pro` |
| **IA** | Assistant intelligent | `/ia` |

---

## 🏢 Gestion des sociétés

### Qu'est-ce qu'une société dans WebElec ?

Une société représente :
- Votre entreprise d'électricité
- Vos informations légales (TVA, adresse)
- Le contexte multi-tenant (chaque société a ses propres données)

### Fonctionnalités

#### Créer une société

1. Accédez à **Sociétés** (`/societes`)
2. Cliquez sur **"Nouvelle société"**
3. Remplissez les informations :
   - **Nom** : Le nom de votre entreprise
   - **Numéro TVA** : Format belge (BE + 10 chiffres)
   - **Adresse complète**
   - **Téléphone et email**
4. Validez

#### Modifier une société

1. Dans la liste des sociétés, cliquez sur celle à modifier
2. Modifiez les champs souhaités
3. Enregistrez les modifications

#### Supprimer une société

⚠️ **Attention** : La suppression d'une société supprime également :
- Tous ses clients
- Tous ses chantiers
- Toutes ses interventions
- Tous ses devis et factures

### Architecture multi-tenant

- Chaque utilisateur est associé à une ou plusieurs sociétés
- Les données sont isolées par société
- Vous ne voyez que les données de vos sociétés

---

## 👥 Gestion des clients

### Qu'est-ce qu'un client ?

Un client représente :
- Un particulier ou une entreprise pour qui vous travaillez
- Les coordonnées de contact
- L'historique des chantiers et interventions

### Fonctionnalités

#### Ajouter un client

1. Accédez à **Clients** (`/clients`)
2. Cliquez sur **"Nouveau client"**
3. Remplissez :
   - **Nom** et **Prénom** (ou raison sociale)
   - **Email** et **Téléphone**
   - **Adresse complète**
   - **Société associée** (sélection automatique si vous n'en avez qu'une)
4. Validez

#### Filtrer par société

- Les clients sont automatiquement filtrés par votre société active
- Si vous gérez plusieurs sociétés, utilisez le filtre en haut de page

#### Consulter l'historique

Pour chaque client, vous pouvez voir :
- Les chantiers en cours et terminés
- Les interventions réalisées
- Les devis et factures émises

---

## 🏗️ Gestion des chantiers

### Qu'est-ce qu'un chantier ?

Un chantier représente :
- Un lieu d'intervention (adresse)
- Un projet spécifique pour un client
- Le regroupement de plusieurs interventions

### Cycle de vie d'un chantier

```
Création → En cours → Terminé → Archivé
```

### Fonctionnalités

#### Créer un chantier

1. Accédez à **Chantiers** (`/chantiers`)
2. Cliquez sur **"Nouveau chantier"**
3. Remplissez :
   - **Nom du chantier** : Ex. "Installation tableau électrique"
   - **Client** : Sélectionnez dans la liste
   - **Adresse** : Lieu d'intervention
   - **Date de début prévue**
   - **Description** : Détails du projet
4. Validez

#### Suivre l'avancement

- Consultez le statut actuel
- Ajoutez des interventions liées
- Attachez des photos et documents
- Mettez à jour les dates

#### Clôturer un chantier

1. Ouvrez le chantier
2. Changez le statut en **"Terminé"**
3. Vérifiez que toutes les interventions sont complètes
4. Archivez si nécessaire

---

## 🔧 Interventions

### Qu'est-ce qu'une intervention ?

Une intervention représente :
- Une visite sur un chantier
- Le travail réalisé lors de cette visite
- La date et la durée
- Les pièces justificatives associées

### Fonctionnalités

#### Enregistrer une intervention

1. Accédez à **Interventions** (`/interventions`)
2. Cliquez sur **"Nouvelle intervention"**
3. Remplissez :
   - **Chantier** : Sélectionnez le chantier concerné
   - **Date et heure**
   - **Durée** (en heures)
   - **Description du travail effectué**
   - **Matériel utilisé**
   - **Observations**
4. Validez

#### Ajouter des photos

Lors d'une intervention, vous pouvez :
- Prendre des photos du tableau électrique
- Photographier les installations
- Documenter les anomalies
- Joindre des tickets de matériel

➡️ Voir [Gestion des fichiers](#-gestion-des-fichiers)

#### Consulter l'historique

- Toutes vos interventions sont listées
- Filtrez par chantier, client ou date
- Exportez les rapports d'intervention

---

## 💰 Devis et factures

### Devis

#### Créer un devis

1. Accédez à **Devis** (`/devis`)
2. Cliquez sur **"Nouveau devis"**
3. Sélectionnez :
   - **Client**
   - **Chantier** (optionnel)
4. Ajoutez des lignes de produits :
   - Recherchez dans le catalogue
   - Indiquez les quantités
   - Les prix sont calculés automatiquement
5. Ajoutez des lignes personnalisées si nécessaire
6. Prévisualisez le PDF
7. Envoyez au client

#### Statuts de devis

- **Brouillon** : En cours de rédaction
- **Envoyé** : Transmis au client
- **Accepté** : Client a validé
- **Refusé** : Client a décliné
- **Expiré** : Dépassé la date de validité

### Factures

#### Créer une facture

Deux méthodes :
1. **À partir d'un devis accepté** (recommandé)
   - Ouvrez le devis
   - Cliquez sur **"Convertir en facture"**

2. **Facture directe**
   - Suivez les mêmes étapes que pour un devis
   - Sélectionnez les interventions à facturer

#### Statuts de facture

- **Brouillon** : En cours de création
- **Émise** : Envoyée au client
- **Payée** : Règlement reçu
- **En retard** : Échéance dépassée
- **Annulée** : Facture annulée

#### Gestion des paiements

- Enregistrez les règlements reçus
- Suivez les échéances
- Gérez les relances automatiques

---

## 📦 Catalogue produits

### Qu'est-ce que le catalogue ?

Le catalogue contient :
- Vos produits et matériel électrique
- Les prix de vente
- Les stocks disponibles
- Les références fournisseurs

### Fonctionnalités

#### Ajouter un produit

1. Accédez à **Catalogue** (`/catalogue`)
2. Cliquez sur **"Nouveau produit"**
3. Remplissez :
   - **Nom** : Ex. "Disjoncteur 16A"
   - **Référence** : Code interne ou fournisseur
   - **Catégorie** : Type de produit
   - **Prix d'achat** et **Prix de vente**
   - **Stock actuel**
   - **Stock minimum** (alerte)
4. Validez

#### Gérer le stock

- Consultez l'état des stocks en temps réel
- Recevez des alertes quand le stock est bas
- Enregistrez les mouvements (entrées/sorties)
- Suivez l'historique des mouvements

#### Utiliser dans les devis

- Les produits du catalogue apparaissent automatiquement
- Recherche rapide par nom ou référence
- Prix pré-remplis (modifiables)
- Déduction automatique du stock lors de la facturation

---

## 📁 Gestion des fichiers

### Types de fichiers supportés

WebElec vous permet d'uploader :
- 📷 **Photos** : JPG, PNG (installations, tableaux, anomalies)
- 📄 **PDF** : Plans, schémas, certificats
- 📝 **Documents** : Tickets, bons de livraison
- 🎥 **Vidéos** (selon configuration)

### Uploader un fichier

#### Méthode 1 : Via la page dédiée

1. Accédez à **Gestion fichiers** (`/files-demo`)
2. Choisissez le type d'entité :
   - Intervention
   - Devis
   - Facture
3. Sélectionnez l'entité concernée
4. Cliquez sur **"Choisir un fichier"**
5. Sélectionnez le fichier sur votre ordinateur
6. Ajoutez une description (optionnel)
7. Uploadez

#### Méthode 2 : Depuis une intervention

1. Ouvrez l'intervention
2. Cliquez sur **"Ajouter une pièce justificative"**
3. Suivez les étapes d'upload

### Organiser vos fichiers

- Les fichiers sont automatiquement liés à leur entité
- Utilisez des noms de fichiers explicites
- Ajoutez des descriptions pour faciliter la recherche
- Consultez l'aperçu avant téléchargement

### Sécurité

✅ Les fichiers sont :
- Stockés de manière sécurisée
- Accessibles uniquement aux utilisateurs autorisés
- Isolés par société (multi-tenant)
- Sauvegardés régulièrement

---

## ⚡ Module RGIE (Conformité)

### Qu'est-ce que le RGIE ?

Le **RGIE** (Règlement Général sur les Installations Électriques) est la norme belge qui définit les règles de sécurité pour les installations électriques.

WebElec intègre le **RGIE 2025** pour vous aider à garantir la conformité.

### Auditeur RGIE

#### Accéder à l'auditeur

1. Accédez à **Auditeur RGIE** (`/rgie/auditeur-pro`)
2. Vous arrivez sur l'interface d'audit

#### Effectuer un audit

1. **Sélectionnez le type d'installation** :
   - Résidentiel
   - Tertiaire
   - Industriel

2. **Renseignez les caractéristiques** :
   - Type de tableau
   - Section des câbles
   - Dispositifs de protection
   - Environnement (humide, sec, etc.)

3. **Lancez l'analyse**
   - Le système vérifie la conformité
   - Les non-conformités sont listées
   - Des recommandations sont proposées

4. **Consultez le rapport**
   - Articles RGIE concernés
   - Seuils normatifs
   - Actions correctives
   - Export PDF disponible

### Chat RGIE

Pour des questions ponctuelles :

1. Accédez à **Chat RGIE** (`/rgie/chat`)
2. Posez votre question en français
3. Obtenez une réponse basée sur le RGIE 2025
4. Consultez les articles référencés

#### Exemples de questions

- "Quelle section de câble pour un circuit de 32A ?"
- "Puis-je installer un tableau dans une salle de bain ?"
- "Quel disjoncteur différentiel pour une cuisine ?"

---

## 🤖 Assistant IA

### À quoi sert l'assistant IA ?

L'assistant IA de WebElec vous aide à :
- 💡 Comprendre les articles RGIE
- 🔍 Analyser les causes d'anomalies
- 📝 Obtenir des suggestions d'actions correctives
- ❓ Répondre à vos questions techniques

### Accéder à l'IA

1. Accédez à **IA** (`/ia`)
2. L'interface de chat s'ouvre

### Utiliser l'assistant

#### Poser une question

1. Tapez votre question dans le champ de texte
2. Exemples :
   - "Explique-moi l'article 5.2.3 du RGIE"
   - "Comment dimensionner un circuit de chauffage ?"
   - "Quelles sont les normes pour une prise extérieure ?"
3. Appuyez sur **Entrée** ou cliquez sur **Envoyer**

#### Interpréter les réponses

L'IA fournit :
- ✅ Une explication claire en français
- 📚 Les références aux articles RGIE
- ⚡ Des exemples concrets
- ⚠️ Les précautions à prendre

### Limites de l'IA

⚠️ **Important** :
- L'IA **explique** et **suggère**, mais ne **décide** pas
- Les décisions finales restent de votre responsabilité
- En cas de doute, consultez toujours le RGIE officiel
- L'IA ne remplace pas un organisme de contrôle agréé

---

## 💡 Conseils et bonnes pratiques

### Organisation

1. **Commencez par créer votre société**
   - Renseignez toutes les informations légales
   - Vérifiez votre numéro de TVA

2. **Importez vos clients**
   - Ajoutez d'abord les clients réguliers
   - Complétez les coordonnées

3. **Configurez votre catalogue**
   - Ajoutez vos produits les plus utilisés
   - Définissez vos prix de vente

### Workflow recommandé

```
1. Créer le client
    ↓
2. Créer le chantier
    ↓
3. Enregistrer les interventions
    ↓
4. Prendre des photos
    ↓
5. Créer le devis
    ↓
6. Convertir en facture
```

### Gestion quotidienne

- 📅 **Chaque matin** : Consultez les chantiers du jour
- 🔧 **Après chaque intervention** : Enregistrez immédiatement les détails
- 📸 **Sur le terrain** : Prenez des photos systématiques
- 💰 **En fin de semaine** : Créez les devis et factures
- 📊 **En fin de mois** : Vérifiez les paiements et relances

### Sécurité

- 🔐 Changez votre mot de passe régulièrement
- 🚪 Déconnectez-vous en fin de session
- 💾 Les données sont automatiquement sauvegardées
- 🔒 Ne partagez jamais vos identifiants

### Performance

- 🚀 Utilisez les filtres pour accélérer les recherches
- 📱 L'application est responsive (utilisable sur mobile/tablette)
- 💾 Les fichiers volumineux peuvent ralentir l'upload
- ♻️ Archivez les anciens chantiers pour alléger l'interface

### Support

En cas de problème :
1. Consultez ce guide
2. Vérifiez que le backend et frontend sont démarrés
3. Consultez les logs du navigateur (F12)
4. Contactez votre administrateur système

---

## 📞 Contact et assistance

### Informations techniques

- **Backend** : Spring Boot 3.5.8 (Java 21)
- **Frontend** : Next.js 16 (React 19)
- **Base de données** : PostgreSQL (production), H2 (développement)

### Auteur

**Christophe Seyler**
Électricien – Développeur – IoT – RGIE
Belgique

---

## 🎓 Ressources complémentaires

### Documentation technique

- [`README.md`](README.md) : Documentation développeur
- `/api-docs` : Documentation OpenAPI (Swagger)
- Logs backend : `backend/logs/`

### Références RGIE

- [RGIE officiel](https://economie.fgov.be/) : Site du SPF Économie
- Articles RGIE 2025 intégrés dans l'application

---

## 🚀 Pour aller plus loin

### Modules à activer

Selon vos besoins, activez :
- **Facturation Peppol** : Facturation électronique B2B
- **Gestion du stock avancée** : Mouvements, inventaires
- **Planning** : Calendrier des interventions
- **Rapports** : Statistiques et exports

### Intégrations futures

- 📧 Envoi automatique de devis par email
- 📱 Application mobile native
- 🔗 Synchronisation comptabilité
- ☁️ Sauvegarde cloud

---

<div align="center">
  <p>Merci d'utiliser <strong>WebElec SaaS</strong> !</p>
  <p><em>Pour toute question, n'hésitez pas à consulter la documentation ou contacter le support.</em></p>
</div>
