# Frontend WebElec (Next.js)

## Pré-requis
- Node.js 20+
- Backend Spring Boot en cours d’exécution sur `http://localhost:8080` (modifiable via `NEXT_PUBLIC_API_URL`)

## Démarrer le front
```bash
npm install
npm run dev
# ou npm run build && npm run start pour la prod
```
Ouvrir http://localhost:3000.

Configurez l’URL du backend avec la variable d’environnement côté client :
```bash
NEXT_PUBLIC_API_URL="http://localhost:8080/api"
```

## Fonctionnalités
- Mode clair/sombre avec mémorisation locale (toggle en haut à droite).
- Panneau de test des sociétés : listage/ajout/suppression via l’API Spring.
- Clients API front (`lib/api`) : helpers typés pour auth, clients, chantiers, interventions, devis, factures, catalogue, pièces, RGIE, Peppol, notifications. Point d’entrée commun `lib/api/base.ts` (fetch JSON, headers, no-store).
- DTO TypeScript (`types`) : toutes les structures sont regroupées et exportées via `@/types` (voir `types/dto/*`).

## API consommée (backend Spring)
- `GET /api/societes` : liste toutes les sociétés.
- `GET /api/societes/{id}` : récupère une société (500 si absente).
- `POST /api/societes` : crée une société (JSON `{ name, city?, description? }`).
- `DELETE /api/societes/{id}` : supprime une société.

## Tests manuels rapides
- Lancer le backend Spring, puis le front (`npm run dev`).
- Utiliser le panneau “Sociétés” sur la page d’accueil pour créer et supprimer.
- Ou via cURL :
  - `curl http://localhost:8080/api/societes`
  - `curl -X POST -H "Content-Type: application/json" -d '{"name":"Test"}' http://localhost:8080/api/societes`
  - `curl -X DELETE http://localhost:8080/api/societes/<id>`
