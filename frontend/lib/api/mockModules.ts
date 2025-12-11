import type { ModuleDTO } from "@/types";

export const mockModules: ModuleDTO[] = [
  {
    id: 1,
    nom: "Gestion des chantiers",
    description: "Suivi complet des chantiers et interventions associées.",
    categorie: "Opérations",
    version: "1.3.0",
    actif: true
  },
  {
    id: 2,
    nom: "Facturation automatique",
    description: "Génération des devis/factures avec workflow de validation.",
    categorie: "Finance",
    version: "2.0.1",
    actif: false
  },
  {
    id: 3,
    nom: "Pilotage stock IA",
    description: "Optimisation prédictive des mouvements de stock.",
    categorie: "IA",
    version: "0.9.2",
    actif: true
  }
];
