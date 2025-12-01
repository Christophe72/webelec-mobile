export interface ChantierDTO {
  id: string;
  nom: string;
  clientId: string;
  adresse?: string;
  status?: string;
}

export type ChantierCreateDTO = Omit<ChantierDTO, "id">;

export type ChantierUpdateDTO = Partial<ChantierCreateDTO>;
