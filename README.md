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
- `pom.xml` : gestion des dépendances et configuration Java 21


## Prochaines étapes suggérées

- ~~Ajouter les entités restantes (Intervention, Produit avancé, Devis, Facture) en suivant le même pattern Repository/Service/Controller.~~ ✅
- Séparer les profils Spring (dev/test/prod) et intégrer PostgreSQL dans vos pipelines CI/CD.

## Frontend WebElec (Next.js)

## Pré-requis

- Node.js 20+
## Prochaines étapes suggérées
- ~~Ajouter les entités restantes (Intervention, Produit avancé, Devis, Facture) en suivant le même pattern Repository/Service/Controller.~~ ✅
- ~~Introduire des DTO + validation Bean Validation pour exposer des contrats stables au front.~~ ✅
- Séparer les profils Spring (dev/test/prod) et intégrer PostgreSQL dans vos pipelines CI/CD.
  
# ou npm run build && npm run start pour la prod

## Pré-requis
- Node.js 20+
- Backend Spring Boot en cours d’exécution sur `http://localhost:8080` (base API par défaut `http://localhost:8080/api`, modifiable via `NEXT_PUBLIC_API_URL`)

NEXT_PUBLIC_API_URL="http://localhost:8080/api"
```bash
npm install
npm run dev
# ou npm run build && npm run start pour la prod
```
Ouvrir http://localhost:3000.

- Endpoints de test/proxy : `GET/POST /api/test/chantiers` et `GET/POST /api/test/produits` qui forwardent vers le backend Spring (pratique pour tester le back depuis le front).

## API consommée (backend Spring)

Contrat principal actuellement branché dans le front : **Sociétés**.

DTOs exposés côté backend :
- `SocieteResponse` (sortie) : `id`, `nom`, `tva`, `email?`, `telephone?- DTO TypeScript (`types`) : toutes les structures sont regroupées et exportées via `@/types` (voir `types/dto/*`), alignées sur les DTO backend.
- Endpoints de test/proxy : `GET/POST /api/test/chantiers` et `GET/POST /api/test/produits` qui forwardent vers le backend Spring (pratique pour tester le back depuis le front).

## API consommée (backend Spring)
Contrat principal actuellement branché dans le front : **Sociétés**.

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
``ackend STests manuels rapides
- Lancer le backend Spring, puis le front (`npm run dev`). (`npm run dev`).
- Utiliser le panneau “Sociétés” sur la page d’accueil pour créer et supprimer (les champs obligatoires sont *Nom* et *TVA*).
- Tester directement le backend Spring via cURL :
  - `curl http://localhost:8080/api/societes`
  - `curl -X POST -H "Content-Type: application/json" -d '{"nom":"WebElec","tva":"BE0123456789","email":"contact@webelec.be","telephone":"0470/00.00.00","adresse":"Rue des Artisans 12, Liège"}' http://localhost:8080/api/societes`
  - `curl -X DELETE http://localhost:8080/api/societes/<id>`
- Tester les proxys front vers le backend :
  - `curl http://localhost:3000/api/test/chantiers`
  - `curl -X POST -H "Content-Type: application/json" -d '{"nom":"Installation nouvelle cuisine","adresse":"Rue du Four 15, 4000 Liège","description":"Tableau secondaire + circuit prises + éclairage LED","societeId":1}' http://localhost:3000/api/test/chantiers`
  - `curl http://localhost:3000/api/test/produits`
  


## Architecture globale
```mermaid
graph TD
    style COL1 fill:#f9f,stroke:#333,stroke-width:1px

    %% =====================================================
    %%   COLONNE 1 — INTERFACE (prise / utilisateur)
    %% =====================================================
    subgraph COL1[Colonne 1 – Interface / Utilisateur]
        U["👤 Utilisateurs"]
        NX["🔌 Next.js<br/>UI + IA"]
        U --> NX
    end


    %% =====================================================
    %%   COLONNE 2 — TGBT (Disjoncteur principal / CPU)
    %% =====================================================
    subgraph COL2[Colonne 2 – Tableau principal (Backend)]
        SP["⚡ Spring Boot<br/>(Disjoncteur général / CPU)"]
        DB[":|: PostgreSQL<br/>(Barre de mesure / Bus)"]
        NX --> SP
        SP --> DB
    end


    %% =====================================================
    %%   COLONNE 3 — AUTOMATION (Relais / Automatismes)
    %% =====================================================
    subgraph COL3[Colonne 3 – Automatisation / IA]
        N8["🔁 n8n<br/>(Automate / Relais logique)"]
        B2["📁 Backblaze B2<br/>(Stockage / Archivage)"]
        DB --> N8
        N8 --> B2
        SP --> N8
        N8 --> SP
    end


    %% =====================================================
    %%   COLONNE 4 — TERRAIN (Capteurs / Actionneurs)apteur%% ===================================================== =====================================================
    subgraph COL4[Colonne 4 – Terrain IoT]
        MQ["📡 MQTT Broker<br/>ESP32 / Capteurs"]
        MQ --> SP
        MQ --> N8
    end

    %% =====================================================
    %%   CONNEXIONS OPTIONNELLES (Bus auxiliaire)
    %% =====================================================
    NX -. Bus auxiliaire .-> N8
    N8 -. Retour info .-> NX

