export interface ClientDTO {
  id: number;
  nom: string;
  prenom: string;
  telephone?: string;
  adresse?: string;
  societe: {
    id: number;
    nom: string;
  } | null;
}

export interface ClientCreateDTO {
  nom: string;
  prenom: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  societeId: number;
}

export type ClientUpdateDTO = ClientCreateDTO;
