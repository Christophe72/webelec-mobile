/**
 * Authentification JWT côté serveur pour WebElec.
 *
 * - Vérifie la présence et la validité de la clé secrète (WEBELEC_JWT_SECRET).
 * - Supporte les clés en texte brut ou encodées en base64.
 * - Utilise les variables d'environnement pour l'issuer et l'audience.
 * - Fournit la fonction principale `verifyJwtServer` pour valider un JWT côté serveur.
 * - Typage strict adapté à l'ERP WebElec.
 */

// lib/auth/server.ts
import { jwtVerify, type JWTPayload, type JWTVerifyOptions } from "jose";

const envSecret = process.env.WEBELEC_JWT_SECRET;
if (!envSecret) {
  throw new Error(
    "WEBELEC_JWT_SECRET n'est pas défini. Renseigne la même clé que le backend."
  );
}

const rawSecret = envSecret.trim();
if (!rawSecret) {
  throw new Error("WEBELEC_JWT_SECRET est vide après trim.");
}

const issuer = process.env.JWT_ISSUER?.trim() || "webelec-backend";
const audience = process.env.JWT_AUDIENCE?.trim();
const textSecret = new TextEncoder().encode(rawSecret);
function decodeBase64Secret(secret: string): Uint8Array | null {
  const normalized = secret.replace(/[\r\n\s]/g, "");
  if (!normalized || normalized.length % 4 !== 0) {
    return null;
  }
  if (!/^[A-Za-z0-9+/=]+$/.test(normalized)) {
    return null;
  }

  try {
    if (typeof globalThis.atob === "function") {
      const binary = globalThis.atob(normalized);
      const bytes = new Uint8Array(binary.length);
      for (let idx = 0; idx < binary.length; idx += 1) {
        bytes[idx] = binary.charCodeAt(idx);
      }
      return bytes;
    }
    if (typeof Buffer !== "undefined") {
      return new Uint8Array(Buffer.from(normalized, "base64"));
    }
  } catch {
    return null;
  }

  return null;
}

function keysEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  for (let idx = 0; idx < a.length; idx += 1) {
    if (a[idx] !== b[idx]) return false;
  }
  return true;
}

export interface AuthUser extends JWTPayload {
  sub: string;
  email?: string;
  role?: string;
}

export async function verifyJwtServer(token: string): Promise<AuthUser> {
  const verifyOptions: JWTVerifyOptions = { issuer };
  if (audience) verifyOptions.audience = audience;

  const candidates: Uint8Array[] = [textSecret];
  const decoded = decodeBase64Secret(rawSecret);
  if (decoded && !keysEqual(decoded, textSecret)) {
    candidates.push(decoded);
  }

  let lastError: unknown;

  for (const key of candidates) {
    try {
      const { payload } = await jwtVerify(token, key, verifyOptions);
      if (!payload.sub) throw new Error("JWT sans claim sub");
      return payload as AuthUser;
    } catch (err) {
      lastError = err;
    }
  }

  if (lastError instanceof Error) throw lastError;
  throw new Error("Échec de la vérification JWT");
}
