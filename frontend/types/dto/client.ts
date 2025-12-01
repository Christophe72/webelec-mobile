export interface ClientDTO {
  id: string;
  nom: string;
  email?: string;
  telephone?: string;
  adresse?: string;
}

export type ClientCreateDTO = Omit<ClientDTO, "id">;

export type ClientUpdateDTO = Partial<ClientCreateDTO>;
