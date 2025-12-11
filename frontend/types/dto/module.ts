export interface ModuleDTO {
  id: number;
  nom: string;
  description?: string;
  categorie?: string;
  version?: string;
  actif: boolean;
}

export type ModuleCreateDTO = Omit<ModuleDTO, "id">;

export type ModuleUpdateDTO = Partial<ModuleCreateDTO>;
