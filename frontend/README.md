# Frontend WebElec (Next.js)

## Pré-requis
- Node.js 20+
- Backend Spring Boot en cours d’exécution sur `http://localhost:8080` (base API par défaut `http://localhost:8080/api`, modifiable via `NEXT_PUBLIC_API_URL`)

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
- Panneau de test des sociétés : listage/ajout/suppression via les DTO Spring `SocieteRequest` / `SocieteResponse`.
- Clients API front (`lib/api`) : helpers typés pour auth, sociétés, clients, chantiers, interventions, devis, factures, catalogue (produits + produits avancés), pièces, RGIE, Peppol, notifications. Point d’entrée commun `lib/api/base.ts` (fetch JSON, headers, no-store).
- DTO TypeScript (`types`) : toutes les structures sont regroupées et exportées via `@/types` (voir `types/dto/*`), alignées sur les DTO backend.
- Endpoints de test/proxy : `GET/POST /api/test/chantiers` et `GET/POST /api/test/produits` qui forwardent vers le backend Spring (pratique pour tester le back depuis le front).

## API consommée (backend Spring)
Contrat principal actuellement branché dans le front : **Sociétés**.

DTOs exposés côté backend :
- `SocieteRequest` (entrée) : `nom` (string, obligatoire, ≤255), `tva` (string, obligatoire, ≤32), `email?` (email, ≤255), `telephone?` (regex `^[0-9+().\\/\\-\\s]{6,30}$`), `adresse?` (≤512).
- `SocieteResponse` (sortie) : `id`, `nom`, `tva`, `email?`, `telephone?`, `adresse?`.

Endpoints consommés par le front :
- `GET /api/societes` → `SocieteResponse[]` (liste toutes les sociétés).
- `GET /api/societes/{id}` → `SocieteResponse` ou 404 si introuvable.
- `POST /api/societes` → crée une société (JSON `SocieteRequest`).
- `DELETE /api/societes/{id}` → 204 No Content si suppression OK, 404 sinon.

Format d’erreur global (simplifié, renvoyé par Spring) :
```json
{
  "timestamp": "2025-12-01T22:15:37.123Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Requête invalide",
  "details": [
    "nom: Le nom de la société est obligatoire",
    "tva: La TVA est obligatoire"
  ]
}
```

## Tests manuels rapides
- Lancer le backend Spring, puis le front (`npm run dev`).
- Utiliser le panneau “Sociétés” sur la page d’accueil pour créer et supprimer (les champs obligatoires sont *Nom* et *TVA*).
- Tester directement le backend Spring via cURL :
  - `curl http://localhost:8080/api/societes`
  - `curl -X POST -H "Content-Type: application/json" -d '{"nom":"WebElec","tva":"BE0123456789","email":"contact@webelec.be","telephone":"0470/00.00.00","adresse":"Rue des Artisans 12, Liège"}' http://localhost:8080/api/societes`
  - `curl -X DELETE http://localhost:8080/api/societes/<id>`
- Tester directement les endpoints de base du backend (au lieu de passer par `http://localhost:3000/api`) :
  - `curl http://localhost:8080/api/chantiers`
  - `curl -X POST -H "Content-Type: application/json" -d '{"nom":"Installation nouvelle cuisine","adresse":"Rue du Four 15, 4000 Liège","description":"Tableau secondaire + circuit prises + éclairage LED","societeId":1}' http://localhost:8080/api/chantiers`
  - `curl http://localhost:8080/api/produits`
