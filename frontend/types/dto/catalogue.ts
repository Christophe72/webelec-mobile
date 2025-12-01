export interface ProduitDTO {
  id: number;
  reference: string;
  nom: string;
  description?: string;
  quantiteStock: number;
  prixUnitaire: number;
  societeId: number;
}

export type ProduitCreateDTO = Omit<ProduitDTO, "id">;

export interface StockMouvementDTO {
  produitId: number;
  quantite: number;
  type: "in" | "out";
  raison?: string;
}
