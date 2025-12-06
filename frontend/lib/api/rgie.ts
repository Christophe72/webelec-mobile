import { api } from "./base";
import { ArticleDTO, ChecklistResultDTO, DiagnosticDTO } from "@/types";

export function getArticles(): Promise<ArticleDTO[]> {
  return api("/rgie/articles");
}

export function runChecklist(data: Record<string, unknown>): Promise<ChecklistResultDTO> {
  return api("/rgie/checklist", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function runDiagnostic(data: Record<string, unknown>): Promise<DiagnosticDTO> {
  return api("/rgie/diagnostic", {
    method: "POST",
    body: JSON.stringify(data)
  });
}
