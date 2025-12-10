// lib/auth/server.ts
import { jwtVerify, type JWTPayload, type JWTVerifyOptions } from "jose";

const secretValue = process.env.WEBELEC_JWT_SECRET?.trim();
if (!secretValue) {
  throw new Error(
    "WEBELEC_JWT_SECRET n'est pas défini. Renseigne la même clé que le backend."
  );
}

const secret = new TextEncoder().encode(secretValue);
const issuer = process.env.JWT_ISSUER?.trim() || "webelec-backend";
const audience = process.env.JWT_AUDIENCE?.trim();

export interface AuthUser extends JWTPayload {
  sub: string;
  email?: string;
  role?: string;
}

export async function verifyJwtServer(token: string): Promise<AuthUser> {
  const verifyOptions: JWTVerifyOptions = { issuer };
  if (audience) {
    verifyOptions.audience = audience;
  }

  const { payload } = await jwtVerify(token, secret, verifyOptions);
  if (!payload.sub) {
    throw new Error("JWT sans claim sub");
  }

  return payload as AuthUser;
}
