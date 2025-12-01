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

## Fonctionnalités métier
- **Sociétés** : CRUD de base via `/api/societes` (déjà existant dans le squelette initial).
- **Chantiers** : `/api/chantiers` pour lister, créer, filtrer par société (`/societe/{id}`) et supprimer.
- **Produits (stock)** : `/api/produits` avec filtres par société, création, mise à jour et suppression.
- **Clients** : `/api/clients` avec les mêmes opérations (GET/POST/PUT/DELETE) et filtre `/societe/{id}`.

Chaque entité est composée d'une couche **Repository** (Spring Data JPA), **Service** (logique métier/testable) et **Controller** REST. Les relations sont câblées via `@ManyToOne` vers `Societe` pour préparer les regroupements et future facturation.

## Exemples de payloads
```json
POST /api/chantiers
{
  "nom": "Installation nouvelle cuisine",
  "adresse": "Rue du Four 15, 4000 Liège",
  "description": "Tableau secondaire + circuit prises + éclairage LED",
  "societe": { "id": 1 }
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
  "societe": { "id": 1 }
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
  "societe": { "id": 1 }
}
```

## Structure
- `src/main/java/com/webelec/backend/BackendApplication.java` : point d'entrée Spring Boot
- `src/main/resources` : configuration (`application.yml`), gabarits et ressources statiques
- `pom.xml` : gestion des dépendances et configuration Java 21

## Prochaines étapes suggérées
- Ajouter les entités restantes (Intervention, Produit avancé, Devis, Facture) en suivant le même pattern Repository/Service/Controller.
- Introduire des DTO + validation Bean Validation pour exposer des contrats stables au front.
- Séparer les profils Spring (dev/test/prod) et intégrer PostgreSQL dans vos pipelines CI/CD.