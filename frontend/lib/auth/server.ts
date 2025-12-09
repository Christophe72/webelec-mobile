import { JWTPayload, jwtVerify } from "jose";

const ISSUER = process.env.JWT_ISSUER || "webelec-backend";
const AUDIENCE = process.env.JWT_AUDIENCE || "webelec-app";
const secret = process.env.WEBELEC_JWT_SECRET || "dev-webelec-secret-change-me-please-0123456789";

// Transforme la secret en clé utilisable par jose
const secretKey = new TextEncoder().encode(secret);

export interface AuthUser extends JWTPayload {
  sub: string;
  email?: string;
  role?: string;
}

/**
 * Vérifie un JWT côté serveur et retourne le payload (avec typage minimal).
 * Lève une erreur si invalide/expiré.
 */
export async function verifyJwtServer(token: string): Promise<AuthUser> {
  const { payload } = await jwtVerify(token, secretKey, {
    issuer: ISSUER,
    audience: AUDIENCE
  });

  // payload.sub reste obligatoire pour identifier l'utilisateur
  if (!payload.sub) {
    throw new Error("JWT sans sujet (sub)");
  }

  return payload as AuthUser;
}
