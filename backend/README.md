# WebElec – Backend Spring Boot

Backend du SaaS WebElec pour électriciens belges. L'API est écrite en Java 21 avec Spring Boot 3.5, expose des services REST alignés sur les règles RGIE fournies dans le projet, et persiste les données dans PostgreSQL. Ce document présente la pile technique, la configuration des profils, les commandes de lancement et l'état fonctionnel actuel.

---

## 1. Aperçu rapide
- **Langage** : Java 21
- **Framework** : Spring Boot 3.5.x (Web, Data JPA, Validation)
- **Base de données** : PostgreSQL 16 (Docker) + H2 en mémoire pour les tests rapides
- **Build** : Maven 3.9+ via `mvnw`/`mvnw.cmd`
- **Tests** : JUnit 5, MockMvc, Testcontainers PostgreSQL
- **Spécification API** : `src/main/resources/api-spec.yaml`

L'application suit la structure standard `controller → service → repository → model → dto`, sans mélanger les couches.

---

## 2. Architecture applicative
```
src/main/java/com/webelec/backend/
 ├─ controller/   # Endpoints REST (Société, Client, Chantier, Produit, etc.)
 ├─ service/      # Logique métier & règles RGIE confirmées
 ├─ repository/   # Interfaces JpaRepository
 ├─ model/        # Entités JPA persistées
 ├─ dto/          # DTO exposés aux clients + Bean Validation
 └─ BackendApplication.java
```
Les tests sont regroupés dans `src/test/java/com/webelec/backend/` par couche (controllers, services, dto) avec un test d'intégration `DatabaseConnectionTest` basé sur Testcontainers.

---

## 3. Prérequis
1. **Java 21** (JDK complet installé et dans le PATH)
2. **Maven Wrapper** (`mvnw.cmd` sous Windows, `./mvnw` sous Linux/macOS)
3. **Docker Desktop** (pour PostgreSQL + Testcontainers)
4. **PostgreSQL client** optionnel (`psql`) pour diagnostiquer les connexions

---

## 4. Configuration des profils Spring
Les propriétés communes vivent dans `src/main/resources/application.yml`. Les profils spécialisés sont situés dans `application-dev.yml`, `application-prod.yml` et `application-test.yml` (optionnel).

| Profil | Usage | Source principale | Particularités |
| --- | --- | --- | --- |
| `dev` | Développement local | `application-dev.yml` | Connexion au PostgreSQL Docker, `ddl-auto=update`, logs SQL actifs |
| `test` | Tests automatisés | Testcontainers via annotations | PostgreSQL éphémère, pas de config externe requise |
| `prod` | Déploiement VPS/Cloud | `application-prod.yml` | Credentials fournis via variables d'environnement, `ddl-auto=validate` |

Variables d'environnement attendues en production : `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`.

---

## 4bis. Authentification et sécurité (décembre 2025)

### Endpoints publics
- `POST /api/auth/login` — Connexion
- `POST /api/auth/register` — Inscription  
- `POST /api/auth/refresh` — Rafraîchissement du token
- `GET /api/auth/me` — Profil de l'utilisateur connecté

### Sécurité des endpoints
Tous les autres endpoints nécessitent un **token JWT** dans le header :
```
Authorization: Bearer <token>
```

### Codes de réponse sécurité
| Code | Signification |
|------|---------------|
| `401` | Non authentifié (token absent ou expiré) |
| `403` | Accès refusé (rôle insuffisant) |

### Exemple de requête authentifiée
```bash
# 1. Login
curl.exe -X POST http://localhost:8080/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@webelec.be\",\"password\":\"admin123\"}"

# 2. Utiliser le token reçu
curl.exe -X GET http://localhost:8080/api/societes ^
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..."
```

---

## 5. Lancer l'environnement
### 5.1 Base de données PostgreSQL (Docker)
Depuis le répertoire contenant le `docker-compose.yml` (ou en utilisant une commande `docker run` équivalente) :
```bash
docker compose up -d postgres
```
Paramètres recommandés : base `webelec_db`, utilisateur `webelec`, mot de passe `webelec_pwd`, port `5432`.

### 5.2 Démarrer l'API en profil `dev`
Sous Windows :
```bash
mvnw.cmd spring-boot:run -Dspring.profiles.active=dev
```
Sous Linux/macOS :
```bash
./mvnw spring-boot:run -Dspring.profiles.active=dev
```
L'API écoute sur `http://localhost:8080`.

### 5.3 Vérifier la connexion PostgreSQL
```bash
psql -h localhost -U webelec -d webelec_db
```
En cas de besoin, ajustez les propriétés `spring.datasource.*` dans `application-dev.yml` pour refléter vos valeurs locales.

---

## 6. Seed et données d'exemple
`DataSeeder` insère des sociétés de démonstration au démarrage seulement si la table est vide. La liste est configurable dans `application.yml` :
```yaml
webelec:
  seed:
    societes:
      - nom: "ElecPro"
        tva: "FR12345678901"
        email: "contact@elecpro.fr"
        telephone: "01 23 45 67 89"
        adresse: "12 rue des Ouvriers, Paris"
```
Champs requis : `nom`, `tva`. Les autres champs sont optionnels. Ajoutez autant d'entrées que nécessaire.

---

## 7. Tests automatisés
### 7.1 Tests unitaires et MockMvc
Les tests couvrent :
- DTO (`src/test/java/com/webelec/backend/dto/`) pour garantir les conversions entité ⇄ DTO
- Services (`src/test/java/com/webelec/backend/service/`)
- Contrôleurs (`src/test/java/com/webelec/backend/controller/`) via MockMvc (statuts 200/400/404/409/204)

### 7.2 Testcontainers PostgreSQL
`DatabaseConnectionTest` démarre un conteneur PostgreSQL 16, injecte dynamiquement l'URL JDBC et valide la connexion `DataSource`.

### 7.3 Commandes utiles
Sous Windows :
```bash
mvnw.cmd clean test -Dspring.profiles.active=test
```
Sous Linux/macOS :
```bash
./mvnw clean test -Dspring.profiles.active=test
```
Après configuration du plugin Surefire avec `spring.profiles.active=test`, l'option `-Dspring.profiles.active=test` devient facultative.

Résultat attendu actuel : 69 tests, BUILD SUCCESS.

---

## 8. Ressources REST disponibles
Chaque ressource expose des DTO validés (@NotBlank, @Email, etc.) et un format d'erreur commun `ApiError`.

| Ressource | Endpoint principal | Fonctions clés |
| --- | --- | --- |
| Sociétés | `/api/societes` | CRUD complet + validation TVA, filtre par ID |
| Utilisateurs | `/api/utilisateurs` | CRUD, filtrage par société, rôles textuels |
| Clients | `/api/clients` | CRUD, filtre `/societe/{id}` |
| Chantiers | `/api/chantiers` | Listing, création, filtre par société/chantier |
| Produits (stock) | `/api/produits` | Gestion du stock, filtres société |
| Produits avancés | `/api/produits-avances` | Catalogue enrichi (prix achat/vente, fournisseur) |
| Interventions | `/api/interventions` | Filtres `/societe/{id}` et `/chantier/{id}` |
| Devis | `/api/devis` | Gestion des lignes, filtres société/client |
| Factures | `/api/factures` | Statuts d'encaissement, filtres société/client |

Pour des exemples de payloads et le contrat détaillé, consultez `src/main/resources/api-spec.yaml` ou les tests MockMvc correspondants.

---

## 8bis. Payloads attendus par endpoint

Chaque endpoint REST attend un payload JSON conforme au DTO exposé. Les champs requis et optionnels sont strictement alignés sur le métier ; ne jamais inventer de structure ou de champ non présent dans le code ou l'OpenAPI.

### Sociétés (`/api/societes`) — Documentation complète

#### Permissions par rôle

| Endpoint | ADMIN | GERANT | TECHNICIEN | Non auth |
|----------|:-----:|:------:|:----------:|:--------:|
| `GET /api/societes` | ✅ (toutes) | ✅ (ses sociétés) | ✅ (ses sociétés) | ❌ 401 |
| `GET /api/societes/{id}` | ✅ | ✅ (si membre) | ✅ (si membre) | ❌ 401 |
| `POST /api/societes` | ✅ | ❌ 403 | ❌ 403 | ❌ 401 |
| `PUT /api/societes/{id}` | ✅ | ✅ (si membre) | ❌ 403 | ❌ 401 |
| `DELETE /api/societes/{id}` | ✅ | ❌ 403 | ❌ 403 | ❌ 401 |

#### Champs du payload

| Champ | Type | Obligatoire | Validation | Exemple |
|-------|------|:-----------:|------------|---------|
| `nom` | string | ✅ | max 255 car. | `"WebElec SPRL"` |
| `tva` | string | ✅ | max 32 car. | `"BE0123456789"` |
| `email` | string | ❌ | format email, unique | `"contact@webelec.be"` |
| `telephone` | string | ❌ | 6-30 car., format `[0-9+()-./\s]` | `"+32 2 123 45 67"` |
| `adresse` | string | ❌ | max 512 car. | `"Rue de l'Électricité 42"` |

#### Exemples

**✅ Création valide (ADMIN requis)** :
```bash
curl.exe -X POST http://localhost:8080/api/societes ^
  -H "Authorization: Bearer <token>" ^
  -H "Content-Type: application/json" ^
  -d "{\"nom\":\"WebElec SPRL\",\"tva\":\"BE0123456789\",\"email\":\"contact@webelec.be\"}"
```

**✅ Exemple minimal** :
```json
{
  "nom": "Ma Société",
  "tva": "BE9876543210"
}
```

**❌ Exemple invalide** (nom vide → 400) :
```json
{
  "nom": "",
  "tva": "BE0123456789"
}
```
Réponse :
```json
{
  "timestamp": "2025-12-27T10:00:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Requête invalide",
  "details": ["nom: Le nom de la société est obligatoire"]
}
```

**❌ Email déjà utilisé** → 409 :
```
"Email déjà utilisé"
```

### Utilisateurs (`/api/utilisateurs`)
- **POST /api/utilisateurs**
  ```json
  {
    "nom": "Dupont",
    "prenom": "Alice",
    "email": "alice.dupont@example.com",
    "societeId": 1,
    "role": "USER"
  }
  ```
  Champs requis : `nom`, `prenom`, `email`, `societeId`, `role`.

### Clients (`/api/clients`)
- **POST /api/clients**
  ```json
  {
    "nom": "Martin",
    "prenom": "Jean",
    "societeId": 1,
    "email": "jean.martin@example.com",
    "telephone": "06 12 34 56 78"
  }
  ```
  Champs requis : `nom`, `societeId`. Les autres sont optionnels.

### Chantiers (`/api/chantiers`)
- **POST /api/chantiers**
  ```json
  {
    "nom": "Rénovation bureau",
    "societeId": 1,
    "clientId": 2,
    "adresse": "24 avenue des Artisans, Bruxelles"
  }
  ```
  Champs requis : `nom`, `societeId`, `clientId`.

### Produits (`/api/produits`)
- **POST /api/produits**
  ```json
  {
    "nom": "Disjoncteur 16A",
    "societeId": 1,
    "quantite": 10,
    "reference": "LEGRAND-1234"
  }
  ```
  Champs requis : `nom`, `societeId`, `quantite`.

### Authentification (`/api/auth`)
- **POST /api/auth/login**
  ```json
  {
    "email": "user@example.com",
    "password": "monmotdepasse"
  }
  ```
  Champs requis : `email`, `password`.

---

Pour chaque endpoint, adapter le payload selon le DTO exposé dans le projet. Pour les endpoints avancés (devis, factures, interventions, produits avancés), se référer au fichier `src/main/resources/api-spec.yaml` pour les exemples précis et complets.

Impossible de générer cette logique : règle RGIE non fournie dans le projet.

---

## 8ter. Format d'erreur (ApiError)

Toutes les erreurs sont normalisées via `ApiError` :

```json
{
  "timestamp": "2025-12-27T11:00:00Z",
  "status": 409,
  "error": "Conflict",
  "message": "Email déjà utilisé",
  "details": [],
  "path": "/api/societes"
}
```

- `timestamp` : horodatage ISO 8601
- `status` / `error` : code HTTP et libellé officiel
- `message` : texte exploitable côté front (pas de stacktrace)
- `details` : liste des champs invalides (validation)
- `path` : endpoint ayant généré l'erreur

Mapping des principales erreurs :

| Scénario | Code | Message |
|----------|------|---------|
| Validation DTO | 400 | `Requête invalide` + détails sur les champs |
| Ressource absente | 404 | `Societe non trouvée`, `Client non trouvé`, etc. |
| Conflit métier (doublon email/numéro) | 409 | Message métier ciblé |
| Non authentifié | 401 | `Token JWT invalide ou expiré` |
| Rôle insuffisant | 403 | `Accès refusé : vous n'avez pas les droits nécessaires` |
| Erreur interne | 500 | `Erreur interne inattendue` |

Le front peut s'appuyer sur ce format pour afficher les messages ou tracer les erreurs.

---

## 9. Exemples de requêtes REST (curl, Windows)
```bash
curl.exe -X GET http://localhost:8080/api/chantiers
curl.exe -X POST http://localhost:8080/api/clients ^
  -H "Content-Type: application/json" ^
  -d "{\"nom\":\"Dupont\",\"prenom\":\"Alice\",\"societeId\":1}"
```
Adaptez ces commandes à vos besoins (PUT/DELETE) ou utilisez un client comme Insomnia/Postman.

---

## 10. Bonnes pratiques appliquées
- Injection par constructeur dans toutes les classes Spring
- Validation systématique des DTO avec `@Valid`
- `ResponseEntity<?>` pour les endpoints qui retournent des statuts spécifiques
- Gestion des erreurs centralisée via `ApiError`
- Profilisation claire (`dev`, `test`, `prod`)
- Pas d'annotations dépréciées ni de dépendances non nécessaires

---

## 11. Roadmap backend
1. **Configuration Maven Surefire** pour activer automatiquement le profil `test`
2. **Pipeline CI GitHub Actions** : checkout, JDK 21, cache Maven, `mvn test`, `mvn package`
3. **Spring Security** : authentification JWT, rôles (ADMIN/TECH/USER)
4. **Versioning DB** : intégrer Flyway ou Liquibase
5. **Endpoints avancés** : IA, RGIE, PDF, IoT (après formalisation des règles métier)
6. **Observabilité** : activer metrics/health actuateurs et logs structurés

| Issue GitHub | Objectif | Priorité | Labels suggérés |
| --- | --- | --- | --- |
| `#01` – CI Pipeline | Créer un workflow GitHub Actions (build, tests, packaging) déclenché sur `main` et PR. | Haute | `ci`, `automation` |
| `#02` – Spring Security | Ajouter un module JWT avec rôles ADMIN/TECH/USER et guards sur les endpoints sensibles. | Haute | `security`, `enhancement` |
| `#03` – Flyway Migration | Introduire Flyway, versionner le schéma actuel et documenter la procédure de migration. | Haute | `database`, `migration` |
| `#04` – Test Profile Auto | Configurer Surefire/Failsafe pour injecter `spring.profiles.active=test` par défaut. | Moyenne | `testing`, `build` |
| `#05` – Observabilité | Activer Actuator (health, metrics), préparer un dashboard Grafana/Prometheus. | Moyenne | `observability`, `feature` |
| `#06` – Endpoints avancés | Définir l’étendue (IA, RGIE, PDF, IoT) puis créer des sous-issues spécifiques. | Basse | `product`, `needs-spec` |

---

## 12. Commandes récapitulatives
- Lancer en dev :
```bash
mvnw.cmd spring-boot:run -Dspring.profiles.active=dev
```
- Lancer tous les tests :
```bash
mvnw.cmd clean test -Dspring.profiles.active=test
```
- Construire le jar :
```bash
mvnw.cmd clean package -DskipTests
```
(Remplacez par `./mvnw` sous Linux/macOS.)

---

## 13. Références utiles
- `src/main/resources/application-*.yml` : configuration par profil
- `src/main/resources/api-spec.yaml` : contrat OpenAPI
- `src/test/java/com/webelec/backend/controller/*ControllerTest.java` : exemples MockMvc
- `src/test/java/com/webelec/backend/dto/*Test.java` : mapping DTO ↔ entités
- `Dockerfile` : build containerisé pour la prod

Le backend est prêt pour un branchement Next.js, l'intégration CI/CD et l'ajout de modules réglementaires RGIE lorsque les règles officielles sont disponibles dans le dépôt.

---

## À faire (backend, sécurité, roadmap)

1. Sécuriser à nouveau `/api/societes/**` dès la fin des tests front.
2. Documenter les payloads attendus pour chaque endpoint dans le README ou l’OpenAPI.
3. Finaliser la configuration CI/CD (GitHub Actions, Surefire, etc.).
4. Intégrer Flyway ou Liquibase pour le versioning de la base.
5. Activer et documenter l’observabilité (Spring Actuator, logs structurés).
6. Formaliser les règles métier RGIE et IoT avant d’ouvrir de nouveaux endpoints.
7. Vérifier la gestion des rôles et des guards sur les endpoints sensibles.
8. Compléter la documentation sur les erreurs et le format `ApiError`.

---

## 14. Intégration CI/CD (GitHub Actions)

Le backend WebElec est doté d’un workflow CI/CD automatisé :
- Build, test (profil `test`) et packaging à chaque push ou PR sur `main`/`develop`.
- JDK 21, cache Maven, artefact JAR archivé.
- Profil de test injecté automatiquement via Maven Surefire.

### Fichier de workflow
`.github/workflows/ci-backend.yml` :
```yaml
name: CI Backend WebElec
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]
jobs:
  build-test-package:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      - name: Set up JDK 21
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '21'
      - name: Cache Maven dependencies
        uses: actions/cache@v4
        with:
          path: ~/.m2/repository
          key: m2-${{ runner.os }}-${{ hashFiles('**/pom.xml') }}
          restore-keys: |
            m2-${{ runner.os }}-
      - name: Build & test (profil test)
        run: mvn -B clean test
      - name: Package (profil prod)
        run: mvn -B clean package -DskipTests
      - name: Archive JAR
        uses: actions/upload-artifact@v4
        with:
          name: backend-jar
          path: target/backend-0.0.1-SNAPSHOT.jar
```

### Configuration Maven Surefire
Le profil `test` est injecté automatiquement :
```xml
<plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-surefire-plugin</artifactId>
  <version>3.2.5</version>
  <configuration>
    <systemPropertyVariables>
      <spring.profiles.active>test</spring.profiles.active>
    </systemPropertyVariables>
  </configuration>
</plugin>
```

La CI vérifie la compilation, l’exécution des tests et archive le JAR pour déploiement.

---

## 15. Versioning de la base (Flyway)

Le projet utilise Flyway pour le versioning et la migration de la base PostgreSQL.

- Dépendance ajoutée dans le `pom.xml` :
  ```xml
  <dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
    <version>10.13.0</version>
  </dependency>
  ```
- Les scripts de migration sont placés dans : `src/main/resources/db/migration/`
- Exemple de migration initiale : `V1__init.sql`
  ```sql
  -- Migration initiale : création des tables existantes
  CREATE TABLE IF NOT EXISTS societe (
      id BIGSERIAL PRIMARY KEY,
      nom VARCHAR(255) NOT NULL,
      tva VARCHAR(32) NOT NULL,
      email VARCHAR(255),
      telephone VARCHAR(32),
      adresse VARCHAR(255)
  );
  CREATE TABLE IF NOT EXISTS client (
      id BIGSERIAL PRIMARY KEY,
      nom VARCHAR(255) NOT NULL,
      prenom VARCHAR(255),
      societe_id BIGINT NOT NULL,
      email VARCHAR(255),
      telephone VARCHAR(32),
      FOREIGN KEY (societe_id) REFERENCES societe(id)
  );
  -- Ajouter les autres tables selon le modèle métier validé
  ```
- À chaque lancement, Flyway applique automatiquement les migrations non encore exécutées.
- Adapter les scripts SQL à la structure réelle du modèle métier.

Pour toute modification du schéma, créer un nouveau fichier de migration : `V2__ajout_table_x.sql`, etc.

Documentation officielle : https://flywaydb.org/documentation/

---

## 16. Observabilité (Actuator & logs)

L’observabilité est activée via Spring Boot Actuator :
- Endpoints exposés : `/actuator/health`, `/actuator/info`, `/actuator/metrics`
- Détails de santé complets (`show-details: always`)
- Accessible en local sur `http://localhost:8080/actuator/health` etc.

Configuration dans `application.yml` :
```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics
  endpoint:
    health:
      show-details: always
```

### Logs structurés
- Niveau par défaut : INFO (root), INFO (Spring Web), WARN (SQL)
- Format console lisible :
  ```yaml
  logging:
    level:
      root: INFO
      org.springframework.web: INFO
      org.hibernate.SQL: WARN
    pattern:
      console: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n"
  ```
- Pour des logs JSON, utiliser un appender dédié (voir doc officielle Spring Boot Logging)
  [Spring Boot Logging JSON](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.logging.json)

La configuration est prête pour une intégration Grafana/Prometheus ou tout outil compatible Actuator.

---

## 17. Formalisation RGIE & IoT avant nouveaux endpoints

Avant de livrer de nouveaux endpoints liés au RGIE ou à l’IoT, réunir et valider les éléments suivants :
1. **Spécifications RGIE officielles** : article, paragraphe, version 2025, seuils/chiffres exacts, cas d’application.
2. **Modélisation métier** : entités concernées (circuits, protections, capteurs, etc.), relations exactes, règles d’orchestration.
3. **Flux IoT documentés** : topic MQTT, payload JSON, unités (V, A, °C), fréquence d’échantillonnage, mécanismes d’authentification.
4. **Plan de tests** : scénarios fonctionnels, jeux de données conformes, critères de validation (statuts, alarmes, anomalies).
5. **Validation métier** : approbation écrite d’un référent RGIE/IoT avant implémentation.

Sans ces données, appliquer la règle stricte : `Données insuffisantes pour une réponse fiable en mode sécurité backend.` Aucun endpoint ne doit être créé ou exposé.

Pour formaliser une nouvelle demande, utiliser l’issue template `\`.github/ISSUE_TEMPLATE/rgie-iot-spec.yml` (menu *New issue → RFC – Endpoint RGIE/IoT*). Aucune implémentation n’est lancée sans ticket approuvé.

---
<img src="docs/bdd.svg" alt="Schéma BDD WebElec" width="720" />
