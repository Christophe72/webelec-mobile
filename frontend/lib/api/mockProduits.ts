import type { ProduitDTO } from "@/types";

export const mockProduits: ProduitDTO[] = [
  {
    id: 1,
    reference: "PRD-001",
    nom: "Disjoncteur 32A",
    description: "Disjoncteur modulable courbe C 32A",
    quantiteStock: 25,
    prixUnitaire: 18.5,
    societeId: 1
  },
  {
    id: 2,
    reference: "PRD-002",
    nom: "Tableau électrique 18 modules",
    description: "Tableau pré-équipé résidentiel",
    quantiteStock: 8,
    prixUnitaire: 145,
    societeId: 1
  },
  {
    id: 3,
    reference: "PRD-003",
    nom: "Courant faible - coffret RJ45",
    description: "Coffret de communication grade 3",
    quantiteStock: 4,
    prixUnitaire: 220,
    societeId: 2
  }
];
