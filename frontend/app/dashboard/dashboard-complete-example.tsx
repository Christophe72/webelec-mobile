// Exemple complet d'utilisation de RecentActivity + PrioritiesToday
// À intégrer dans votre page dashboard

"use client"

import { RecentActivity } from "@/components/dashboard/RecentActivity"
import { PrioritiesToday } from "@/components/dashboard/PrioritiesToday"
import { useState, useEffect } from "react"
import type { DashboardEvent } from "@/types/dashboard"

// Données mockées complètes pour tester les deux composants
const MOCK_EVENTS: DashboardEvent[] = [
  {
    id: "1",
    severity: "CRITICAL",
    message: "RGIE : Non-conformité détectée sur l'installation électrique Rue du Commerce",
    entityType: "RGIE",
    entityId: "RGIE-2024-042",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // il y a 30 min
  },
  {
    id: "2",
    severity: "WARNING",
    message: "Stock faible : Disjoncteurs 16A (5 unités restantes)",
    entityType: "STOCK",
    entityId: "STOCK-001",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // il y a 2h
  },
  {
    id: "3",
    severity: "WARNING",
    message: "Devis expirant dans 3 jours : Rénovation complète Garage Dubois",
    entityType: "DEVIS",
    entityId: "DEV-2024-078",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // il y a 4h
  },
  {
    id: "4",
    severity: "CRITICAL",
    message: "Intervention urgente requise : Panne électrique totale chez Martin & Fils",
    entityType: "CHANTIER",
    entityId: "CHAN-URGENT-001",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // il y a 6h
  },
  {
    id: "5",
    severity: "INFO",
    message: "Nouveau devis créé pour le chantier Avenue des Lilas",
    entityType: "DEVIS",
    entityId: "DEV-2024-001",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // il y a 8h
  },
  {
    id: "6",
    severity: "WARNING",
    message: "Stock critique : Câbles 2.5mm² (2 rouleaux restants)",
    entityType: "STOCK",
    entityId: "STOCK-002",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // il y a 12h
  },
  {
    id: "7",
    severity: "INFO",
    message: "Facture générée pour le chantier Impasse des Érables",
    entityType: "FACTURE",
    entityId: "FACT-2024-128",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // il y a 1 jour
  },
  {
    id: "8",
    severity: "WARNING",
    message: "Devis sans réponse depuis 15 jours : Installation complète Société ABC",
    entityType: "DEVIS",
    entityId: "DEV-2024-052",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // il y a 2 jours
  },
  {
    id: "9",
    severity: "INFO",
    message: "Chantier terminé : Installation complète chez Client XYZ",
    entityType: "CHANTIER",
    entityId: "CHAN-2024-089",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // il y a 3 jours
  },
]

export default function DashboardPage() {
  const [events, setEvents] = useState<DashboardEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simuler le chargement depuis l'API
    const fetchEvents = async () => {
      setIsLoading(true)

      // Simuler un délai réseau
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // En production, remplacer par :
      // const response = await fetch('/api/dashboard/events')
      // const data = await response.json()
      // setEvents(data)

      setEvents(MOCK_EVENTS)
      setIsLoading(false)
    }

    fetchEvents()
  }, [])

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Vue d&apos;ensemble de votre activité électrique
        </p>
      </div>

      {/* Layout du dashboard */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Priorités du jour - Colonne de gauche */}
        <div className="lg:col-span-1">
          <PrioritiesToday events={events} />
        </div>

        {/* Activité récente - Colonne centrale/droite */}
        <div className="md:col-span-1 lg:col-span-2">
          <RecentActivity events={events} isLoading={isLoading} />
        </div>
      </div>

      {/* Autres widgets du dashboard peuvent aller ici */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Exemple : KPIs, graphiques, etc. */}
      </div>
    </div>
  )
}

// ========================================
// Cas de test pour PrioritiesToday
// ========================================

// Cas 1 : Aucune priorité (tous INFO)
export function DashboardNoPriorities() {
  const events: DashboardEvent[] = [
    {
      id: "1",
      severity: "INFO",
      message: "Nouveau devis créé",
      entityType: "DEVIS",
      entityId: "DEV-001",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      severity: "INFO",
      message: "Facture générée",
      entityType: "FACTURE",
      entityId: "FACT-001",
      createdAt: new Date().toISOString(),
    },
  ]

  return (
    <div className="p-6">
      <PrioritiesToday events={events} />
    </div>
  )
}

// Cas 2 : Uniquement des interventions urgentes (CRITICAL)
export function DashboardUrgentOnly() {
  const events: DashboardEvent[] = [
    {
      id: "1",
      severity: "CRITICAL",
      message: "Panne électrique totale - Intervention immédiate requise",
      entityType: "CHANTIER",
      entityId: "CHAN-URGENT-001",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      severity: "CRITICAL",
      message: "RGIE : Non-conformité majeure détectée",
      entityType: "RGIE",
      entityId: "RGIE-2024-042",
      createdAt: new Date().toISOString(),
    },
  ]

  return (
    <div className="p-6">
      <PrioritiesToday events={events} />
    </div>
  )
}

// Cas 3 : Mix de priorités (stock + relance + urgent)
export function DashboardMixedPriorities() {
  const events: DashboardEvent[] = [
    {
      id: "1",
      severity: "CRITICAL",
      message: "Intervention urgente chez Client A",
      entityType: "CHANTIER",
      entityId: "CHAN-001",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      severity: "WARNING",
      message: "Stock faible : Disjoncteurs 16A",
      entityType: "STOCK",
      entityId: "STOCK-001",
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      severity: "WARNING",
      message: "Devis expirant bientôt",
      entityType: "DEVIS",
      entityId: "DEV-001",
      createdAt: new Date().toISOString(),
    },
  ]

  return (
    <div className="p-6">
      <PrioritiesToday events={events} />
    </div>
  )
}

// Cas 4 : Plus de 5 priorités (test de la limite)
export function DashboardTooManyPriorities() {
  const events: DashboardEvent[] = [
    // 3 CRITICAL
    {
      id: "1",
      severity: "CRITICAL",
      message: "Urgence 1",
      entityType: "RGIE",
      entityId: "RGIE-001",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      severity: "CRITICAL",
      message: "Urgence 2",
      entityType: "CHANTIER",
      entityId: "CHAN-001",
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      severity: "CRITICAL",
      message: "Urgence 3",
      entityType: "FACTURE",
      entityId: "FACT-001",
      createdAt: new Date().toISOString(),
    },
    // 2 STOCK
    {
      id: "4",
      severity: "WARNING",
      message: "Stock faible 1",
      entityType: "STOCK",
      entityId: "STOCK-001",
      createdAt: new Date().toISOString(),
    },
    {
      id: "5",
      severity: "WARNING",
      message: "Stock faible 2",
      entityType: "STOCK",
      entityId: "STOCK-002",
      createdAt: new Date().toISOString(),
    },
    // 2 DEVIS (seul le premier sera affiché car max 5)
    {
      id: "6",
      severity: "WARNING",
      message: "Relance 1",
      entityType: "DEVIS",
      entityId: "DEV-001",
      createdAt: new Date().toISOString(),
    },
    {
      id: "7",
      severity: "WARNING",
      message: "Relance 2 (ne sera pas affichée)",
      entityType: "DEVIS",
      entityId: "DEV-002",
      createdAt: new Date().toISOString(),
    },
  ]

  return (
    <div className="p-6 space-y-4">
      <p className="text-sm text-muted-foreground">
        7 événements prioritaires, mais seuls les 5 premiers sont affichés
      </p>
      <PrioritiesToday events={events} />
    </div>
  )
}
