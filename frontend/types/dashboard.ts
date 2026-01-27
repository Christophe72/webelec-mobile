export type DashboardEvent = {
    id: string
    severity: "INFO" | "WARNING" | "CRITICAL"
    message: string
    entityType: "DEVIS" | "CHANTIER" | "FACTURE" | "STOCK" | "RGIE"
    entityId: string
    createdAt: string
}

export type AcknowledgedPriority = {
    priorityId: string
    acknowledgedAt: string
}

export type DashboardMetrics = {
    activeSitesCount: number
    stockAlertsCount: number
    rgieAlertsCount: number
    criticalNotificationsCount: number
}

export type DashboardMetricsResponse = {
    metrics: DashboardMetrics
    status: "success" | "error"
    error?: string
}
