"use client"

import { useRouter } from "next/navigation"
import { Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ActivityItem } from "./ActivityItem"
import type { DashboardEvent } from "@/types/dashboard"

interface RecentActivityProps {
  events: DashboardEvent[]
  isLoading?: boolean
  maxItems?: number
}

function getEntityRoute(entityType: DashboardEvent["entityType"], entityId: string): string {
  const routes: Record<DashboardEvent["entityType"], string> = {
    DEVIS: `/devis/${entityId}`,
    CHANTIER: `/chantiers/${entityId}`,
    FACTURE: `/factures/${entityId}`,
    STOCK: `/stock/${entityId}`,
    RGIE: `/rgie/${entityId}`,
  }
  return routes[entityType]
}

function ActivitySkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-start gap-3">
          <Skeleton className="h-5 w-5 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="rounded-full bg-muted p-3 mb-3">
        <Info className="h-6 w-6 text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground">Aucune activité récente</p>
    </div>
  )
}

export function RecentActivity({ events, isLoading = false, maxItems = 5 }: RecentActivityProps) {
  const router = useRouter()

  const sortedEvents = [...events]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, maxItems)

  const handleEventClick = (event: DashboardEvent) => {
    const route = getEntityRoute(event.entityType, event.entityId)
    router.push(route)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activité récente</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <ActivitySkeleton />
        ) : events.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-2">
            {sortedEvents.map((event) => (
              <ActivityItem
                key={event.id}
                event={event}
                onClick={handleEventClick}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
