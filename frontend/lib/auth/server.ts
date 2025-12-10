import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.WEBELEC_JWT_SECRET || "changeme"
);

export async function verifyJwtServer(token: string) {
  const { payload } = await jwtVerify(token, secret, {
    issuer: "webelec-backend", // Vérifie l'issuer
    // audience: "webelec-frontend", // <-- Commenté ou supprimé car backend n'envoie pas "aud"
  });
  return payload;
}
