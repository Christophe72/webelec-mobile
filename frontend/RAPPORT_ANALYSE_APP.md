# Rapport d'analyse technique - Frontend WebElec

Date: 11 fevrier 2026  
Perimetre: dossier `frontend` (Next.js App Router, TypeScript, Tailwind, BFF API routes)

## 1. Synthese executive

L'application a une base solide (structure modulaire, typage DTO, BFF Next.js, couverture fonctionnelle metier large), mais elle est actuellement en etat hybride entre prototype et production.

Les points les plus critiques sont:

1. Exposition de secrets dans `/.env.example`.
2. Chaine d'authentification incoherente (login, stockage token, lecture token, middleware).
3. Dependance a des fallbacks locaux (`localhost`, embeddings de secours) qui contredisent la politique de "fail fast" documentee.

## 2. Methodologie

- Revue statique du code source (`app`, `components`, `lib`, `types`).
- Verification des routes API et flux auth.
- Lecture des configurations (`package.json`, Next, Jest, Playwright, Dockerfile, README).
- Tentative d'execution qualite (`lint`, `typecheck`, `test`) non concluante dans cet environnement (WSL/vsock).

## 3. Cartographie rapide

- Stack: Next.js `16.1.6`, React `19.2.0`, TypeScript strict, Tailwind v4.
- Taille: ~`184` fichiers TS/TSX, ~`18 843` lignes TS/TSX.
- BFF/API: `17` route handlers sous `app/api`.
- Tests: `4` tests unitaires + `1` test e2e.

## 4. Points forts

- Structure front claire par domaines (`clients`, `devis`, `factures`, `calculateur`, `rgie`).
- DTO centralises sous `types/dto/*`.
- Wrapper API commun (`lib/api/base.ts`) et gestion d'erreurs presentable (`lib/ui/format-api-error.ts`).
- Separation metier interessante dans certains modules (`account-validation`, `invoice-import`).

## 5. Constats et risques (priorises)

## Critique

### C1 - Secret leak dans le repository

- Preuve:
  - `/.env.example:4` contient une cle OpenAI complete.
  - `/.env.example:11` contient aussi une valeur de secret JWT.
- Impact:
  - Compromission potentielle de comptes/API et couts OpenAI.
  - Non-conformite securite basique.
- Action:
  - Revoquer immediatement ces secrets.
  - Remplacer `/.env.example` par des placeholders non sensibles.

### C2 - Flux auth casse entre login et reste de l'app

- Preuve:
  - `app/login/page.tsx:6` utilise `useAuth` depuis `lib/auth/AuthProvider`.
  - `lib/auth/AuthProvider.tsx:13` stocke dans `webelec_access_token`.
  - Le reste de l'app lit `access_token` via `lib/hooks/useAuth.ts:4` + `lib/api/auth-storage.ts:1`.
- Impact:
  - Login "reussi" localement mais token non consomme par les pages metier.
  - Effets de bord selon environnement (fonctionne en dev bypass, casse hors bypass).
- Action:
  - Unifier sur un seul mecanisme auth (`auth-storage` + cookie + event).
  - Supprimer ou refondre `AuthProvider` pour eviter les doubles sources de verite.

### C3 - Login/register/refresh impossibles si auth active

- Preuve:
  - `lib/api/auth.ts:10-28` appelle `api("", ...)` sans token.
  - `lib/api/base.ts:27` passe par `bffFetch`.
  - `lib/api/bffFetch.ts:15-19` rejecte sans token sauf si `NEXT_PUBLIC_API_AUTH_DISABLED=true`.
- Impact:
  - Impossible de s'authentifier en mode securise.
- Action:
  - Autoriser explicitement les endpoints publics (`/auth/login`, `/auth/register`, `/auth/refresh`) dans `bffFetch`, ou bypasser `bffFetch` pour eux.

## Eleve

### H1 - Contradiction code/documentation sur la configuration API

- Preuve:
  - README annonce "pas de fallback" (`README.md:90-92`).
  - Le code fallbacke sur localhost:
    - `app/api/proxy.ts:6-8`
    - `app/api/[...path]/route.ts:4-6`
    - `app/api/clients/route.ts:4-6` (idem chantiers/devis).
- Impact:
  - Risque de masquer une mauvaise config en prod/CI.
  - Comportement non deterministe.
- Action:
  - Supprimer tous les fallbacks implicites et lever une erreur claire au demarrage.

### H2 - Strategie BFF fragmentee et incoherente

- Preuve:
  - Trois implementations paralleles:
    - `app/api/proxy.ts` (timeout + proxy generique)
    - `app/api/[...path]/route.ts` (pas de timeout)
    - `app/api/clients|chantiers|devis/route.ts` (forward custom).
- Impact:
  - Maintenance couteuse, erreurs divergentes, securite heterogene.
- Action:
  - Standardiser toutes les routes sur un unique proxy central (`proxyApi`).

### H3 - Bypass auth tres large en dev

- Preuve:
  - `proxy.ts:10-13` desactive auth pour tout `NODE_ENV !== "production"`.
  - `app/debug-env/page.tsx:18-19` expose un message explicite de bypass.
- Impact:
  - Risque de faux sentiment de securite et ecarts dev/prod.
- Action:
  - Encadrer par un flag explicite non public, et retirer la page debug des builds de prod.

## Moyen

### M1 - Fonctions IA partiellement en mode demo/stub

- Preuve:
  - `lib/sdk/webelec-sdk.ts:35-37` retourne toujours `results: []`.
  - `app/dashboard/page.tsx:50-58` utilise des evenements mockes.
  - `app/api/embedding/route.ts:29-35` fallback embedding local heuristique.
- Impact:
  - Resultats IA peu fiables si les pre-requis ne sont pas remplis.
- Action:
  - Bloquer explicitement les features IA quand la config requise manque.
  - Remplacer les stubs par des integrations reelles ou un mode demo clairement labelise.

### M2 - Couverture de tests insuffisante vs surface applicative

- Preuve:
  - `184` fichiers TS/TSX vs `4` tests unitaires et `1` e2e.
- Impact:
  - Risque eleve de regression sur auth/BFF/CRUD.
- Action:
  - Prioriser des tests d'integration sur auth, routes BFF, CRUD principaux et flux facturation.

### M3 - Code mort / ambigu

- Preuve:
  - `components/OpenAI.tsx` contient une logique "route handler" (API style) mais n'est pas une route et n'est pas referencee.
- Impact:
  - Confusion, dette technique.
- Action:
  - Supprimer ou deplacer vers un emplacement coherent.

## 6. Gaps de validation

Les commandes suivantes ont ete tentees sans succes dans cette session:

- `npm run lint`
- `npm run typecheck`
- `npm test -- --runInBand`

Erreur rencontree:

- `WSL ... UtilBindVsockAnyPort: socket failed 1`
- precedemment: `WSL 1 is not supported. Please upgrade to WSL 2 or above.`

Conclusion: l'etat qualite d'execution (lint/typecheck/tests) n'a pas pu etre confirme depuis cet environnement d'analyse.

## 7. Plan d'action recommande

### Sprint 1 (immediat, securite + blocants)

1. Rotation des secrets et nettoyage `/.env.example`.
2. Correction du flux auth (single source of truth).
3. Autoriser login/register/refresh sans token dans le client API.
4. Supprimer fallbacks `localhost` obligatoires en runtime.

### Sprint 2 (stabilisation)

1. Unifier toutes les routes BFF autour d'un seul proxy.
2. Retirer les pages/flags debug des artefacts de prod.
3. Ajouter tests integration pour auth + BFF + 3 modules CRUD critiques.

### Sprint 3 (industrialisation)

1. Clarifier mode "demo" vs mode "production" pour les briques IA.
2. Monter une CI stricte: lint + typecheck + tests + e2e smoke.
3. Ajouter observabilite API front (timeouts, taux d'erreurs, tracing minimal).

## 8. Evaluation globale

- Maturite architecture: **Bonne base**
- Maturite securite operationnelle: **Insuffisante a ce stade**
- Maturite fiabilite (tests + execution): **Faible a moyenne**
- Prete pour prod: **Non, sans correctifs des points C1/C2/C3**

