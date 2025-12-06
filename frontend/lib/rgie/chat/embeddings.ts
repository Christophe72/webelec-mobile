export async function getEmbedding(text: string): Promise<number[]> {
  const res = await fetch("/api/embedding", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    throw new Error(`Embedding error: ${await res.text()}`);
  }

  return (await res.json()) as number[];
}

