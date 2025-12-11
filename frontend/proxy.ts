import { NextRequest, NextResponse } from "next/server";
import { verifyJwtServer } from "@/lib/auth/server";
import { z } from "zod";

const ClaimsSchema = z.object({
  sub: z.string(),
  role: z.string().optional()
});

const AUTH_DISABLED = process.env.NODE_ENV !== "production";

export async function proxy(req: NextRequest) {
  if (AUTH_DISABLED) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  try {
    const payload = await verifyJwtServer(token);
    const claims = ClaimsSchema.parse(payload);

    // Garde simple: restriction des routes admin.
    if (req.nextUrl.pathname.startsWith("/api/admin") && claims.role !== "admin") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    return NextResponse.next();
  } catch (err) {
    console.error("JWT verification failed", err);
    return NextResponse.json({ error: "Token invalide" }, { status: 401 });
  }
}

export const config = {
  matcher: ["/api/:path*"]
};
