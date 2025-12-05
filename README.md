# WebElec SaaS

<div align="center">
  <img src="https://img.icons8.com/color/96/000000/electrical--v2.png" alt="Logo électricien" />
  <br />
  <h3>Plateforme de gestion pour artisans électriciens</h3>
</div>

---

## 🔌 Vue d’ensemble

WebElec SaaS est une application conçue pour les électriciens et petites PME techniques.  
L'objectif : regrouper dans une seule interface les éléments essentiels du métier.

Fonctionnalités prévues :

- Gestion des sociétés  
- Clients & chantiers  
- Interventions  
- Devis & factures  
- Pièces justificatives (photos, PDF, tickets…)  
- Conformité électrique (RGIE 2025)  
- Intégration Peppol (facturation électronique)

Techno utilisées :

- **Frontend :** Next.js + TypeScript  
- **Backend :** Spring Boot 3.5 (Java 21)  
- **Base de données :** H2 (dev) → PostgreSQL (prod)

    Frontend --> Backend[Backend (Spring Boot)]
    Backend --> Database[(Base de Données)]

## 🔧 Backend Spring Boot

Ce dépôt contient une API Spring Boot minimaliste (Java 21) qui sert de squelette pour des services REST avec persistance JPA.

## Pile technique

- **Spring Boot 3.5.8** avec starters Web, Data JPA, Validation et Test
- **Base de données**: PostgreSQL en production, H2 en mémoire pour le développement
- **Lombok** pour réduire le code boilerplate
- **DevTools** pour le rechargement à chaud en local

## Prérequis

- Java 21 (JDK complet)
- Maven Wrapper inclus (`mvnw`/`mvnw.cmd`)
- PostgreSQL optionnel si vous souhaitez persister les données hors H2

## Configuration

La configuration par défaut (`src/main/resources/application.yml`) active H2 en mémoire et met Hibernate en `ddl-auto:update`. Pour utiliser PostgreSQL, remplacez les propriétés `spring.datasource.*` par vos valeurs (URL, utilisateur, mot de passe) et désactivez H2.

## Démarrage rapide

```bash
mvnw.cmd spring-boot:run
```

```bash
./mvnw spring-boot:run
```

L'application démarre sur <http://localhost:8080>.

## Tests

```bash
mvnw.cmd test
```

```bash
./mvnw test
```

## Fonctionnalités métier

- **Sociétés** : CRUD de base via `/api/societes` (déjà existant dans le squelette initial).
- **Chantiers** : `/api/chantiers` pour lister, créer, filtrer par société (`/societe/{id}`) et supprimer.
- **Produits (stock)** : `/api/produits` avec filtres par société, création, mise à jour et suppression.
- **Clients** : `/api/clients` avec les mêmes opérations (GET/POST/PUT/DELETE) et filtre `/societe/{id}`.
  _Toutes ces ressources utilisent désormais des DTOs validés côté backend pour garantir des contrats stables (voir dossier `dto/`)._
- **Interventions** : `/api/interventions` + filtres `/societe/{id}` et `/chantier/{id}` avec PUT/DELETE.
- **Produits avancés** : `/api/produits-avances` pour gérer le catalogue enrichi (prix achat/vente, fournisseur).
- **Devis** : `/api/devis` avec filtres `/societe/{id}`/`/client/{id}`, gestion des lignes (`DevisLigne`).
- **Factures** : `/api/factures` similaires aux devis mais avec échéance/statut d'encaissement.

👉 Spec OpenAPI (Next.js friendly) : `src/main/resources/api-spec.yaml`

### Contrat API Société (`/api/societes`)

**DTOs exposés**

- `SocieteRequest` (payload entrant)
  - `nom` _(string, obligatoire, ≤255)_
  - `tva` _(string, obligatoire, ≤32)_
  - `email` _(string, optionnel, format email, ≤255)_
  - `telephone` _(string, optionnel, regex `^[0-9+().\\/\\-\\s]{6,30}$`)_
  - `adresse` _(string, optionnel, ≤512)_
- `SocieteResponse` (payload sortant)
  - `id`, `nom`, `tva`, `email`, `telephone`, `adresse`

**Endpoints**

1. `GET /api/societes` → `200 OK` avec `List<SocieteResponse>`
2. `GET /api/societes/{id}` → `200 OK` avec un `SocieteResponse` ou `404` si introuvable
3. `POST /api/societes`

   ```json
   {
     "nom": "WebElec",
     "tva": "BE0123456789",
     "email": "contact@webelec.be",
     "telephone": "0470/00.00.00",
     "adresse": "Rue des Artisans 12, Liège"
   }
   ```

   Réponse `200 OK` (pour l’instant) contenant le `SocieteResponse`
4. `DELETE /api/societes/{id}` → `204 No Content` si la suppression réussit, `404 Not Found` si l'identifiant n'existe pas

**Format d’erreur global** (`ApiError`)

```json
{
  "timestamp": "2025-12-01T22:15:37.123Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Requête invalide",
  "details": [
    "nom: Le nom de la société est obligatoire",
    "tva: La TVA est obligatoire"
  ]
}
```

- `400 Bad Request` : violations Bean Validation (liste dans `details`)
- `404 Not Found` : identifiant inexistant (`message` contient la raison via `ResourceNotFoundException`)
- `500 Internal Server Error` : erreur inattendue côté serveur

## Exemples de payloads

```json
POST /api/chantiers
{
  "nom": "Installation nouvelle cuisine",
  "adresse": "Rue du Four 15, 4000 Liège",
  "description": "Tableau secondaire + circuit prises + éclairage LED",
  "societeId": 1
}
```

```json
POST /api/produits
{
  "reference": "REF-001",
  "nom": "Disjoncteur 16A",
  "description": "Courbe C",
  "quantiteStock": 25,
  "prixUnitaire": 14.90,
  "societeId": 1
}
```

```json
POST /api/clients
{
  "nom": "Dupont",
  "prenom": "Alice",
  "email": "alice.dupont@example.com",
  "telephone": "0470/11.22.33",
  "adresse": "Rue des Artisans 12, 4000 Liège",
  "societeId": 1
}
```

```json
POST /api/interventions
{
  "titre": "Dépannage tableau",
  "description": "Remplacement disjoncteur",
  "dateIntervention": "2025-01-15",
  "societe": { "id": 1 },
  "chantier": { "id": 3 },
  "client": { "id": 5 }
}
```

```json
POST /api/devis
{
  "numero": "DEV-2025-001",
  "dateEmission": "2025-01-02",
  "dateExpiration": "2025-01-31",
  "montantHT": 1200.00,
  "montantTVA": 252.00,
  "montantTTC": 1452.00,
  "statut": "DRAFT",
  "societe": { "id": 1 },
  "client": { "id": 5 },
  "lignes": [
    { "description": "Tableau électrique", "quantite": 1, "prixUnitaire": 900, "total": 900 }
  ]
}
```

```json
POST /api/factures
{
  "numero": "FAC-2025-015",
  "dateEmission": "2025-02-10",
  "dateEcheance": "2025-03-10",
  "montantHT": 2000.00,
  "montantTVA": 420.00,
  "montantTTC": 2420.00,
  "statut": "SENT",
  "societe": { "id": 1 },
  "client": { "id": 5 },
  "lignes": [
    { "description": "Câblage IT", "quantite": 2, "prixUnitaire": 1000, "total": 2000 }
  ]
}
```

## Structure

- `src/main/java/com/webelec/backend/BackendApplication.java` : point d'entrée Spring Boot
- `src/main/resources` : configuration (`application.yml`), gabarits et ressources statiques
- `pom.xml` : gestion des dépendances et configuration Java 21

## Prochaines étapes suggérées

- ~~Ajouter les entités restantes (Intervention, Produit avancé, Devis, Facture) en suivant le même pattern Repository/Service/Controller.~~ ✅
- ~~Introduire des DTO + validation Bean Validation pour exposer des contrats stables au front.~~ ✅
- Séparer les profils Spring (dev/test/prod) et intégrer PostgreSQL dans vos pipelines CI/CD.
  
## 🎨 Frontend WebElec (Next.js)

## Pré-requis

- Node.js 20+
- Backend Spring Boot en cours d’exécution sur `http://localhost:8080` (base API par défaut `http://localhost:8080/api`, modifiable via `NEXT_PUBLIC_API_URL`)

## Démarrer le front

```bash
npm install
npm run dev
# ou npm run build && npm run start pour la prod
```

Ouvrir <http://localhost:3000>.

Configurez l’URL du backend avec la variable d’environnement côté client :

```bash
NEXT_PUBLIC_API_URL="http://localhost:8080/api"
```

## Fonctionnalités

- Mode clair/sombre avec mémorisation locale (toggle en haut à droite).
- Panneau de test des sociétés : listage/ajout/suppression via les DTO Spring `SocieteRequest` / `SocieteResponse`.
- Clients API front (`lib/api`) : helpers typés pour auth, sociétés, clients, chantiers, interventions, devis, factures, catalogue (produits + produits avancés), pièces, RGIE, Peppol, notifications. Point d’entrée commun `lib/api/base.ts` (fetch JSON, headers, no-store).
- DTO TypeScript (`types`) : toutes les structures sont regroupées et exportées via `@/types` (voir `types/dto/*`), alignées sur les DTO backend.
- Endpoints de test/proxy : `GET/POST /api/test/chantiers` et `GET/POST /api/test/produits` qui forwardent vers le backend Spring (pratique pour tester le back depuis le front).

## API consommée (backend Spring)

Contrat principal actuellement branché dans le front : **Sociétés**.

DTOs exposés côté backend :

- `SocieteRequest` (entrée) : `nom` (string, obligatoire, ≤255), `tva` (string, obligatoire, ≤32), `email?` (email, ≤255), `telephone?` (regex `^[0-9+().\\/\\-\\s]{6,30}$`), `adresse?` (≤512).
- `SocieteResponse` (sortie) : `id`, `nom`, `tva`, `email?`, `telephone?`, `adresse?`.

Endpoints consommés par le front :

- `GET /api/societes` → `SocieteResponse[]` (liste toutes les sociétés).
- `GET /api/societes/{id}` → `SocieteResponse` ou 404 si introuvable.
- `POST /api/societes` → crée une société (JSON `SocieteRequest`).
- `DELETE /api/societes/{id}` → 204 No Content si suppression OK, 404 sinon.

Format d’erreur global (simplifié, renvoyé par Spring) :

```json
{
  "timestamp": "2025-12-01T22:15:37.123Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Requête invalide",
  "details": [
    "nom: Le nom de la société est obligatoire",
    "tva: La TVA est obligatoire"
  ]
}
```

## Tests manuels rapides

- Lancer le backend Spring, puis le front (`npm run dev`).
- Utiliser le panneau “Sociétés” sur la page d’accueil pour créer et supprimer (les champs obligatoires sont _Nom_ et _TVA_).
- Tester directement le backend Spring via cURL :
  - `curl http://localhost:8080/api/societes`
  - `curl -X POST -H "Content-Type: application/json" -d '{"nom":"WebElec","tva":"BE0123456789","email":"contact@webelec.be","telephone":"0470/00.00.00","adresse":"Rue des Artisans 12, Liège"}' http://localhost:8080/api/societes`
  - `curl -X DELETE http://localhost:8080/api/societes/<id>`
- Tester les proxys front vers le backend :
  - `curl http://localhost:3000/api/test/chantiers`
  - `curl -X POST -H "Content-Type: application/json" -d '{"nom":"Installation nouvelle cuisine","adresse":"Rue du Four 15, 4000 Liège","description":"Tableau secondaire + circuit prises + éclairage LED","societeId":1}' http://localhost:3000/api/test/chantiers`
  - `curl http://localhost:3000/api/test/produits`
  - `curl -X POST -H "Content-Type: application/json" -d '{"reference":"REF-001","nom":"Disjoncteur 16A","description":"Courbe C","quantiteStock":25,"prixUnitaire":14.90,"societeId":1}' http://localhost:3000/api/test/produits`
  
  
  
  
  🌩️ WebElec – Plateforme SaaS pour Électriciens Belges (RGIE 2025, IoT, ERP)

WebElec est une plateforme SaaS conçue pour les artisans électriciens, PME techniques et bureaux d’étude.
Elle centralise la gestion des clients, chantiers, interventions, documents, conformité RGIE, et intègre un module IoT (ESP32 + MQTT) pour remonter les mesures en temps réel.

Une seule application, pensée pour le terrain, compatible smartphone, et conforme aux bonnes pratiques du métier.

⚡ Objectifs du projet

Offrir à l’électricien un outil simple, fiable et rapide

Standardiser la conformité RGIE Livre 1 (2025) sans interprétations hasardeuses

Numériser les chantiers (photos, documents, schémas, mesures)

Connecter les installations au cloud via ESP32 / MQTT

Fournir un ERP technique complet, mais accessible

🧱 Architecture générale

Le projet WebElec est composé de quatre modules principaux :

/frontend       → Application Next.js (App Router, TypeScript, Tailwind, shadcn/ui)
/backend        → API Spring Boot 3.5 (Java 21, PostgreSQL, JPA)
/database       → Scripts SQL, seeds, migrations, configuration Postgres
/iot            → Code ESP32, MQTT topics, flux Node-RED, formats JSON


Un projet modulaire, clair, extensible.

🎨 Frontend – Next.js 15 (App Router)

Le frontend constitue l’interface utilisateur moderne, responsive, et optimisée pour une utilisation sur chantier.

Technologies :

Next.js 15+ (App Router, Server Components)

TypeScript strict

Tailwind CSS

shadcn/ui

Charts/IoT clients (MQTT/WebSockets)

Actions serveur pour le métier électrique

Principales fonctionnalités :

Gestion des sociétés, clients, chantiers, interventions

Upload de photos, documents, schémas

Dashboard RGIE (circuits, protections, articles associés)

Affichage en temps réel des mesures IoT

Support mobile complet

🔧 Backend – Spring Boot 3.5 (Java 21)

Le backend fournit l’intelligence métier, la sécurité, la gestion des données et la conformité.

Technologies :

Spring Boot 3.5

Spring Web

Spring Validation

JPA / Hibernate

PostgreSQL

Swagger / OpenAPI

Modules fournis :

API REST sécurisée

Gestion chantiers / clients / interventions

Stockage des documents (selon implémentation)

Vérifications RGIE (via règles ou articles chargés)

Synchronisation IoT

🗄️ Base de données – PostgreSQL

Le dossier database/ contient :

Scripts SQL de création

Seeds métiers (fournisseurs, produits, index RGIE, clients de test)

Migrations Flyway / Liquibase

Configuration dockerisée : Postgres + PGAdmin

L’objectif : une base propre, structurée, avec données minimales pour tests et démos.

📡 IoT – ESP32, MQTT, Node-RED

Le dossier iot/ centralise tout le module connecté :

Firmware ESP32 pour capteurs et mesures

Topics MQTT officiels WebElec

Flux Node-RED (ETL léger, automatisations)

Schémas JSON des données mesurées

Exemple de dashboard temps réel

L’IoT n’est plus une usine à gaz : simple, stable, prévisible.

📚 Documentation et RGIE

Le dossier docs/ contient :

Articles RGIE (fournis par l’utilisateur, aucun inventé)

Documentation API (OpenAPI)

Schémas UML / PlantUML / Mermaid

Guides techniques pour installation du SaaS

Architecture du projet

Ton dossier rgie/ contient les données officielles, sans extrapolation.
C’est ton "référentiel métier".

🧪 Qualité, CI/CD, Sécurité

Le dossier .github/ inclut :

Workflows GitHub Actions (tests, build, déploiement)

Instructions IA anti-hallucinations

Templates d’issues et PR

Ton SaaS s’inscrit dans une approche sérieuse : cohérence, traçabilité, zéro surprise.

🐋 Déploiement

Plusieurs options :

1. Docker Compose (recommandé)

Un fichier deployments/docker-compose.yml orchestre :

frontend (Next.js)

backend (Spring Boot)

database (Postgres)

pgadmin

mqtt (Eclipse Mosquitto)

2. VPS (Hostinger, OVH, Hetzner)

Reverse proxy avec Nginx + certificats Let’s Encrypt.

3. Kubernetes (optionnel)

Des manifestes sont fournis dans deployments/k8s/.

🛠️ Scripts utiles

Dans scripts/ :

safe-push.ps1 : push Git sécurisé

deploy-vps.sh : déploiement automatisé

backup-db.sh : sauvegarde Postgres

init-dev.ps1 : préparation machine dev

🚀 Roadmap (2025)

 Module devis + factures (Peppol EN16931)

 Intégration AI (diagnostic + automatisation)

 Gestion du stock et catalogue matériel

 Générateur de schémas unifilaires

 Application mobile (React Native ?)

 Monitoring IoT avancé

🏗️ Objectif final

Faire de WebElec l’outil de référence pour l’électricien belge :

Simple

Conforme

Mobile

Connecté

Sans surprises

Un SaaS fait par un électricien, pour des électriciens.

📞 Contact (exemple)

Christophe Seyler
Développeur & Électricien (Belgique)
GSM : 0497 50 65 36
Email : christophe.seyler@webelec.be

Souhaites-tu maintenant :

La version courte du README (30 lignes) ?

La version orientée investisseurs / professionnels ?

La version "marketing site Web" ?

Un README séparé Front / Back / IoT / Database ?

Je peux également générer le fichier docker-compose complet si tu veux passer en mode déploiement.

Vous avez dit :
comment je fais un redame de ça, copie colle ?
ChatGPT a dit :

Oui, exactement : tu crées un fichier README.md → tu colles le contenu → et c’est fini.
GitHub se charge de l’afficher automatiquement.

Voici comment faire proprement, étape par étape :

1) À la racine de ton projet

Dans ton dossier :

webelec-saas/


tu crées un fichier :

README.md


(avec un éditeur comme VS Code, un clic droit → New File → README.md)

2) Tu ouvres ce fichier

Puis tu colles entièrement le texte du README que je t’ai préparé.

Exemple dans VS Code :

Ouvrir VS Code

Cliquer sur README.md

Coller le texte

Sauvegarder (Ctrl + S)

3) GitHub le détecte automatiquement

Une fois que tu pushes ton projet :

git add README.md
git commit -m "Ajout du README WebElec"
git push


→ GitHub affichera ton README en page d’accueil du repo, sans configuration supplémentaire.

4) Tu veux le voir en aperçu local ?

Dans VS Code, clique en haut à droite :
“Open Preview” (icône de loupe).
Tu verras le rendu final comme sur GitHub.

5) Résumé

Oui, tu copies-colles.

Tu mets ça dans un fichier README.md.

Tu le commits.

GitHub l'affiche automatiquement.

Rien de plus à faire.