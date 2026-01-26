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
