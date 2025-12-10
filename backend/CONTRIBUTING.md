# CONTRIBUTING – WebElec Backend

Merci de contribuer au backend WebElec ! Pour garantir la conformité métier et la sécurité, toute demande de nouveau endpoint RGIE ou IoT doit suivre la procédure ci-dessous.

## 1. Spécifications RGIE & IoT
Avant toute PR ou ticket de développement concernant le RGIE ou l’IoT :
- **Remplir le template d’issue** : [RFC – Endpoint RGIE/IoT](.github/ISSUE_TEMPLATE/rgie-iot-spec.yml)
- **Fournir** :
  - Références RGIE officielles (article, version, seuils)
  - Modélisation métier (entités, relations, règles)
  - Flux IoT (topic MQTT, payload, unités, sécurité)
  - Plan de tests (cas nominal, limites, monitoring)
  - Validation métier (référent RGIE/IoT)

Aucune PR RGIE/IoT ne sera acceptée sans ticket validé.

## 2. Bonnes pratiques générales
- Respecter la structure du projet (`controller/`, `service/`, `repository/`, etc.)
- Utiliser Java 21, Spring Boot 3.5+, PostgreSQL
- Ne jamais inventer de règle métier ou de structure non validée
- Valider les DTO avec Bean Validation
- Documenter les payloads dans l’OpenAPI ou le README

## 3. Processus de contribution
1. Forker le dépôt et créer une branche dédiée (`feature/nom-fonctionnalite`)
2. Ouvrir une issue en utilisant le template RGIE/IoT si besoin
3. Développer en respectant les conventions et la sécurité
4. Lancer tous les tests (`mvnw.cmd clean test -Dspring.profiles.active=test`)
5. Soumettre une PR en liant l’issue correspondante

## 4. Liens utiles
- [Template RGIE/IoT](.github/ISSUE_TEMPLATE/rgie-iot-spec.yml)
- [README](README.md)
- [OpenAPI](src/main/resources/api-spec.yaml)

Pour toute question métier, contacter le référent RGIE ou IoT du projet.

---
Dernière mise à jour : 2025-12-10
