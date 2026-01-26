// Exemple d'utilisation du composant RecentActivity
// À intégrer dans votre page dashboard

"use client"

import { RecentActivity } from "@/components/dashboard/RecentActivity"
import { useState, useEffect } from "react"
import { MOCK_EVENTS } from "@/app/dashboard/mockEvents"
import type { DashboardEvent } from "@/types/dashboard"

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
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Autres widgets du dashboard */}
        <div className="md:col-span-2 lg:col-span-1">
          <RecentActivity events={events} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}

// Cas d'utilisation alternatifs :

// 1. Avec données vides
export function DashboardEmpty() {
  return <RecentActivity events={[]} isLoading={false} />
}

// 2. En chargement
export function DashboardLoading() {
  return <RecentActivity events={[]} isLoading={true} />
}

// 3. Avec un seul événement CRITICAL
export function DashboardCritical() {
  return (
    <RecentActivity
      events={[
        {
          id: "1",
          severity: "CRITICAL",
          message: "Intervention urgente requise : Panne électrique totale chez Client XYZ",
          entityType: "CHANTIER",
          entityId: "CHAN-URGENT-001",
          createdAt: new Date().toISOString(),
        },
      ]}
      isLoading={false}
    />
  )
}
