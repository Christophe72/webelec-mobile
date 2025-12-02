import { SocieteRequest, SocieteResponse } from "@/types";
import { mockSocietes } from "./mockSocietes";

const API_BASE = process.env.API_BASE_URL ?? "http://localhost:8080/api";

async function parseJsonIfAny<T>(res: Response): Promise<T | undefined> {
  if (res.status === 204) {
    return undefined;
  }

  const contentLength = res.headers.get("content-length");
  if (!contentLength || contentLength === "0") {
    return undefined;
  }

  return (await res.json()) as T;
}

export async function getSocietes(): Promise<SocieteResponse[]> {
  try {
    const res = await fetch(`${API_BASE}/societes`, {
      cache: "no-store"
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      const message =
        text || `Impossible de charger les sociétés (HTTP ${res.status})`;
      console.error("[getSocietes] Erreur HTTP", res.status, message);
      throw new Error(message);
    }

    const data = await parseJsonIfAny<SocieteResponse[]>(res);
    return data ?? [];
  } catch (err) {
    console.error(
      "[getSocietes] Erreur réseau, utilisation du fallback mockSocietes",
      err
    );
    return mockSocietes;
  }
}

export async function getSociete(
  id: number | string
): Promise<SocieteResponse> {
  try {
    const res = await fetch(`${API_BASE}/societes/${id}`, {
      cache: "no-store"
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      const message =
        text ||
        `Impossible de charger la société ${id} (HTTP ${res.status})`;
      console.error("[getSociete] Erreur HTTP", res.status, message);
      throw new Error(message);
    }

    const data = await parseJsonIfAny<SocieteResponse>(res);
    if (!data) {
      throw new Error("Réponse vide du serveur pour la société demandée");
    }
    return data;
  } catch (err) {
    console.error(
      "[getSociete] Erreur réseau, tentative avec le fallback mockSocietes",
      err
    );
    const numericId = Number(id);
    const fallback = mockSocietes.find((s) => s.id === numericId);
    if (fallback) {
      return fallback;
    }
    throw err;
  }
}

export async function createSociete(
  data: SocieteRequest
): Promise<SocieteResponse> {
  try {
    const res = await fetch(`${API_BASE}/societes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data),
      cache: "no-store"
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      const message =
        text || `Impossible de créer la société (HTTP ${res.status})`;
      console.error("[createSociete] Erreur HTTP", res.status, message);
      throw new Error(message);
    }

    const created = await parseJsonIfAny<SocieteResponse>(res);
    if (!created) {
      throw new Error("Réponse vide du serveur après création de la société");
    }
    return created;
  } catch (err) {
    console.error("[createSociete] Erreur réseau", err);
    throw err;
  }
}

export async function deleteSocieteById(id: string): Promise<void> {
  try {
    const res = await fetch(`${API_BASE}/societes/${id}`, {
      method: "DELETE",
      cache: "no-store"
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      const message =
        text ||
        `Impossible de supprimer la société ${id} (HTTP ${res.status})`;
      console.error("[deleteSocieteById] Erreur HTTP", res.status, message);
      throw new Error(message);
    }

    // On ne tente pas de parser le body : on s'attend à un 204 No Content.
    await parseJsonIfAny<unknown>(res);
  } catch (err) {
    console.error("[deleteSocieteById] Erreur réseau", err);
    throw err;
  }
}
