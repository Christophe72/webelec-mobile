import type { ChantierDTO } from "@/types";

export const mockChantiers: ChantierDTO[] = [
  {
    id: 1,
    nom: "Garage - Rue Centrale",
    adresse: "51 rue Centrale, 4000 Liège",
    description: "Installation d'une borne 11kW et tableau secondaire.",
    societe: { id: 1, nom: "Alpha Electric" },
    client: { id: 1, nom: "Dupont", prenom: "Marc" }
  },
  {
    id: 2,
    nom: "Bureaux Martin",
    adresse: "12 avenue des Lilas, 5000 Namur",
    description: "Remise à niveau du réseau prises + RJ45.",
    societe: { id: 1, nom: "Alpha Electric" },
    client: { id: 2, nom: "Martin", prenom: "Julie" }
  },
  {
    id: 3,
    nom: "Boutique Bernard",
    adresse: "8 quai des Artisans, 1000 Bruxelles",
    description: "Relamping LED et maintenance tableau général.",
    societe: { id: 2, nom: "Beta Courant" },
    client: { id: 3, nom: "Bernard", prenom: "Lucas" }
  }
];
