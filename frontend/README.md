# WebElec – Frontend

Frontend Next.js (App Router) du SaaS WebElec. Il consomme l’API Spring Boot exposée sous `/api`, propose des outils IA (chat RGIE, auditeur) et une page de test d’authentification JWT.

---

## Stack & prérequis
- Next.js 16 + React 19 + TypeScript
- Tailwind v4
- Node 18+

---

## Scripts npm

- `npm run dev`   → mode développement
- `npm run build` → build de production
- `npm run start` → sert le build
- `npm run lint`  → lint via ESLint 9

---

## Variables d’environnement

API (frontend)
- `NEXT_PUBLIC_API_BASE` : base des appels API (ex : `http://localhost:8080/api`). Utilisé par `lib/api/base.ts`.
- `NEXT_PUBLIC_API_URL`  : utilisé pour l’upload de pièces (`lib/api/piece.ts`). Mettre la même valeur que `NEXT_PUBLIC_API_BASE`.

Auth / JWT
- `WEBELEC_JWT_SECRET` : secret partagé backend/frontend (obligatoire pour `lib/auth/server.ts`).
- `JWT_ISSUER` / `JWT_AUDIENCE` : optionnels si vous les avez configurés côté backend.

IA / embeddings
- `OPENAI_API_KEY` (obligatoire pour `/api/embedding`)
- `OPENAI_BASE_URL` (optionnel, défaut `https://api.openai.com`)
- `OPENAI_MODEL` (optionnel, défaut `text-embedding-3-large` côté embeddings ; `gpt-4o-mini` côté `/api/query` ; `gpt-4.1-mini` dans `components/OpenAI.tsx`)
- `VECTOR_STORE_ID` : requis pour la recherche RGIE (file search) utilisée par l’assistant IA

Exemple `.env.local` :
```env
NEXT_PUBLIC_API_BASE=http://localhost:8080/api
NEXT_PUBLIC_API_URL=http://localhost:8080/api
WEBELEC_JWT_SECRET=dev-webelec-secret-change-me-please-0123456789
OPENAI_API_KEY=sk-xxxx
# OPENAI_BASE_URL=https://api.openai.com
# OPENAI_MODEL=text-embedding-3-large
# VECTOR_STORE_ID=vs_xxx
# JWT_ISSUER=webelec-backend
# JWT_AUDIENCE=your-audience
```

---

## Démarrer en local (sans Docker)

```bash
cd frontend
npm install
npm run dev
# Frontend : http://localhost:3000
# Backend attendu sur NEXT_PUBLIC_API_BASE / NEXT_PUBLIC_API_URL
```

---

## Notes Docker (dev)

Dans `docker-compose.yml`, fournir les mêmes variables côté service `frontend` :
```yaml
environment:
  NEXT_PUBLIC_API_BASE: "http://localhost:8080/api"
  NEXT_PUBLIC_API_URL: "http://localhost:8080/api"
  WEBELEC_JWT_SECRET: "dev-webelec-secret-change-me-please-0123456789"
```
Rappel : ces variables sont lues par le navigateur, pas par le conteneur. L’URL doit donc être accessible depuis le poste client.

---

## Points fonctionnels utiles
- Auth : page de login sur `/login` (`app/login/page.tsx`) qui stocke le token dans `localStorage` + cookie `token` (utilisé côté serveur).
- Vérification JWT côté serveur : `proxy.ts` + `lib/auth/server.ts` (lecture du cookie `token`, validation du secret partagé).
- `lib/api/base.ts` : client fetch avec ajout automatique du token côté navigateur.
- `lib/api/piece.ts` : upload / récupération de pièces (nécessite `NEXT_PUBLIC_API_URL`).
- IA : `app/rgie/chat/page.tsx` (chat RGIE), `app/rgie/auditeur-pro/page.tsx` (audit symbolique), SDK `lib/sdk/webelec-ai.ts`.

---

## CI / vérifications locales

```bash
npm run lint
npm run build
```

## Workflow Git (exemple)

```bash
# Depuis la racine frontend
npm install            # installe notamment jose et zod
git add .
git commit -m "chore: enforce jwt middleware and document auth"
git push origin <branche>
```

---

## Identifiants admin (test local)
- Email : admin@webelec.fr
- Mot de passe : Admin@12345
