import type { DevisDTO } from "@/types";

export const mockDevis: DevisDTO[] = [
  {
    id: 1,
    numero: "DV-2024-001",
    dateEmission: "2024-01-15",
    dateExpiration: "2024-02-15",
    montantHT: 3500,
    montantTVA: 735,
    montantTTC: 4235,
    statut: "EN_ATTENTE",
    societeId: 1,
    clientId: 1,
    chantierId: 1,
    lignes: [
      {
        description: "Installation borne 11kW",
        quantite: 1,
        prixUnitaire: 2500,
        total: 2500
      },
      {
        description: "Tableau secondaire",
        quantite: 1,
        prixUnitaire: 1000,
        total: 1000
      }
    ]
  },
  {
    id: 2,
    numero: "DV-2024-002",
    dateEmission: "2024-02-02",
    dateExpiration: "2024-03-02",
    montantHT: 2100,
    montantTVA: 441,
    montantTTC: 2541,
    statut: "ACCEPTE",
    societeId: 1,
    clientId: 2,
    chantierId: 2,
    lignes: [
      {
        description: "Remise aux normes prises",
        quantite: 1,
        prixUnitaire: 1300,
        total: 1300
      },
      {
        description: "Réseau RJ45",
        quantite: 1,
        prixUnitaire: 800,
        total: 800
      }
    ]
  },
  {
    id: 3,
    numero: "DV-2024-003",
    dateEmission: "2024-03-10",
    dateExpiration: "2024-04-10",
    montantHT: 4800,
    montantTVA: 1008,
    montantTTC: 5808,
    statut: "EN_ATTENTE",
    societeId: 2,
    clientId: 3,
    chantierId: 3,
    lignes: [
      {
        description: "Relamping LED",
        quantite: 1,
        prixUnitaire: 2800,
        total: 2800
      },
      {
        description: "Maintenance tableau général",
        quantite: 1,
        prixUnitaire: 2000,
        total: 2000
      }
    ]
  }
];
