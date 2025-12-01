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
# Windows
mvnw.cmd spring-boot:run

# Linux / macOS
y ./mvnw spring-boot:run
```
L'application démarre sur http://localhost:8080.

## Tests
```bash
# Windows
mvnw.cmd test

# Linux / macOS
y ./mvnw test
```

## Structure
- `src/main/java/com/webelec/backend/BackendApplication.java` : point d'entrée Spring Boot
- `src/main/resources` : configuration (`application.yml`), gabarits et ressources statiques
- `pom.xml` : gestion des dépendances et configuration Java 21

## Prochaines étapes suggérées
1. Ajouter vos entités JPA et DTO.
2. Exposer des contrôleurs REST avec validation côté serveur.
3. Configurer un profil Spring pour différencier dev/test/prod.
