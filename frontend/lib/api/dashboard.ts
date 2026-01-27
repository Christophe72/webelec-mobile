import type { DashboardMetricsResponse } from "@/lib/types/dashboard"
import { bffFetch } from "@/lib/api/bffFetch"

/**
 * Récupère les métriques du dashboard via le proxy Next.js
 * Ne jamais appeler le backend directement depuis le client (CORS, 403, etc.)
 */
export async function fetchDashboardMetrics(): Promise<DashboardMetricsResponse> {
  try {
    const res = await bffFetch("/api/dashboard/metrics", {
      cache: "no-store",
    })

    if (!res.ok) {
      return {
        status: "error",
        error: `Erreur API: ${res.status}`,
        metrics: {
          activeSitesCount: 0,
          stockAlertsCount: 0,
          rgieAlertsCount: 0,
          criticalNotificationsCount: 0,
        },
      }
    }

    const data = await res.json()
    if (data?.status === "error") {
      return {
        status: "error",
        error: data.error ?? "Erreur API",
        metrics: data.metrics ?? {
          activeSitesCount: 0,
          stockAlertsCount: 0,
          rgieAlertsCount: 0,
          criticalNotificationsCount: 0,
        },
      }
    }

    return {
      status: "success",
      metrics: data.metrics || data,
    }
  } catch (error) {
    console.error("Erreur lors du chargement des métriques:", error)
    return {
      status: "error",
      error: error instanceof Error ? error.message : "Erreur inconnue",
      metrics: {
        activeSitesCount: 0,
        stockAlertsCount: 0,
        rgieAlertsCount: 0,
        criticalNotificationsCount: 0,
      },
    }
  }
}

/**
 * Calcule les métriques à partir des événements (fallback si API indisponible)
 */
export function calculateMetricsFromEvents(
  events: Array<{
    entityType: string
    severity: string
  }>
) {
  const chantiersActifs = new Set(
    events.filter(e => e.entityType === "CHANTIER").map((_, i) => i)
  ).size

  const alertesStock = events.filter(
    e => e.entityType === "STOCK" && (e.severity === "WARNING" || e.severity === "CRITICAL")
  ).length

  const alertesRGIE = events.filter(
    e => e.entityType === "RGIE" && e.severity === "CRITICAL"
  ).length

  const notificationsCritiques = events.filter(
    e => e.severity === "CRITICAL"
  ).length

  return {
    activeSitesCount: chantiersActifs,
    stockAlertsCount: alertesStock,
    rgieAlertsCount: alertesRGIE,
    criticalNotificationsCount: notificationsCritiques,
  }
}
