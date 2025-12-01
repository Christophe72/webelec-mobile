export interface InterventionDTO {
  id: number;
  titre: string;
  description?: string;
  dateIntervention: string;
  societeId: number;
  chantierId?: number;
  clientId?: number;
  statut?: string;
}

export type InterventionCreateDTO = Omit<InterventionDTO, "id">;

export type InterventionUpdateDTO = Partial<InterventionCreateDTO>;
