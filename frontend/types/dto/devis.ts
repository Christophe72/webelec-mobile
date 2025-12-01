export interface DevisLigneDTO {
  designation: string;
  quantite: number;
  prixUnitaire: number;
}

export interface DevisDTO {
  id: string;
  clientId: string;
  chantierId?: string;
  lignes: DevisLigneDTO[];
  totalHT: number;
  totalTTC?: number;
  statut?: string;
  notes?: string;
}

export type DevisCreateDTO = Omit<DevisDTO, "id">;

export type DevisUpdateDTO = Partial<DevisCreateDTO>;
