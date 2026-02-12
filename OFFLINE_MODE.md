# Mode Hors-Ligne - WebElec Mobile

## Vue d'ensemble

L'application WebElec Mobile supporte le **mode hors-ligne** complet, permettant aux techniciens de travailler sur les chantiers sans connexion internet. Toutes les modifications sont enregistrées localement et synchronisées automatiquement dès que la connexion est rétablie.

## Fonctionnalités

### ✅ Ce qui fonctionne hors-ligne

- ✏️ **Création** de clients et chantiers
- ✏️ **Modification** de clients et chantiers existants
- 🗑️ **Suppression** de clients et chantiers
- 📸 **Ajout de photos** (stockage local)
- 📱 **Consultation** des données en cache
- 🔄 **Queue de synchronisation** automatique

### 🔄 Synchronisation automatique

Quand la connexion revient:
1. Détection automatique du réseau
2. Synchronisation de toutes les actions en attente
3. Retry automatique en cas d'échec
4. Notification visuelle de l'état

## Architecture

### Services créés

```
lib/offline/
├── network-status.ts    # Détection de l'état du réseau
├── sync-queue.ts        # Queue des actions en attente
├── sync-service.ts      # Service de synchronisation
└── index.ts            # Export centralisé
```

### Composants

- `NetworkStatusIndicator` - Indicateur visuel en bas de l'écran
- `useNetworkStatus` - Hook React pour l'état du réseau

## Utilisation

### 1. Indicateur de statut

L'indicateur apparaît automatiquement en bas de l'écran pour montrer:

- 🔴 **Mode hors-ligne** - Pas de connexion
- 🔵 **Synchronisation en cours** - Upload des données
- 🟢 **Synchronisé** - Toutes les données sont à jour
- 🟡 **Actions en attente** - Modifications non envoyées

### 2. Dans un composant

```typescript
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

function MyComponent() {
  const { isOnline, pendingCount, forceSync } = useNetworkStatus();

  return (
    <div>
      <p>Statut: {isOnline ? "En ligne" : "Hors-ligne"}</p>
      <p>Actions en attente: {pendingCount}</p>

      {pendingCount > 0 && (
        <button onClick={forceSync}>
          Synchroniser maintenant
        </button>
      )}
    </div>
  );
}
```

### 3. Ajouter à la queue manuellement

```typescript
import { syncQueue } from "@/lib/offline";

// Ajouter une action CREATE
syncQueue.add({
  type: "CREATE",
  entity: "client",
  data: {
    nom: "Dupont",
    prenom: "Jean",
    // ... autres données
  },
});

// Ajouter une action UPDATE
syncQueue.add({
  type: "UPDATE",
  entity: "chantier",
  data: {
    id: 123,
    nom: "Chantier modifié",
    // ... données mises à jour
  },
});

// Ajouter une action DELETE
syncQueue.add({
  type: "DELETE",
  entity: "client",
  data: {
    id: 456,
  },
});
```

## Fonctionnement technique

### 1. Détection du réseau

```typescript
// lib/offline/network-status.ts
- Écoute des événements 'online' et 'offline'
- Notifie tous les listeners des changements
- Accessible via networkStatus.isOnline()
```

### 2. Queue de synchronisation

```typescript
// lib/offline/sync-queue.ts
- Stockage dans localStorage
- Actions avec ID unique et timestamp
- Retry automatique (max 3 tentatives)
- Suppression automatique après échec
```

### 3. Service de synchronisation

```typescript
// lib/offline/sync-service.ts
- Détection automatique du retour en ligne
- Traitement séquentiel de la queue
- Gestion des erreurs avec retry
- Notifications en temps réel
```

### 4. Format des actions

```typescript
interface SyncAction {
  id: string;              // ID unique généré
  type: "CREATE" | "UPDATE" | "DELETE";
  entity: "client" | "chantier";
  data: any;              // Données de l'action
  timestamp: number;      // Timestamp de création
  retries: number;        // Nombre de tentatives
}
```

## Scénarios d'utilisation

### Scénario 1: Création hors-ligne

```
1. User crée un nouveau client sans réseau
2. L'action est ajoutée à la queue locale
3. L'indicateur montre "1 action en attente"
4. Quand le réseau revient:
   - Synchronisation automatique
   - POST /api/clients avec les données
   - Suppression de l'action de la queue
   - Notification "Synchronisé"
```

### Scénario 2: Modifications multiples

```
1. User modifie 3 clients et crée 2 chantiers
2. 5 actions dans la queue
3. Réseau revient:
   - Traitement séquentiel des 5 actions
   - Progression affichée (1/5, 2/5, etc.)
   - Si erreur: retry automatique
   - Notification finale du résultat
```

### Scénario 3: Échec de synchronisation

```
1. 3 tentatives pour chaque action
2. Si échec après 3 tentatives:
   - Action supprimée de la queue
   - Log d'erreur dans la console
   - Notification d'erreur à l'utilisateur
3. Possibilité de retry manuel
```

## Limitations actuelles

### ⚠️ À noter

1. **Photos en base64**
   - Stockées localement
   - Pas encore supportées par l'API Spring Boot
   - À implémenter avec multipart/form-data

2. **Taille du localStorage**
   - Limite ~5-10MB selon navigateur
   - Pour plus: utiliser IndexedDB

3. **Conflits de données**
   - Pas de gestion des conflits
   - Last-write-wins
   - À améliorer avec versioning

4. **Timeout**
   - 30 secondes par requête
   - Peut échouer avec connexion lente

## Améliorations futures

### 🎯 Roadmap

- [ ] **IndexedDB** pour stockage illimité
- [ ] **Delta sync** pour optimiser la bande passante
- [ ] **Conflict resolution** avec versioning
- [ ] **Background sync** avec Service Worker
- [ ] **Compression** des données avant sync
- [ ] **Priorité** des actions (urgent vs normal)
- [ ] **Upload de fichiers** en multipart
- [ ] **WebSocket** pour sync bidirectionnelle
- [ ] **Optimistic UI** avec rollback

## Debugging

### Console logs

Le système affiche des logs pour chaque action:

```
📝 Action ajoutée à la queue: CREATE client
🔄 Début de la synchronisation de 3 action(s)
🔄 Traitement de l'action: CREATE client
✅ Action supprimée de la queue: 1234567890-abc123
✅ Synchronisation terminée: 3 succès, 0 erreurs
```

### Inspecter la queue

```javascript
// Dans la console du navigateur
localStorage.getItem('webelec_sync_queue')
```

### Forcer une synchronisation

```javascript
import { syncService } from '@/lib/offline';
await syncService.forceSyncNow();
```

### Vider la queue

```javascript
import { syncQueue } from '@/lib/offline';
syncQueue.clear();
```

## Tests

### Simuler le mode hors-ligne

1. **Chrome DevTools**:
   - F12 > Network tab
   - Throttling: "Offline"

2. **Désactiver WiFi**:
   - Mode avion sur mobile
   - Désactiver WiFi/Ethernet

### Tester la synchronisation

```typescript
// 1. Passer hors-ligne
// 2. Créer 3 clients
// 3. Vérifier la queue: 3 actions
// 4. Revenir en ligne
// 5. Observer la synchronisation automatique
```

## Support PWA

L'application est une PWA avec:
- ✅ Manifest
- ✅ Service Worker (à configurer)
- ✅ Installation sur écran d'accueil
- ✅ Mode offline

## Questions fréquentes

### Q: Que se passe-t-il si je ferme l'app avant la sync?
**R**: Les actions restent dans la queue (localStorage). La sync reprendra au prochain lancement.

### Q: Combien de temps sont conservées les actions?
**R**: Jusqu'à synchronisation réussie ou 3 échecs consécutifs.

### Q: Puis-je synchroniser manuellement?
**R**: Oui, via le bouton "Synchroniser maintenant" dans l'indicateur.

### Q: Les photos fonctionnent hors-ligne?
**R**: Oui pour la visualisation, mais l'upload nécessite une connexion.

### Q: Que se passe-t-il en cas de conflit?
**R**: Actuellement, la dernière écriture gagne. Conflict resolution à venir.

## Contributeurs

Pour contribuer au mode hors-ligne:
1. Consulter `lib/offline/`
2. Ajouter des tests
3. Documenter les changements
4. Créer une PR

---

**Version**: 1.0.0
**Dernière mise à jour**: 2026-02-12
