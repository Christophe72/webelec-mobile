import type { DashboardEvent } from "@/types/dashboard"

// Données mockées pour tester
export const MOCK_EVENTS: DashboardEvent[] = [
  {
    id: "1",
    severity: "INFO",
    message: "Nouveau devis créé pour le chantier Avenue des Lilas",
    entityType: "DEVIS",
    entityId: "DEV-2024-001",
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // il y a 15 min
  },
  {
    id: "2",
    severity: "WARNING",
    message: "Stock faible : Disjoncteurs 16A (5 unités restantes)",
    entityType: "STOCK",
    entityId: "STOCK-001",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // il y a 2h
  },
  {
    id: "3",
    severity: "CRITICAL",
    message: "RGIE : Non-conformité détectée sur l'installation électrique Rue du Commerce",
    entityType: "RGIE",
    entityId: "RGIE-2024-042",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // il y a 5h
  },
  {
    id: "4",
    severity: "INFO",
    message: "Facture générée pour le chantier Impasse des Érables",
    entityType: "FACTURE",
    entityId: "FACT-2024-128",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // il y a 1 jour
  },
  {
    id: "5",
    severity: "INFO",
    message: "Chantier terminé : Installation complète chez Martin & Fils SPRL",
    entityType: "CHANTIER",
    entityId: "CHAN-2024-089",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // il y a 2 jours
  },
  {
    id: "6",
    severity: "WARNING",
    message: "Devis expirant dans 3 jours : Rénovation complète Garage Dubois",
    entityType: "DEVIS",
    entityId: "DEV-2024-078",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // il y a 3 jours
  },
]
