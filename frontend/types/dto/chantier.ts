export interface ChantierDTO {
  id: number;
  nom: string;
  adresse?: string;
  description?: string;
  societe: {
    id: number;
    nom: string;
  } | null;
  client: {
    id: number;
    nom: string;
    prenom?: string | null;
  } | null;
}

export interface ChantierCreateDTO {
  nom: string;
  adresse?: string;
  description?: string;
  societeId: number;
  clientId: number;
}

export type ChantierUpdateDTO = Partial<ChantierCreateDTO>;
