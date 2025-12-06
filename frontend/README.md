# WebElec – Frontend

Frontend du SaaS WebElec (Next.js).  
Il consomme l’API du backend Spring Boot et s’exécute soit :

- en mode développement (`npm run dev`)
- en mode Docker via `docker compose`
- en build CI GitHub (workflow `Frontend CI`)

---

## 1. Stack technique

- Next.js (App Router)
- React
- TypeScript (si activé)
- Tailwind CSS (si activé)
- npm (ou pnpm / yarn selon ton setup)

---

## 2. Scripts npm

Dans `frontend/package.json`, tu dois retrouver au minimum :

- `npm run dev`   → mode développement
- `npm run build` → build de production
- `npm run start` → démarrage sur build compilé
- `npm run lint`  → lint du code (utilisé par la CI)

Exemple de section `scripts` (à adapter si besoin) :

    {
      "scripts": {
        "dev": "next dev",
        "build": "next build",
        "start": "next start",
        "lint": "next lint"
      }
    }

---

## 3. Configuration de l’API backend

Le frontend appelle le backend via une variable d’environnement :

- `NEXT_PUBLIC_API_URL`

### 3.1 En développement (local, sans Docker)

Créer un fichier `.env.local` dans `frontend/` :

    NEXT_PUBLIC_API_URL=http://localhost:8080

Lancer ensuite :

    npm install
    npm run dev

Le frontend tourne alors sur :

- http://localhost:3000  
et appelle le backend sur :

- http://localhost:8080

---

### 3.2 En mode Docker (docker-compose dev)

Dans `docker-compose.yml` (dev), le service `frontend` définit :

    frontend:
      build:
        context: ./frontend
        dockerfile: Dockerfile
      container_name: webelec-frontend
      restart: always
      environment:
        NEXT_PUBLIC_API_URL: "http://localhost:8080"
      ports:
        - "3000:3000"
      depends_on:
        - backend
      networks:
        - webelec-net

Remarque importante :

- `NEXT_PUBLIC_API_URL` est lu par le navigateur, pas par le conteneur.  
- Utiliser `http://localhost:8080` est donc correct : c’est l’hôte vu par le navigateur.

---

## 4. Démarrage en développement

### 4.1 Sans Docker (mode Next.js classique)

Depuis `frontend/` :

    npm install
    npm run dev

Accès :

- Frontend : http://localhost:3000  
- Backend : http://localhost:8080 (doit être lancé à part)

### 4.2 Avec Docker (stack complet dev)

Depuis la racine du monorepo :

    docker compose up -d --build

Accès :

- Frontend : http://localhost:3000  
- Backend : http://localhost:8080  
- PgAdmin  : http://localhost:5050

---

## 5. Intégration CI GitHub

Workflow : `.github/workflows/frontend-ci.yml`

Tâches :

- Installation des dépendances (`npm install`)
- `npm run lint`
- `npm run build`

En local, tu peux reproduire :

    cd frontend
    npm install
    npm run lint
    npm run build

---

## 6. Idées d’amélioration frontend

- Ajouter un système de layout clair : layout de base + layout “dashboard”.
- Centraliser les appels API dans un module (par exemple `lib/api.ts`) qui utilise `NEXT_PUBLIC_API_URL`.
- Ajouter des tests (unitaires / e2e) et les brancher plus tard dans la CI.
- Ajouter un README global pour documenter la navigation (pages, routes, modules WebElec).

---
--- a/frontend/README.md
+++ b/frontend/README.md
@@
-## 3. Configuration de l’API backend
-
-Le frontend appelle le backend via une variable d’environnement :
-
-- `NEXT_PUBLIC_API_URL`
+## 3. Configuration de l’API backend
+
+Le frontend appelle le backend via :
+
+- `NEXT_PUBLIC_API_BASE` (ex: `http://localhost:8080/api`)
+
+Et, pour les embeddings (route `/api/embedding`) :
+
+- `OPENAI_API_KEY` (obligatoire)
+- `OPENAI_BASE_URL` (optionnel, par défaut api.openai.com)
+- `OPENAI_MODEL` (optionnel, par défaut `text-embedding-3-large`)
@@
-    NEXT_PUBLIC_API_URL=http://localhost:8080
+    NEXT_PUBLIC_API_BASE=http://localhost:8080/api
+    OPENAI_API_KEY=sk-xxxx
@@
-        NEXT_PUBLIC_API_URL: "http://localhost:8080"
+        NEXT_PUBLIC_API_BASE: "http://localhost:8080/api"
@@
-- `NEXT_PUBLIC_API_URL` est lu par le navigateur, pas par le conteneur.  
-- Utiliser `http://localhost:8080` est donc correct : c’est l’hôte vu par le navigateur.
+- `NEXT_PUBLIC_API_BASE` est lu par le navigateur, pas par le conteneur.  
+- Utiliser `http://localhost:8080/api` est donc correct : c’est l’hôte vu par le navigateur.
+
+---
+
+## 4. Fonctionnalités IA (Chat RGIE & Auditeur Pro)
+
+- Route embeddings : `/api/embedding` (utilise `OPENAI_API_KEY`).
+- SDK IA : `lib/sdk/webelec-ai.ts` (ask/explain/diagnostic guidé, steps, self-check).
+- Chat RGIE : `app/rgie/chat/page.tsx` (questions, citations, steps).
+- Auditeur Pro : `app/rgie/auditeur-pro/page.tsx` (embedding + audit symbolique + citations + steps).
+
+Lancer en dev (front) :
+
+```bash
+cd frontend
+npm install
+npm run dev
+# Vérifie que le backend répond sur NEXT_PUBLIC_API_BASE et que OPENAI_API_KEY est défini
+```