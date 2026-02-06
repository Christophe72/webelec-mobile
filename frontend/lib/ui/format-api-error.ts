import type { ApiError } from "@/lib/api/base";

const AUTH_HINT =
  "Problème d'authentification (JWT). En dev avec Spring, c'est fréquent : vérifiez que le backend est lancé et reconnectez-vous si besoin.";

const AUTH_PATTERNS = [
  "jwt",
  "token",
  "unauthor",
  "forbidden",
  "autorise",
  "authent"
];

const extractBodyMessage = (body: ApiError["body"]): string | null => {
  if (!body) return null;
  if (typeof body === "string") return body;
  if (typeof body === "object") {
    if ("error" in body && body.error) return String(body.error);
    if ("message" in body && body.message) return String(body.message);
  }
  return null;
};

const isAuthError = (message: string | null, status?: number): boolean => {
  if (status === 401 || status === 403) return true;
  if (!message) return false;
  const normalized = message
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  return AUTH_PATTERNS.some((pattern) => normalized.includes(pattern));
};

export function formatApiError(error: unknown, fallback: string): string {
  if (!error) return fallback;

  if (typeof error === "string") {
    return isAuthError(error, undefined) ? AUTH_HINT : error;
  }

  const apiError = error as ApiError;
  const status = apiError && typeof apiError === "object" ? apiError.status : undefined;
  const bodyMessage = extractBodyMessage(apiError?.body);
  const errorMessage =
    bodyMessage ?? (error instanceof Error ? error.message : undefined) ?? fallback;

  if (isAuthError(errorMessage, status)) {
    return status ? `${AUTH_HINT} (HTTP ${status})` : AUTH_HINT;
  }

  return errorMessage;
}
