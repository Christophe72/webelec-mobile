"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { HardHat, AlertTriangle, ShieldAlert, Bell, LucideIcon } from "lucide-react"
import type { DashboardMetrics } from "@/types/dashboard"

interface DashboardKPIsProps {
  metrics: DashboardMetrics | null
  isLoading?: boolean
  hasError?: boolean
}

type KPIConfig = {
  label: string
  key: keyof DashboardMetrics
  icon: LucideIcon
  href: string
  emptyText: string
}

const kpiConfigs: KPIConfig[] = [
  {
    label: "Chantiers actifs",
    key: "activeSitesCount",
    icon: HardHat,
    href: "/chantiers?status=actif",
    emptyText: "Aucun chantier",
  },
  {
    label: "Alertes stock",
    key: "stockAlertsCount",
    icon: AlertTriangle,
    href: "/catalogue?filter=stock-low",
    emptyText: "Aucune alerte",
  },
  {
    label: "Alertes RGIE",
    key: "rgieAlertsCount",
    icon: ShieldAlert,
    href: "/rgie/auditeur-pro?filter=alerts",
    emptyText: "Aucune alerte",
  },
  {
    label: "Notifications critiques",
    key: "criticalNotificationsCount",
    icon: Bell,
    href: "/notifications?filter=critical",
    emptyText: "Aucune alerte",
  },
]

function getStatusBadge(value: number, isAlert: boolean = false) {
  if (value === 0) {
    return (
      <span className="inline-flex items-center rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600">
        OK
      </span>
    )
  }

  if (isAlert) {
    return value >= 5 ? (
      <span className="inline-flex items-center rounded-md border border-orange-500/20 bg-orange-500/10 px-2 py-0.5 text-xs font-medium text-orange-600">
        Critique
      </span>
    ) : (
      <span className="inline-flex items-center rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600">
        Attention
      </span>
    )
  }

  return null
}

function KPISkeleton() {
  return (
    <>
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="h-5 w-5 bg-muted animate-pulse rounded" />
              <div className="h-5 w-12 bg-muted animate-pulse rounded-md" />
            </div>
            <div className="space-y-2">
              <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              <div className="h-3 w-24 bg-muted animate-pulse rounded" />
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  )
}

export function DashboardKPIs({ metrics, isLoading, hasError }: DashboardKPIsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPISkeleton />
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpiConfigs.map((config) => {
        const value = hasError || !metrics ? null : metrics[config.key]
        const isAlert = config.key !== "activeSitesCount"
        const Icon = config.icon

        return (
          <Link
            key={config.key}
            href={config.href}
            aria-label={`Voir ${config.label.toLowerCase()}`}
            className="block focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg"
          >
            <Card className="border-border/50 transition-all hover:border-primary/30 hover:shadow-md cursor-pointer h-full">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  {hasError || value === null ? (
                    <span className="inline-flex items-center rounded-md border border-neutral-500/20 bg-neutral-500/10 px-2 py-0.5 text-xs font-medium text-neutral-500">
                      Indispo
                    </span>
                  ) : (
                    getStatusBadge(value, isAlert)
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold tabular-nums">
                    {hasError || value === null ? "—" : value}
                  </p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                    {config.label}
                  </p>
                  {value === 0 && !hasError && (
                    <p className="text-[10px] text-emerald-600 font-medium">
                      {config.emptyText}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}

