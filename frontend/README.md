# WebElec – Frontend

Frontend Next.js (App Router) du SaaS WebElec. Il consomme l’API Spring Boot exposée sous `/api`, propose des outils IA (chat RGIE, auditeur) et une page de test d’authentification JWT.

---

## Scripts npm

- `npm run dev`   → mode développement
- `npm run build` → build de production
- `npm run start` → sert le build
- `npm run lint`  → lint via ESLint 9

---

## Variables d’environnement

API
- `NEXT_PUBLIC_API_BASE` : base des appels API (ex : `http://localhost:8080/api`). Utilisé par `lib/api/base.ts`.
- `NEXT_PUBLIC_API_URL`  : encore utilisé pour l’upload de pièces (`lib/api/piece.ts`). Mettre la même valeur que `NEXT_PUBLIC_API_BASE` pour éviter les 404.

IA / embeddings
- `OPENAI_API_KEY` (obligatoire pour `/api/embedding`)
- `OPENAI_BASE_URL` (optionnel, défaut `https://api.openai.com`)
- `OPENAI_MODEL` (optionnel, défaut `text-embedding-3-large`)

Exemple `.env.local` :
```env
NEXT_PUBLIC_API_BASE=http://localhost:8080/api
NEXT_PUBLIC_API_URL=http://localhost:8080/api
OPENAI_API_KEY=sk-xxxx
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
```
Rappel : ces variables sont lues par le navigateur, pas par le conteneur. L’URL doit donc être accessible depuis le poste client.

---

## Points fonctionnels utiles

- `app/login-test/page.tsx` : formulaire de test login JWT (stockage token + bouton déconnexion, champs avec `autoComplete`).
- `lib/api/base.ts` : client fetch avec ajout automatique du token côté navigateur.
- `lib/api/piece.ts` : upload / récupération de pièces (nécessite `NEXT_PUBLIC_API_URL`).
- IA : `app/rgie/chat/page.tsx` (chat RGIE), `app/rgie/auditeur-pro/page.tsx` (audit symbolique), SDK `lib/sdk/webelec-ai.ts`.

---

## CI / vérifications locales

```bash
npm run lint
npm run build
```
