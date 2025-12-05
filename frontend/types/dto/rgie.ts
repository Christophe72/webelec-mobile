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

export interface RgieGravite {
  niveau: number;
  sur_5: string;
  impact: string[];
}

export interface RgieProbabilite {
  niveau: number;
  sur_5: string;
  causes_possibles: string[];
}

export interface RgieRegleMeta {
  livre: number;
  article: string;
  nature: string;
  seuil: string;
  verbatim: string;
}

export interface RgieActions {
  urgentes: string[];
  correctives: string[];
  prevention: string[];
}

export interface RgieRegle {
  id: string;
  symptomes: string[];
  gravite: RgieGravite;
  probabilite: RgieProbabilite;
  rgie: RgieRegleMeta;
  actions: RgieActions;
  contextes: string[];
  tags: string[];
  /**
   * Texte déjà optimisé pour la génération d'embedddings ou la recherche plein texte.
   */
  embedding_ready: string;
  incertitude: string;
  maj: string;
}

export interface RgieValidationReportItem {
  file: string;
  status: string;
  items: number;
}
