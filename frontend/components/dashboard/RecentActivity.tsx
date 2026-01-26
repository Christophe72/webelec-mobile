"use client"

import { useRouter } from "next/navigation"
import { Info, AlertTriangle, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { DashboardEvent } from "@/types/dashboard"

interface RecentActivityProps {
  events: DashboardEvent[]
  isLoading?: boolean
}

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return "à l'instant"
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `il y a ${minutes} minute${minutes > 1 ? "s" : ""}`
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `il y a ${hours} heure${hours > 1 ? "s" : ""}`
  }
  const days = Math.floor(diffInSeconds / 86400)
  return `il y a ${days} jour${days > 1 ? "s" : ""}`
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

function SeverityIcon({ severity }: { severity: DashboardEvent["severity"] }) {
  const iconProps = { className: "h-5 w-5 flex-shrink-0" }

  switch (severity) {
    case "INFO":
      return <Info {...iconProps} className="h-5 w-5 shrink-0 text-blue-500" />
    case "WARNING":
      return <AlertTriangle {...iconProps} className="h-5 w-5 shrink-0 text-amber-500" />
    case "CRITICAL":
      return <AlertCircle {...iconProps} className="h-5 w-5 shrink-0 text-orange-600" />
  }
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

export function RecentActivity({ events, isLoading = false }: RecentActivityProps) {
  const router = useRouter()

  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

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
          <div className="space-y-1">
            {sortedEvents.map((event) => (
              <button
                key={event.id}
                onClick={() => handleEventClick(event)}
                className={`
                  w-full flex items-start gap-3 p-3 rounded-lg text-left
                  transition-colors hover:bg-muted/50
                  ${event.severity === "CRITICAL" ? "bg-orange-50/50 dark:bg-orange-950/20" : ""}
                `}
              >
                <SeverityIcon severity={event.severity} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-none mb-1 truncate">
                    {event.message}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {getRelativeTime(event.createdAt)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
