export interface InterventionDTO {
  id: string;
  chantierId: string;
  technicienId?: string;
  date: string;
  status?: string;
  notes?: string;
}

export type InterventionCreateDTO = Omit<InterventionDTO, "id">;

export type InterventionUpdateDTO = Partial<InterventionCreateDTO>;
