export interface ProduitDTO {
  id: string;
  nom: string;
  prixHT: number;
  stock?: number;
  description?: string;
}

export type ProduitCreateDTO = Omit<ProduitDTO, "id">;

export interface StockMouvementDTO {
  produitId: string;
  quantite: number;
  type: "in" | "out";
  raison?: string;
}
