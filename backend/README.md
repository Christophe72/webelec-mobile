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
a- `src/test/java/com/webelec/backend/controller/*ControllerTest.java` : exemples MockMvc
- `src/test/java/com/webelec/backend/dto/*Test.java` : mapping DTO ↔ entités
- `Dockerfile` : build containerisé pour la prod

Le backend est prêt pour un branchement Next.js, l'intégration CI/CD et l'ajout de modules réglementaires RGIE lorsque les règles officielles sont disponibles dans le dépôt.