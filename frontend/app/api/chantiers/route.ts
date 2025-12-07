import { NextRequest } from "next/server";

const BACKEND_API =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ?? "http://localhost:8080/api";

export async function GET(req: NextRequest) {
  const incoming = new URL(req.url);
  const backendUrl = new URL(`${BACKEND_API}/chantiers`);
  incoming.searchParams.forEach((value, key) => backendUrl.searchParams.set(key, value));

  try {
    const res = await fetch(backendUrl, { cache: "no-store" });
    const text = await res.text();
    return new Response(text, {
      status: res.status,
      headers: {
        "content-type": res.headers.get("content-type") ?? "application/json"
      }
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue";
    return new Response(JSON.stringify({ error: message }), {
      status: 502,
      headers: { "content-type": "application/json" }
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const bodyText = await req.text();
    const res = await fetch(`${BACKEND_API}/chantiers`, {
      method: "POST",
      body: bodyText,
      headers: {
        "content-type": req.headers.get("content-type") ?? "application/json"
      },
      cache: "no-store"
    });
    const text = await res.text();
    return new Response(text, {
      status: res.status,
      headers: {
        "content-type": res.headers.get("content-type") ?? "application/json"
      }
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue";
    return new Response(JSON.stringify({ error: message }), {
      status: 502,
      headers: { "content-type": "application/json" }
    });
  }
}
