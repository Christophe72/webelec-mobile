"use server";

/**
 * Utilitaires d'authentification JWT côté serveur pour l'application Webelec.
 * 
 * Ce module fournit des fonctions pour vérifier les tokens JWT émis par le backend.
 * Il utilise la bibliothèque `jose` pour la vérification JWT avec un émetteur,
 * une audience et une clé secrète configurables.
 * 
 * @module auth/server
 * 
 * Variables d'environnement :
 * - `JWT_ISSUER` : L'émetteur JWT attendu (par défaut : "webelec-backend")
 * - `JWT_AUDIENCE` : L'audience JWT attendue (par défaut : "webelec-app")
 * - `WEBELEC_JWT_SECRET` : La clé secrète utilisée pour la vérification JWT (par défaut : "dev-webelec-secret-change-me-please-0123456789")
 * 
 * @example
 * ```typescript
 * import { verifyJwtServer } from '@/lib/auth/server';
 * 
 * try {
 *   const user = await verifyJwtServer(token);
 *   console.log('ID utilisateur :', user.sub);
 *   console.log('Email :', user.email);
 *   console.log('Rôle :', user.role);
 * } catch (error) {
 *   console.error('Token invalide :', error);
 * }
 * ```
 */

/**
 * Server-side JWT authentication utilities for the Webelec application.
 * 
 * This module provides functions to verify JWT tokens issued by the backend.
 * It uses the `jose` library for JWT verification with configurable issuer,
 * audience, and secret key.
 * 
 * @module auth/server
 * 
 * Environment Variables:
 * - `JWT_ISSUER`: The expected JWT issuer (default: "webelec-backend")
 * - `JWT_AUDIENCE`: The expected JWT audience (default: "webelec-app")
 * - `WEBELEC_JWT_SECRET`: The secret key used for JWT verification (default: "dev-webelec-secret-change-me-please-0123456789")
 * 
 * @example
 * ```typescript
 * import { verifyJwtServer } from '@/lib/auth/server';
 * 
 * try {
 *   const user = await verifyJwtServer(token);
 *   console.log('User ID:', user.sub);
 *   console.log('Email:', user.email);
 *   console.log('Role:', user.role);
 * } catch (error) {
 *   console.error('Invalid token:', error);
 * }
 * ```
 */
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
