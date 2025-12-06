# Déploiement backend WebElec (Spring Boot + PostgreSQL + Docker)

Ce document décrit comment lancer le backend WebElec :

- en **dev local** (full stack avec frontend + pgAdmin),
- en mode **prod-like** (backend + Postgres, sans pgAdmin),
- les commandes de base à réutiliser pour un futur VPS.

---

## 1. Pré-requis

Sur la machine cible (PC ou VPS) :

- Docker installé (`docker --version`)
- Docker Compose intégré à Docker (`docker compose version`)
- Git installé (`git --version`)
- Le dépôt cloné, par exemple dans :

  ```bash
  /opt/webelec-saas
