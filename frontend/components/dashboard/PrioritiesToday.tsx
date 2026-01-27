"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, Package, PhoneOutgoing, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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

function getPriorityAction(priority: Priority): { label: string; route: string } {
  switch (priority.type) {
    case "STOCK":
      return {
        label: "Créer commande",
        route: `/catalogue?action=order&item=${priority.entityId}`,
      }
    case "URGENT":
      if (priority.entityType === "RGIE") {
        return {
          label: "Ouvrir audit",
          route: `/rgie/auditeur-pro/${priority.entityId}`,
        }
      }
      if (priority.entityType === "CHANTIER") {
        return {
          label: "Voir chantier",
          route: `/chantiers/${priority.entityId}`,
        }
      }
      return {
        label: "Voir détails",
        route: getEntityRoute(priority.entityType, priority.entityId),
      }
    case "RELANCE":
      return {
        label: "Contacter client",
        route: `/devis/${priority.entityId}`,
      }
    default:
      return {
        label: "Voir",
        route: getEntityRoute(priority.entityType, priority.entityId),
      }
  }
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
              const action = getPriorityAction(priority)

              return (
                <div
                  key={priority.id}
                  data-testid="priority-item"
                  className={`
                    w-full flex flex-col gap-3 p-3 rounded-lg border
                    transition-colors
                    ${priority.type === "URGENT"
                      ? "border-orange-500/30 bg-orange-500/5"
                      : "border-border/50 bg-background"
                    }
                    ${isAcknowledged ? "opacity-50" : ""}
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <PriorityIcon type={priority.type} />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                          {priority.label}
                        </span>
                        {isAcknowledged && (
                          <span className="text-[10px] text-emerald-600 font-medium">
                            ✓ Fait
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium leading-snug">
                        {priority.message}
                      </p>
                    </div>
                  </div>

                  {!isAcknowledged && (
                    <div className="flex items-center gap-2 pl-8">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(action.route)}
                        className="h-7 text-xs gap-1"
                      >
                        {action.label}
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setDismissedPriorities((prev) => [...prev, priority.id])
                          onAcknowledge?.(priority.id)
                        }}
                        className="text-xs text-muted-foreground hover:text-emerald-600 transition-colors font-medium px-2 py-1 rounded hover:bg-emerald-500/10"
                        data-testid="priority-ack"
                      >
                        Marquer fait
                      </button>
                    </div>
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
