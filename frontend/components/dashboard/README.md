# RecentActivity Component

Composant d'affichage de l'activité récente pour le dashboard WebElec SaaS.

## 📋 Description

Affiche une liste d'événements métier en lecture seule, triés par date décroissante. Chaque événement est cliquable et redirige vers la page de détail correspondante.

## 🎯 Responsabilités

- ✅ Afficher les événements fournis en props
- ✅ Trier par date décroissante automatiquement
- ✅ Gérer les états : chargement, vide, normal
- ✅ Redirection au clic selon le type d'entité
- ❌ Pas de logique métier
- ❌ Pas de state global
- ❌ Pas de notifications temps réel

## 📦 Props

```typescript
interface RecentActivityProps {
  events: DashboardEvent[]
  isLoading?: boolean  // Optionnel, défaut: false
}

type DashboardEvent = {
  id: string
  severity: "INFO" | "WARNING" | "CRITICAL"
  message: string
  entityType: "DEVIS" | "CHANTIER" | "FACTURE" | "STOCK" | "RGIE"
  entityId: string
  createdAt: string  // ISO 8601 format
}
```

## 🎨 UI Behavior

### Severities

| Severity   | Icône           | Couleur       | Fond (CRITICAL uniquement)          |
|------------|-----------------|---------------|-------------------------------------|
| INFO       | Info            | Bleu          | Aucun                               |
| WARNING    | AlertTriangle   | Ambre         | Aucun                               |
| CRITICAL   | AlertCircle     | Orange        | `bg-orange-50/50` (light mode)      |

### États

1. **Loading** (`isLoading={true}`)
   - Affiche 5 lignes de skeleton
   - Pas de données visibles

2. **Empty** (`events={[]}`)
   - Icône Info centrée
   - Texte : "Aucune activité récente"

3. **Normal** (`events={data}`)
   - Liste des événements triés
   - Hover sur chaque ligne
   - CRITICAL avec fond discret

### Format de date

- "à l'instant" : < 60s
- "il y a X minute(s)" : < 1h
- "il y a X heure(s)" : < 24h
- "il y a X jour(s)" : ≥ 24h

### Redirections

| entityType | Route                  |
|------------|------------------------|
| DEVIS      | `/devis/{entityId}`    |
| CHANTIER   | `/chantiers/{entityId}`|
| FACTURE    | `/factures/{entityId}` |
| STOCK      | `/stock/{entityId}`    |
| RGIE       | `/rgie/{entityId}`     |

## 🚀 Usage

### Cas 1 : Intégration basique

```tsx
import { RecentActivity } from "@/components/dashboard/RecentActivity"

export default function DashboardPage() {
  const [events, setEvents] = useState<DashboardEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard/events')
      .then(res => res.json())
      .then(data => {
        setEvents(data)
        setIsLoading(false)
      })
  }, [])

  return (
    <div className="grid gap-6">
      <RecentActivity events={events} isLoading={isLoading} />
    </div>
  )
}
```

### Cas 2 : Server Component (Next.js App Router)

```tsx
// app/dashboard/page.tsx
import { RecentActivity } from "@/components/dashboard/RecentActivity"

async function getRecentEvents() {
  const res = await fetch('http://localhost:8080/api/dashboard/events', {
    cache: 'no-store'
  })
  return res.json()
}

export default async function DashboardPage() {
  const events = await getRecentEvents()

  return (
    <div className="grid gap-6">
      <RecentActivity events={events} />
    </div>
  )
}
```

### Cas 3 : Avec données mockées (développement)

```tsx
const MOCK_EVENTS = [
  {
    id: "1",
    severity: "CRITICAL",
    message: "RGIE : Non-conformité critique détectée",
    entityType: "RGIE",
    entityId: "RGIE-2024-042",
    createdAt: new Date().toISOString(),
  },
  // ...
]

<RecentActivity events={MOCK_EVENTS} />
```

## 📐 Layout

Le composant est responsive et s'adapte à son conteneur. Exemples de layouts recommandés :

```tsx
// Pleine largeur
<div className="w-full">
  <RecentActivity events={events} />
</div>

// Grid 3 colonnes (desktop)
<div className="grid gap-6 md:grid-cols-3">
  <div className="md:col-span-1">
    <RecentActivity events={events} />
  </div>
</div>

// Sidebar
<aside className="w-80">
  <RecentActivity events={events} />
</aside>
```

## 🧪 Tests

### Données de test

Voir `app/dashboard/page-example.tsx` pour des exemples complets avec :
- Événements variés (INFO, WARNING, CRITICAL)
- Différentes dates relatives
- Tous les types d'entités
- État vide
- État de chargement

### Cas à tester

- [ ] Affichage avec 0 événement
- [ ] Affichage avec 1 événement
- [ ] Affichage avec 10+ événements
- [ ] Clic sur un événement → redirection correcte
- [ ] Affichage skeleton en chargement
- [ ] Message tronqué avec ellipsis
- [ ] Tri par date (plus récent en premier)
- [ ] Affichage CRITICAL distinct
- [ ] Format de date relatif correct

## 🔧 Maintenance

### Modifier les couleurs

Éditer `SeverityIcon` dans `RecentActivity.tsx` :

```tsx
case "INFO":
  return <Info className="h-5 w-5 text-blue-500" />
```

### Modifier le format de date

Éditer la fonction `getRelativeTime` :

```tsx
function getRelativeTime(dateString: string): string {
  // Votre logique personnalisée
}
```

### Ajouter un type d'entité

1. Ajouter dans le type `entityType`
2. Ajouter la route dans `getEntityRoute`

```tsx
const routes = {
  // ...
  NOUVEAU_TYPE: `/nouveau-type/${entityId}`,
}
```

## 🚫 Anti-patterns

❌ **Ne pas faire** :

```tsx
// ❌ Fetch directement dans le composant
function RecentActivity() {
  useEffect(() => {
    fetch('/api/events').then(...)
  }, [])
}

// ❌ État global (Redux, Zustand...)
const events = useGlobalStore(state => state.events)

// ❌ Logique métier
if (event.entityType === "DEVIS" && event.severity === "CRITICAL") {
  sendNotification() // ❌
}

// ❌ Mutation des données
events.push(newEvent) // ❌
```

✅ **À faire** :

```tsx
// ✅ Données passées en props
<RecentActivity events={events} />

// ✅ Tri immutable
const sorted = [...events].sort(...)

// ✅ Responsabilité unique : affichage
```

## 📚 Dépendances

- `lucide-react` : Icônes (Info, AlertTriangle, AlertCircle)
- `next/navigation` : Router pour les redirections
- `@/components/ui/card` : shadcn/ui Card
- `@/components/ui/skeleton` : shadcn/ui Skeleton

## 🤝 Intégration Backend

Le backend doit fournir un endpoint qui retourne :

```json
GET /api/dashboard/events

[
  {
    "id": "evt-001",
    "severity": "INFO",
    "message": "Nouveau devis créé",
    "entityType": "DEVIS",
    "entityId": "DEV-2024-001",
    "createdAt": "2024-01-26T14:30:00Z"
  }
]
```

**Contrat strict** : Le backend doit gérer :
- Pagination (limitez à 10-20 événements récents)
- Tri par date (déjà fait côté front, mais recommandé côté back)
- Filtrage par société (multi-tenant)
- Sécurité (authentification JWT)

## 📄 License

Propriété de WebElec SaaS.
