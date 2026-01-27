import { api } from "./base";
import { ArticleDTO, ChecklistResultDTO, DiagnosticDTO } from "@/types";

export function getArticles(token: string): Promise<ArticleDTO[]> {
  return api(token, "/rgie/articles");
}

export function runChecklist(
  token: string,
  data: Record<string, unknown>
): Promise<ChecklistResultDTO> {
  return api(token, "/rgie/checklist", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function runDiagnostic(
  token: string,
  data: Record<string, unknown>
): Promise<DiagnosticDTO> {
  return api(token, "/rgie/diagnostic", {
    method: "POST",
    body: JSON.stringify(data)
  });
}
