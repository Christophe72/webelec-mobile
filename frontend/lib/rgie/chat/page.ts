import type { Dispatch, SetStateAction } from "react";
import { ExplainCauseEngine } from "@/lib/sdk/webelec-explain";
import type { RgieRegle as RgieRule } from "@/types";
import { getEmbedding } from "./embeddings";

const explainEngine = new ExplainCauseEngine();

export interface ChatMessage {
  role: "user" | "ai";
  text: string;
  rules?: RgieRule[];
  selfCheck?: boolean;
  steps?: string[];
}

export async function analyseEffet(
  token: string,
  input: string,
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>
) {
  const embedding = await getEmbedding(token, input);
  const res = await explainEngine.explain(input, embedding);

  setMessages((prev) => [
    ...prev,
    {
      role: "ai",
      text: res.explanation,
      rules: res.rules,
      steps: res.steps,
    },
  ]);
}
