export interface DevisLigneDTO {
  description: string;
  quantite: number;
  prixUnitaire: number;
  total: number;
}

export interface DevisDTO {
  id: number;
  numero: string;
  dateEmission: string;
  dateExpiration: string;
  montantHT: number;
  montantTVA: number;
  montantTTC: number;
  statut: string;
  societeId: number;
  clientId: number;
  chantierId?: number;
  lignes: DevisLigneDTO[];
}

export type DevisCreateDTO = Omit<DevisDTO, "id">;

export type DevisUpdateDTO = Partial<DevisCreateDTO>;
