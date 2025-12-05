# Backend Spring Boot Project

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

### Seed des sociétés personnalisable
Le backend charge automatiquement des sociétés de test au démarrage via `DataSeeder`. Pour contrôler cette liste sans toucher au code, modifiez la section `webelec.seed.societes` dans `application.yml` :

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

Ajoutez autant de blocs `societes` que nécessaire, chaque entrée devant contenir `nom` et `tva` (les autres champs sont optionnels). Le seed ne s’exécute que si la table est vide.

## Démarrage rapide
```bash
mvnw.cmd spring-boot:run
```

```bash
./mvnw spring-boot:run
```
L'application démarre sur http://localhost:8080.

## Tests
```bash
mvnw.cmd test
```

```bash
./mvnw test
```

### Tests unitaires des DTO (mapping entité <-> DTO)
Des tests JUnit sont présents pour tous les DTO principaux (`*Response`, `*Request`).
- Ils vérifient le mapping entité → DTO (`from(...)`) et DTO → entité (`toEntity()`), y compris les cas limites (`null`, valeurs par défaut).
- Les tests garantissent la robustesse des getters/setters et la stabilité des conversions, même si la structure évolue.
- Les fichiers de test sont situés dans `src/test/java/com/webelec/backend/dto/`.

## Fonctionnalités métier
- **Sociétés** : CRUD de base via `/api/societes` (déjà existant dans le squelette initial).
- **Utilisateurs** : CRUD complet via `/api/utilisateurs` (nouveau module). Permet de gérer les utilisateurs rattachés à une société : création, modification, suppression, récupération par société ou par identifiant.
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
  - `nom` *(string, obligatoire, ≤255)*
  - `tva` *(string, obligatoire, ≤32)*
  - `email` *(string, optionnel, format email, ≤255)*
  - `telephone` *(string, optionnel, regex `^[0-9+().\/\-\s]{6,30}$`)*
  - `adresse` *(string, optionnel, ≤512)*
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

### Contrat API Utilisateur (`/api/utilisateurs`)
**DTOs exposés**
- `UtilisateurRequest` (payload entrant)
  - `nom` *(string, obligatoire, ≤255)*
  - `prenom` *(string, obligatoire, ≤255)*
  - `email` *(string, optionnel, format email, ≤255)*
  - `motDePasse` *(string, obligatoire, 6-255)*
  - `role` *(string, obligatoire, ≤100)*
  - `societeId` *(long, obligatoire)*
- `UtilisateurResponse` (payload sortant)
  - `id`, `nom`, `prenom`, `email`, `role`, `societe` (résumé)

**Endpoints**
1. `GET /api/utilisateurs` → `200 OK` avec `List<UtilisateurResponse>`
2. `GET /api/utilisateurs/{id}` → `200 OK` avec un `UtilisateurResponse` ou `404` si introuvable
3. `GET /api/utilisateurs/societe/{societeId}` → `200 OK` avec la liste des utilisateurs d’une société
4. `POST /api/utilisateurs`
   ```json
   {
     "nom": "Martin",
     "prenom": "Paul",
     "email": "paul.martin@example.com",
     "motDePasse": "secret123",
     "role": "ADMIN",
     "societeId": 1
   }
   ```
   Réponse `200 OK` contenant le `UtilisateurResponse`
5. `PUT /api/utilisateurs/{id}` → met à jour l’utilisateur
6. `DELETE /api/utilisateurs/{id}` → `204 No Content` si la suppression réussit, `404 Not Found` si l'identifiant n'existe pas

**Format d’erreur global** (`ApiError`) : identique aux autres ressources (voir plus haut)

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

```json
POST /api/utilisateurs
{
  "nom": "Martin",
  "prenom": "Paul",
  "email": "paul.martin@example.com",
  "motDePasse": "secret123",
  "role": "ADMIN",
  "societeId": 1
}
```

## Exemples de requêtes REST (curl)

### Chantier

**GET (liste)**
```cmd
curl.exe -X GET http://localhost:8080/api/chantiers
```

**GET (détail)**
```cmd
curl.exe -X GET http://localhost:8080/api/chantiers/1
```

**POST (création)**
```cmd
curl.exe -X POST http://localhost:8080/api/chantiers ^
  -H "Content-Type: application/json" ^
  -d "{\"nom\":\"Chantier A\",\"adresse\":\"Rue des Lilas 10\",\"description\":\"Installation électrique\",\"societeId\":1,\"clientId\":2}"
```

**PUT (édition)**
```cmd
curl.exe -X PUT http://localhost:8080/api/chantiers/1 ^
  -H "Content-Type: application/json" ^
  -d "{\"nom\":\"Chantier A modifié\",\"adresse\":\"Rue des Lilas 10\",\"description\":\"Mise à jour\",\"societeId\":1,\"clientId\":2}"
```

**DELETE (suppression)**
```cmd
curl.exe -X DELETE http://localhost:8080/api/chantiers/1
```

### Client

**GET (liste)**
```cmd
curl.exe -X GET http://localhost:8080/api/clients
```

**POST (création)**
```cmd
curl.exe -X POST http://localhost:8080/api/clients ^
  -H "Content-Type: application/json" ^
  -d "{\"nom\":\"Dupont\",\"prenom\":\"Marc\",\"email\":\"marc@exemple.com\",\"societeId\":1}"
```

### Devis

**POST (création)**
```cmd
curl.exe -X POST http://localhost:8080/api/devis ^
  -H "Content-Type: application/json" ^
  -d "{\"numero\":\"DV-2025-001\",\"dateEmission\":\"2025-12-02\",\"dateExpiration\":\"2025-12-31\",\"montantHT\":1000.00,\"montantTVA\":210.00,\"montantTTC\":1210.00,\"statut\":\"EN_ATTENTE\",\"societeId\":1,\"clientId\":2,\"lignes\":[{\"description\":\"Prestation\",\"quantite\":1,\"prixUnitaire\":1000.00,\"total\":1000.00}]}"
```

### Facture

**POST (création)**
```cmd
curl.exe -X POST http://localhost:8080/api/factures ^
  -H "Content-Type: application/json" ^
  -d "{\"numero\":\"FA-2025-001\",\"dateEmission\":\"2025-12-02\",\"dateEcheance\":\"2025-12-31\",\"montantHT\":1000.00,\"montantTVA\":210.00,\"montantTTC\":1210.00,\"statut\":\"EN_ATTENTE\",\"societeId\":1,\"clientId\":2,\"lignes\":[{\"description\":\"Pose câblage\",\"quantite\":2,\"prixUnitaire\":500.00,\"total\":1000.00}]}"
```

---

## Automatisation de la vérification (MockMvc)

Des tests MockMvc sont présents pour chaque ressource (voir `src/test/java/com/webelec/backend/controller/`).
- Ils vérifient les statuts (200, 400, 404, 409, 204) et la validité du JSON pour chaque route REST.
- Les cas d’erreur (payload manquant, doublon, ressource absente) sont couverts.
- Pour ajouter un test, inspirez-vous des méthodes existantes dans les fichiers `*ControllerTest.java`.

---

## Tests d'intégration avec Testcontainers (PostgreSQL)

Le projet inclut des tests d'intégration qui valident la communication réelle entre Spring Boot et PostgreSQL grâce à [Testcontainers](https://www.testcontainers.org/). Ces tests démarrent un conteneur Docker PostgreSQL 16 à la volée, injectent dynamiquement la configuration JDBC, et vérifient la validité de la connexion et des opérations JPA.

### Dépendances Maven nécessaires

Ajoutez dans la section `<dependencies>` de votre `pom.xml` :

```xml
<!-- Tests Spring -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
<!-- Testcontainers Postgres -->
<dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>postgresql</artifactId>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>junit-jupiter</artifactId>
    <scope>test</scope>
</dependency>
```

Et dans `<build>` (pour JUnit 5 + Testcontainers) :

```xml
<plugins>
    <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-surefire-plugin</artifactId>
        <version>3.2.5</version>
    </plugin>
</plugins>
```

### Exemple de test minimal de connexion

```java
@Testcontainers
@SpringBootTest
class DatabaseConnectionTest {
    @Container
    static PostgreSQLContainer<?> postgres =
        new PostgreSQLContainer<>("postgres:16")
            .withDatabaseName("webelec")
            .withUsername("postgres")
            .withPassword("postgres");

    @DynamicPropertySource
    static void registerProps(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Test
    void connection_test(@Autowired DataSource ds) throws Exception {
        try (Connection cn = ds.getConnection()) {
            assertTrue(cn.isValid(2));
        }
    }
}
```

- **Aucun `application-test.yml` n'est requis** : Testcontainers injecte tout automatiquement.
- **Lancement** :

```bash
mvnw.cmd test
```

- **Ce que valide ce test** :
    - Le conteneur PostgreSQL démarre
    - Spring Boot s'y connecte réellement
    - Le DataSource répond et la connexion est valide

### Exemple de test Repository

```java
@Testcontainers
@SpringBootTest
class ClientRepositoryTest {
    @Container
    static PostgreSQLContainer<?> postgres = ... // identique à ci-dessus
    @DynamicPropertySource
    static void registerProps(DynamicPropertyRegistry registry) { ... }
    @Autowired
    ClientRepository clientRepo;
    @Test
    void save_and_find() {
        Client c = new Client();
        c.setNom("Test");
        c.setPrenom("JUnit");
        Client saved = clientRepo.save(c);
        assertNotNull(saved.getId());
        Client found = clientRepo.findById(saved.getId()).orElse(null);
        assertNotNull(found);
        assertEquals("Test", found.getNom());
    }
}
```

### Avantages
- **Reproductible** : chaque test démarre une base PostgreSQL isolée
- **Fiable** : pas de dépendance à une base locale ou CI
- **Nettoyage automatique** : le conteneur est détruit après les tests
- **Compatible CI/CD**

---
## Structure
- `src/main/java/com/webelec/backend/BackendApplication.java` : point d'entrée Spring Boot
- `src/main/resources` : configuration (`application.yml`), gabarits et ressources statiques
- `pom.xml` : gestion des dépendances et configuration Java 21

## Prochaines étapes suggérées
- ~~Ajouter les entités restantes (Intervention, Produit avancé, Devis, Facture) en suivant le même pattern Repository/Service/Controller.~~ ✅
- ~~Introduire des DTO + validation Bean Validation pour exposer des contrats stables au front.~~ ✅
- Séparer les profils Spring (dev/test/prod) et intégrer PostgreSQL dans vos pipelines CI/CD.


## Variables d'environnement pour PostgreSQL et vps
	-	export DB_HOST=127.0.0.1
	-	export DB_PORT=5432
	-	export DB_NAME=webelec_db
	-	export DB_USER=webelec
	-	export DB_PASSWORD=webelec_pwd
	
	
# WebElec – Backend

Backend du SaaS WebElec, en Java 21 / Spring Boot 3.5, avec PostgreSQL et tests d’intégration via Testcontainers.

Il gère (ou préparera) :
- Sociétés, clients, chantiers
- Produits, devis, factures, interventions
- Authentification / rôles (à venir)
- Intégrations IA / RGIE / PDF / IoT (à venir)

---

## 1. Stack technique

- Java 21  
- Spring Boot 3.5.x  
- PostgreSQL 16 (Docker)  
- Spring Data JPA / Hibernate  
- HikariCP  
- Testcontainers (PostgreSQL)  
- Maven 3.9+  

---

## 2. Lancer l’environnement

### 2.1 Démarrer PostgreSQL (Docker)

Depuis le dossier contenant `docker-compose.yml` :

    docker compose up -d

Paramètres typiques du conteneur :
- Base : webelec_db  
- Utilisateur : webelec  
- Mot de passe : webelec_pwd  
- Port : 5432  

Test de connexion :

    psql -h localhost -U webelec -d webelec_db

---

## 3. Profils Spring

Le backend utilise trois profils cibles : `dev`, `test`, `prod`.

### 3.1 Profil `dev` – application-dev.yml

Utilisé pour le développement local, connecté au PostgreSQL Docker.

    spring:
      datasource:
        url: jdbc:postgresql://localhost:5432/webelec_db
        username: webelec
        password: webelec_pwd
        driver-class-name: org.postgresql.Driver

      jpa:
        hibernate:
          ddl-auto: update
        properties:
          hibernate:
            format_sql: true
        show-sql: true

    server:
      port: 8080

Lancement en dev :

    mvn spring-boot:run -Dspring.profiles.active=dev

---

### 3.2 Profil `test` – Testcontainers

Utilisé pour les tests d’intégration. Testcontainers démarre un PostgreSQL éphémère.

Exécution des tests avec profil `test` :

    mvn clean test "-Dspring.profiles.active=test"

Résultat actuel attendu :
- 69 tests exécutés  
- 0 échec  
- 0 erreur  
- BUILD SUCCESS  

---

### 3.3 Profil `prod` – application-prod.yml

Utilisé pour la production (VPS / serveur externe).  
Les credentials viennent des variables d’environnement.

    spring:
      datasource:
        url: jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5432}/${DB_NAME:webelec_db}
        username: ${DB_USER}
        password: ${DB_PASSWORD}
        driver-class-name: org.postgresql.Driver

      jpa:
        hibernate:
          ddl-auto: validate
        properties:
          hibernate:
            format_sql: false
        show-sql: false

      datasource.hikari:
        maximum-pool-size: 10
        minimum-idle: 2
        idle-timeout: 30000
        connection-timeout: 30000
        max-lifetime: 1800000

    server:
      port: 8080

    logging:
      level:
        root: INFO
        org.springframework.web: INFO
        org.hibernate.SQL: OFF
        org.hibernate.type: OFF

Variables d’environnement à définir en prod :
- DB_HOST  
- DB_PORT  
- DB_NAME  
- DB_USER  
- DB_PASSWORD  

---

## 4. Structure actuelle du backend

    backend/
     ├─ src/main/java/com/webelec/backend/
     │   ├─ controller/          # API REST (Sociétés, Clients, etc.)
     │   ├─ service/             # Logique métier
     │   ├─ repository/          # Spring Data JPA
     │   ├─ model/               # Entités JPA
     │   ├─ dto/                 # Objets de transfert
     │   └─ BackendApplication.java
     ├─ src/main/resources/
     │   ├─ application-dev.yml
     │   ├─ application-prod.yml
     │   └─ application.yml      # config commune éventuelle
     ├─ src/test/java/com/webelec/backend/
     │   ├─ controller/          # Tests des contrôleurs
     │   ├─ dto/                 # Tests des DTO
     │   ├─ service/             # Tests des services
     │   └─ DatabaseConnectionTest.java   # Testcontainers / PostgreSQL
     └─ pom.xml

---

## 5. Tests et qualité

### 5.1 Lancer tous les tests

    mvn clean test "-Dspring.profiles.active=test"

Testcontainers :
- démarre un conteneur PostgreSQL
- applique le schéma
- exécute les tests d’intégration

État actuel :
- Tests contrôleurs : OK  
- Tests services : OK  
- Tests DTO : OK  
- Test DatabaseConnection (Testcontainers) : OK  
- Résultat global : BUILD SUCCESS  

---

## 6. Ce qui est déjà en place

- PostgreSQL via Docker fonctionnel  
- Profils Spring `dev` et `prod` configurés  
- Profil `test` actif via la ligne Maven  
- Tests d’intégration avec Testcontainers  
- WSL2 + Docker Desktop configurés correctement  
- Connexions JDBC stables (HikariCP)  
- Code organisé par couches (controller / service / repository / model / dto)  

Le backend est prêt à :
- être branché en CI/CD (GitHub Actions)  
- servir d’API au frontend Next.js WebElec  
- accueillir les modules IA / RGIE / IoT / PDF  

---

## 7. Roadmap backend – À faire

### 7.1 Créer `application-test.yml`

But : clarifier la configuration du profil `test` (même si Testcontainers gère l’URL DB).

Exemple minimal :

    spring:
      jpa:
        hibernate:
          ddl-auto: update
        properties:
          hibernate:
            format_sql: false
        show-sql: false

    logging:
      level:
        root: WARN

---

### 7.2 Configurer Maven Surefire pour le profil `test`

Dans `pom.xml`, ajouter (section build/plugins) :

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

Ensuite, un simple :

    mvn test

suffira (plus besoin de `-Dspring.profiles.active=test`).

---

### 7.3 Créer un pipeline GitHub Actions (CI)

Objectif :
- lancer les tests à chaque push
- préparer l’artefact jar pour déploiement

Étapes typiques :
1. Checkout du repo  
2. Installation JDK 21  
3. Cache Maven  
4. `mvn test`  
5. `mvn package`  

---

### 7.4 Ajouter la sécurité (Spring Security)

À implémenter :
- Authentification (JWT ou autre)
- Rôles (ADMIN, USER, TECH, etc.)
- Protection des endpoints sensibles
- Intégration avec le frontend Next.js

---

### 7.5 Préparer les endpoints pour modules IA / RGIE / PDF / IoT

- Endpoints pour interrogation IA (symptômes, diagnostics, RGIE)  
- Endpoints pour extraction PDF (certificats, rapports)  
- Endpoints pour données terrain (IoT, ESP32, MQTT, mesures électriques)  

---

### 7.6 Ajouter Flyway ou Liquibase (optionnel mais conseillé)

Pour versionner le schéma PostgreSQL :

- scripts de création tables  
- scripts d’évolution (alter table, index, etc.)
- utilisation en dev / test / prod

---

## 8. Rappel des commandes utiles

### Lancer le backend en dev

    mvn spring-boot:run -Dspring.profiles.active=dev

### Lancer tous les tests

    mvn clean test "-Dspring.profiles.active=test"

(plus tard, après config Surefire) :

    mvn clean test

### Vérifier Docker / Postgres

    docker ps
    docker logs webelec-postgres -f

---
