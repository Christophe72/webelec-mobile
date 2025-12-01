export interface FactureDTO {
  id: string;
  clientId: string;
  devisId?: string;
  totalHT: number;
  totalTTC: number;
  statut?: string;
  dateEmise?: string;
  echeance?: string;
}

export type FactureCreateDTO = Omit<FactureDTO, "id">;

export type FactureUpdateDTO = Partial<FactureCreateDTO>;

export interface PaiementDTO {
  montant: number;
  date?: string;
  mode?: string;
  reference?: string;
}
