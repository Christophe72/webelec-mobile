import type { ClientDTO } from "@/types";

export const mockClients: ClientDTO[] = [
  {
    id: 1,
    nom: "Dupont",
    prenom: "Marc",
    email: "marc.dupont@example.com",
    telephone: "0470/11.22.33",
    adresse: "51 rue Centrale, 4000 Liège",
    societeId: 1
  },
  {
    id: 2,
    nom: "Martin",
    prenom: "Julie",
    email: "julie.martin@example.com",
    telephone: "0471/55.66.77",
    adresse: "12 avenue des Lilas, 5000 Namur",
    societeId: 1
  },
  {
    id: 3,
    nom: "Bernard",
    prenom: "Lucas",
    email: "lucas.bernard@example.com",
    telephone: "0472/99.00.11",
    adresse: "8 quai des Artisans, 1000 Bruxelles",
    societeId: 2
  }
];
