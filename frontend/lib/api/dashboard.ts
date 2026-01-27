import type {
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
 * Fallback : calcule les métriques à partir des événements
 * (utilisé uniquement si l’API est indisponible)
 */
export function calculateMetricsFromEvents(
  events: Array<{
    entityType: "DEVIS" | "CHANTIER" | "FACTURE" | "STOCK" | "RGIE"
    severity: "INFO" | "WARNING" | "CRITICAL"
    entityId: string
  }>
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
