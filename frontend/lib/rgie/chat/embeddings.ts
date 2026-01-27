import { bffFetch } from "@/lib/api/bffFetch";

export async function getEmbedding(token: string, text: string): Promise<number[]> {
  return bffFetch<number[]>("/api/embedding", token, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
}
