# Intégration API Spring Boot - WebElec Mobile

## Configuration

### 1. Variables d'environnement

Créez un fichier `.env.local` à la racine du projet:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Pour la production:
```bash
NEXT_PUBLIC_API_URL=https://api.webelec.com
```

### 2. Démarrer le backend Spring Boot

Assurez-vous que le backend Spring Boot est démarré sur le port 8080:

```bash
cd c:\saas\webelec-saas\backend
mvn spring-boot:run
```

## Architecture de l'API Client

### Structure des fichiers

```
lib/api/
├── config.ts                    # Configuration et endpoints
├── types.ts                     # Types TypeScript (DTOs)
├── client.ts                    # Client HTTP avec interceptors
├── services/
│   ├── auth.service.ts         # Service d'authentification
│   ├── client.service.ts       # Service clients
│   └── chantier.service.ts     # Service chantiers
└── index.ts                    # Export centralisé
```

### Fonctionnalités

#### 🔐 Authentification
- **Login/Register**: Gestion complète de l'authentification
- **Token JWT**: Stockage sécurisé dans localStorage
- **Refresh automatique**: Renouvellement du token avant expiration
- **Interceptors**: Ajout automatique du token aux requêtes

#### 🔄 Gestion des erreurs
- **Retry automatique**: Sur erreur 401 avec refresh du token
- **Redirection**: Vers /login si le refresh échoue
- **Messages d'erreur**: Affichage des erreurs de l'API

## Endpoints disponibles

### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription
- `POST /api/auth/refresh` - Rafraîchir le token
- `GET /api/auth/me` - Informations utilisateur

### Clients
- `GET /api/clients` - Liste des clients
- `GET /api/clients/{id}` - Détails d'un client
- `POST /api/clients` - Créer un client
- `PUT /api/clients/{id}` - Modifier un client
- `DELETE /api/clients/{id}` - Supprimer un client

### Chantiers
- `GET /api/chantiers` - Liste des chantiers
- `GET /api/chantiers/{id}` - Détails d'un chantier
- `GET /api/chantiers/societe/{societeId}` - Chantiers par société
- `POST /api/chantiers` - Créer un chantier
- `PUT /api/chantiers/{id}` - Modifier un chantier
- `DELETE /api/chantiers/{id}` - Supprimer un chantier

## Utilisation

### 1. Authentification

```typescript
import { authService } from "@/lib/api";

// Login
const { accessToken, utilisateur } = await authService.login({
  email: "user@example.com",
  password: "password123",
});

// Vérifier si authentifié
const isAuth = authService.isAuthenticated();

// Déconnexion
authService.logout();
```

### 2. Clients

```typescript
import { clientService } from "@/lib/api";

// Récupérer tous les clients
const clients = await clientService.getAll();

// Créer un client
const newClient = await clientService.create({
  nom: "Dupont",
  prenom: "Jean",
  email: "jean.dupont@example.com",
  telephone: "0470123456",
  adresse: "Rue de la Gare 123, 4000 Liège",
  societeId: 1,
});

// Mettre à jour un client
const updated = await clientService.update(clientId, {
  // ... données mises à jour
});

// Supprimer un client
await clientService.delete(clientId);
```

### 3. Chantiers

```typescript
import { chantierService } from "@/lib/api";

// Récupérer tous les chantiers
const chantiers = await chantierService.getAll();

// Créer un chantier
const newChantier = await chantierService.create({
  nom: "École Sainte-Marie",
  adresse: "Rue des Écoles 12",
  description: "Installation électrique complète",
  societeId: 1,
  clientId: 5,
});
```

## Migration depuis localStorage

Les anciens hooks `useClients` et `useChantiers` utilisaient localStorage. Pour migrer:

1. Les données seront maintenant récupérées depuis l'API
2. L'authentification est requise
3. Les photos ne sont plus stockées en base64 (à implémenter avec upload de fichiers)

## Prochaines étapes

### 🎯 À faire
- [ ] Implémenter l'upload de photos (multipart/form-data)
- [ ] Ajouter React Query pour le cache et la gestion d'état
- [ ] Créer un middleware d'authentification pour les routes protégées
- [ ] Ajouter la gestion des états (chantiers)
- [ ] Implémenter la pagination pour les listes longues
- [ ] Ajouter des tests unitaires pour les services

### 🔧 Améliorations possibles
- WebSocket pour les notifications en temps réel
- Service Worker pour le mode hors-ligne
- Optimistic updates avec React Query
- Cache strategy avec SWR

## Debugging

### Activer les logs axios

```typescript
// Dans lib/api/client.ts
this.client.interceptors.request.use((config) => {
  console.log("Request:", config.method?.toUpperCase(), config.url);
  return config;
});

this.client.interceptors.response.use((response) => {
  console.log("Response:", response.status, response.config.url);
  return response;
});
```

### Tester l'API manuellement

```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Get clients (avec token)
curl -X GET http://localhost:8080/api/clients \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Support

Pour toute question ou problème:
1. Vérifier que le backend est démarré
2. Vérifier la configuration dans `.env.local`
3. Consulter les logs du navigateur (DevTools > Console)
4. Consulter les logs du backend Spring Boot
