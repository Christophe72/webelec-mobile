export interface ClientDTO {
  id: number;
  nom: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  societeId: number;
}

export type ClientCreateDTO = Omit<ClientDTO, "id">;

export type ClientUpdateDTO = Partial<ClientCreateDTO>;
