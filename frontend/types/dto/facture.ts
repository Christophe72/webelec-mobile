export interface FactureLigneDTO {
  description: string;
  quantite: number;
  prixUnitaire: number;
  total: number;
}

export interface FactureDTO {
  id: number;
  numero: string;
  dateEmission: string;
  dateEcheance: string;
  montantHT: number;
  montantTVA: number;
  montantTTC: number;
  statut: string;
  societeId: number;
  clientId: number;
  devisId?: number;
  lignes?: FactureLigneDTO[];
}

export type FactureCreateDTO = Omit<FactureDTO, "id">;

export type FactureUpdateDTO = Partial<FactureCreateDTO>;

export interface PaiementDTO {
  montant: number;
  date?: string;
  mode?: string;
  reference?: string;
}
