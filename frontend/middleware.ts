import { NextRequest, NextResponse } from "next/server";
import { verifyJwtServer } from "@/lib/auth/server";
import { z } from "zod";

// Schéma simple pour décoder les claims d'intérêt (role + sub)
const ClaimsSchema = z.object({
  sub: z.string(),
  role: z.string().optional()
});

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  try {
    const payload = await verifyJwtServer(token);
    const claims = ClaimsSchema.parse(payload);

    // Exemple de garde: restreindre /api/admin aux admins
    if (req.nextUrl.pathname.startsWith("/api/admin") && claims.role !== "admin") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    // OK: on continue
    return NextResponse.next();
  } catch (err) {
    console.error("JWT verification failed", err);
    return NextResponse.json({ error: "Token invalide" }, { status: 401 });
  }
}

// Adapte la liste des routes à protéger selon ton besoin
export const config = {
  matcher: ["/api/:path*"]
};
