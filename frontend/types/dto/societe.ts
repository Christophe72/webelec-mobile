export interface SocieteResponse {
  id: number;
  nom: string;
  tva: string;
  email?: string;
  telephone?: string;
  adresse?: string;
}

export type SocieteRequest = Omit<SocieteResponse, "id">;
