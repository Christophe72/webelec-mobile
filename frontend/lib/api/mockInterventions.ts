import type { InterventionDTO } from "@/types";

export const mockInterventions: InterventionDTO[] = [
  {
    id: 1,
    titre: "Remplacement DDR atelier",
    description: "Remplacement différentiel principal 30 mA",
    dateIntervention: "2025-01-12",
    societeId: 1,
    chantierId: 1,
    clientId: 1,
    statut: "PLANIFIEE"
  },
  {
    id: 2,
    titre: "Maintenance tableau bureaux",
    description: "Serrage et contrôle thermographique",
    dateIntervention: "2025-01-18",
    societeId: 1,
    chantierId: 2,
    clientId: 2,
    statut: "EN_COURS"
  },
  {
    id: 3,
    titre: "Pose IRVE 11kW",
    description: "Installation borne monophasée parking",
    dateIntervention: "2025-01-20",
    societeId: 2,
    chantierId: 3,
    clientId: 3,
    statut: "PLANIFIEE"
  }
];
