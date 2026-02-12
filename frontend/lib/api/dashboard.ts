import type {
  DashboardEvent,
  DashboardEventsResponse,
  DashboardMetrics,
  DashboardMetricsResponse,
} from "@/types/dashboard"
import { bffFetch } from "@/lib/api/bffFetch"

/**
 * Récupère les métriques du dashboard via la BFF Next.js
 * Le backend Spring n'est JAMAIS appelé directement
 */
export async function fetchDashboardMetrics(
  token: string
): Promise<DashboardMetricsResponse> {
  try {
    const data = await bffFetch<DashboardMetricsResponse>(
      "/api/dashboard/metrics",
      token
    )

    if (data.status === "error") {
      return {
        status: "error",
        error: data.error ?? "Erreur API",
        metrics: data.metrics ?? emptyMetrics(),
      }
    }

    return {
      status: "success",
      metrics: data.metrics,
    }
  } catch (error) {
    const status =
      typeof error === "object" && error !== null && "status" in error
        ? (error as { status?: number }).status
        : undefined
    if (status !== 401) {
      console.error("Erreur lors du chargement des métriques:", error)
    }

    return {
      status: "error",
      error:
        status === 401
          ? "Non autorisé"
          : error instanceof Error
            ? error.message
            : "Erreur inconnue",
      metrics: emptyMetrics(),
    }
  }
}

/**
 * Récupère les événements du dashboard via la BFF Next.js
 */
export async function fetchDashboardEvents(
  token: string
): Promise<DashboardEventsResponse> {
  try {
    const data = await bffFetch<DashboardEventsResponse>(
      "/api/dashboard/events",
      token
    )

    if (data.status === "error") {
      return {
        status: "error",
        error: data.error ?? "Erreur API",
        events: data.events ?? [],
      }
    }

    return {
      status: "success",
      events: data.events ?? [],
    }
  } catch (error) {
    const status =
      typeof error === "object" && error !== null && "status" in error
        ? (error as { status?: number }).status
        : undefined

    return {
      status: "error",
      error:
        status === 401
          ? "Non autorisé"
          : error instanceof Error
            ? error.message
            : "Erreur inconnue",
      events: [],
    }
  }
}

/**
 * Fallback : calcule les métriques à partir des événements
 * (utilisé uniquement si l’API est indisponible)
 */
export function calculateMetricsFromEvents(
  events: Pick<DashboardEvent, "entityType" | "severity" | "entityId">[]
): DashboardMetrics {
  const chantiersActifs = new Set(
    events
      .filter(e => e.entityType === "CHANTIER")
      .map(e => e.entityId)
  ).size

  const stockAlertsCount = events.filter(
    e =>
      e.entityType === "STOCK" &&
      (e.severity === "WARNING" || e.severity === "CRITICAL")
  ).length

  const rgieAlertsCount = events.filter(
    e => e.entityType === "RGIE" && e.severity === "CRITICAL"
  ).length

  const criticalNotificationsCount = events.filter(
    e => e.severity === "CRITICAL"
  ).length

  return {
    activeSitesCount: chantiersActifs,
    stockAlertsCount,
    rgieAlertsCount,
    criticalNotificationsCount,
  }
}

/**
 * Métriques vides centralisées (évite les duplications)
 */
function emptyMetrics(): DashboardMetrics {
  return {
    activeSitesCount: 0,
    stockAlertsCount: 0,
    rgieAlertsCount: 0,
    criticalNotificationsCount: 0,
  }
}
