export interface ProduitAvanceDTO {
  id: number;
  reference: string;
  nom: string;
  description?: string;
  prixAchat: number;
  prixVente: number;
  fournisseur?: string;
  societeId: number;
}

export type ProduitAvanceCreateDTO = Omit<ProduitAvanceDTO, "id">;

export type ProduitAvanceUpdateDTO = Partial<ProduitAvanceCreateDTO>;
