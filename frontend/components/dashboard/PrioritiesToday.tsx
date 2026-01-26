"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, Package, PhoneOutgoing } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { DashboardEvent, AcknowledgedPriority } from "@/types/dashboard"

interface PrioritiesTodayProps {
  events: DashboardEvent[]
  acknowledgedPriorities?: AcknowledgedPriority[]
  onAcknowledge?: (priorityId: string) => void | Promise<void>
}

type PriorityType = "URGENT" | "STOCK" | "RELANCE"

interface Priority {
  id: string
  type: PriorityType
  label: string
  message: string
  entityType: DashboardEvent["entityType"]
  entityId: string
}

/**
 * Calcule les priorités selon les règles métier V1
 */
function calculatePriorities(events: DashboardEvent[]): Priority[] {
  const priorities: Priority[] = []

  for (const event of events) {
    const priorityId = `${event.entityType}:${event.entityId}:${event.severity}`

    // Règle 1 : CRITICAL → Intervention urgente
    if (event.severity === "CRITICAL") {
      priorities.push({
        id: priorityId,
        type: "URGENT",
        label: "Intervention urgente",
        message: event.message,
        entityType: event.entityType,
        entityId: event.entityId,
      })
      continue
    }

    // Règle 2 : WARNING + STOCK → Commande à prévoir
    if (event.severity === "WARNING" && event.entityType === "STOCK") {
      priorities.push({
        id: priorityId,
        type: "STOCK",
        label: "Commande à prévoir",
        message: event.message,
        entityType: event.entityType,
        entityId: event.entityId,
      })
      continue
    }

    // Règle 3 : WARNING + DEVIS → Relance client
    if (event.severity === "WARNING" && event.entityType === "DEVIS") {
      priorities.push({
        id: priorityId,
        type: "RELANCE",
        label: "Relance client",
        message: event.message,
        entityType: event.entityType,
        entityId: event.entityId,
      })
      continue
    }

    // Autres ignorés
  }

  // Limiter à 5 priorités
  return priorities.slice(0, 5)
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

function PriorityIcon({ type }: { type: PriorityType }) {
  const iconProps = { className: "h-5 w-5 flex-shrink-0" }

  switch (type) {
    case "URGENT":
      return <AlertCircle {...iconProps} className="h-5 w-5 shrink-0 text-orange-600" />
    case "STOCK":
      return <Package {...iconProps} className="h-5 w-5 shrink-0 text-amber-500" />
    case "RELANCE":
      return <PhoneOutgoing {...iconProps} className="h-5 w-5 shrink-0 text-blue-500" />
  }
}

export function timeAgo(date: string | Date) {
  const diff = Date.now() - new Date(date).getTime()
  const minutes = Math.floor(diff / 60000)

  if (minutes < 1) return "à l’instant"
  if (minutes < 60) return `il y a ${minutes} min`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `il y a ${hours} h`

  const days = Math.floor(hours / 24)
  return `il y a ${days} j`
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-6 text-center">
      <p className="text-sm text-neutral-400">Aucune priorité active</p>
      <p className="mt-1 text-xs text-neutral-500">Tout est traité pour le moment.</p>
    </div>
  )
}

export function PrioritiesToday({
  events,
  acknowledgedPriorities = [],
  onAcknowledge,
}: PrioritiesTodayProps) {
  const router = useRouter()
  const [dismissedPriorities, setDismissedPriorities] = useState<string[]>([])

  const priorities = calculatePriorities(events)
  const acknowledgedMap = useMemo(
    () => new Map(acknowledgedPriorities.map((ack) => [ack.priorityId, ack.acknowledgedAt])),
    [acknowledgedPriorities]
  )
  const activePriorities = priorities.filter(
    (priority) => !acknowledgedMap.has(priority.id) && !dismissedPriorities.includes(priority.id)
  )
  const visiblePriorities = priorities.filter(
    (priority) => !dismissedPriorities.includes(priority.id)
  )

  const handlePriorityClick = (priority: Priority) => {
    const route = getEntityRoute(priority.entityType, priority.entityId)
    router.push(route)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Priorités du jour</CardTitle>
      </CardHeader>
      <CardContent>
        {activePriorities.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-1">
            {visiblePriorities.map((priority) => {
              const acknowledgedAt = acknowledgedMap.get(priority.id)
              const isAcknowledged = Boolean(acknowledgedAt)
              return (
                <div
                  key={priority.id}
                  data-testid="priority-item"
                  className={`
                    w-full flex items-start gap-3 p-3 rounded-lg
                    transition-colors hover:bg-muted/50 group
                    ${priority.type === "URGENT" ? "bg-orange-50/50 dark:bg-orange-950/20" : ""}
                    ${isAcknowledged ? "opacity-60" : ""}
                  `}
                >
                  <PriorityIcon type={priority.type} />
                  <button
                    type="button"
                    onClick={() => handlePriorityClick(priority)}
                    className="flex-1 min-w-0 text-left"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        {priority.label}
                      </span>
                    </div>
                    <p className="text-sm font-medium leading-tight truncate">
                      {priority.message}
                    </p>
                  </button>
                  {acknowledgedAt ? (
                    <p className="text-xs text-neutral-500">
                      Traité {timeAgo(acknowledgedAt)}
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setDismissedPriorities((prev) => [...prev, priority.id])
                        onAcknowledge?.(priority.id)
                      }}
                    className="text-xs text-muted-foreground hover:text-foreground"
                    data-testid="priority-ack"
                  >
                    ✓ Traité
                  </button>
                )}
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
