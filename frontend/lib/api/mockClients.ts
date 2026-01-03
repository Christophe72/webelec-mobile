import type { ClientDTO } from "@/types";

export const mockClients: ClientDTO[] = [
  {
    id: 1,
    nom: "Dupont",
    prenom: "Marc",
    telephone: "0470/11.22.33",
    adresse: "51 rue Centrale, 4000 Liège",
    societe: { id: 1, nom: "Alpha Electric" }
  },
  {
    id: 2,
    nom: "Martin",
    prenom: "Julie",
    telephone: "0471/55.66.77",
    adresse: "12 avenue des Lilas, 5000 Namur",
    societe: { id: 1, nom: "Alpha Electric" }
  },
  {
    id: 3,
    nom: "Bernard",
    prenom: "Lucas",
    telephone: "0472/99.00.11",
    adresse: "8 quai des Artisans, 1000 Bruxelles",
    societe: { id: 2, nom: "Beta Courant" }
  }
];
