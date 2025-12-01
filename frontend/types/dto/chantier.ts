export interface ChantierDTO {
  id: number;
  nom: string;
  adresse?: string;
  description?: string;
  societeId: number;
}

export type ChantierCreateDTO = Omit<ChantierDTO, "id">;

export type ChantierUpdateDTO = Partial<ChantierCreateDTO>;
