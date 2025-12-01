export interface ArticleDTO {
  id: string;
  titre: string;
  contenu: string;
  references?: string[];
}

export interface ChecklistItemResult {
  question: string;
  ok: boolean;
  note?: string;
}

export interface ChecklistResultDTO {
  score: number;
  items: ChecklistItemResult[];
  recommandations?: string[];
}

export interface DiagnosticDTO {
  statut: string;
  details?: string;
  recommandations?: string[];
}
