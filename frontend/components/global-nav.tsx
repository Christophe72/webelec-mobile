"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { bffFetch } from "@/lib/api/bffFetch";
import { useAuth } from "@/lib/hooks/useAuth";

type NavRole = "ARTISAN" | "TECH" | "AUDITEUR" | "ADMIN" | "PUBLIC";

const navLinks: Array<{
  href: string;
  label: string;
  roles: NavRole[];
}> = [
  { href: "/login", label: "Accueil", roles: ["PUBLIC", "ARTISAN", "TECH", "AUDITEUR", "ADMIN"] },
  { href: "/dashboard", label: "Dashboard", roles: ["ARTISAN", "ADMIN"] },
  { href: "/societes", label: "Sociétés", roles: ["ARTISAN", "ADMIN"] },
  { href: "/clients", label: "Clients", roles: ["ARTISAN", "ADMIN"] },
  { href: "/modules", label: "Modules", roles: ["ARTISAN", "ADMIN"] },
  { href: "/chantiers", label: "Chantiers", roles: ["ARTISAN", "TECH", "ADMIN"] },
  { href: "/catalogue", label: "Catalogue", roles: ["ARTISAN", "ADMIN"] },
  { href: "/calculateur?tab=disjoncteur", label: "Calculateur", roles: ["ARTISAN", "ADMIN"] },
  { href: "/files-demo", label: "Fichiers", roles: ["ARTISAN", "ADMIN"] },
  { href: "/ia", label: "IA", roles: ["ARTISAN", "ADMIN"] },
  { href: "/rgie/auditeur-pro", label: "Auditeur RGIE", roles: ["AUDITEUR", "ADMIN"] },
];

function normalizeRole(role?: string | null): NavRole | null {
  if (!role) return null;
  const raw = role.trim().toUpperCase();
  const value = raw.startsWith("ROLE_") ? raw.slice(5) : raw;
  if (value === "GERANT") return "ARTISAN";
  if (value === "TECHNICIEN") return "TECH";
  if (value === "ARTISAN" || value === "TECH" || value === "AUDITEUR" || value === "ADMIN") {
    return value;
  }
  return null;
}

export default function GlobalNav() {
  const { status, token } = useAuth();
  const [role, setRole] = useState<NavRole | null>(null);

  useEffect(() => {
    let active = true;
    if (status !== "authenticated" || !token) {
      return () => {
        active = false;
      };
    }

    const fetchRole = async () => {
      try {
        const data = await bffFetch<{ role?: string | null }>("/api/user/context", token);
        if (active) {
          setRole(normalizeRole(data?.role));
        }
      } catch {
        if (active) {
          setRole(null);
        }
      }
    };

    fetchRole();

    return () => {
      active = false;
    };
  }, [status, token]);

  const visibleLinks = useMemo(() => {
    const effectiveRole = status === "authenticated" && token ? role : null;
    if (effectiveRole === "ADMIN") {
      return navLinks;
    }
    return navLinks.filter((link) => {
      if (link.roles.includes("PUBLIC")) return true;
      if (!effectiveRole) return false;
      return link.roles.includes(effectiveRole);
    });
  }, [role, status, token]);

  return (
    <div className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto w-full max-w-6xl px-2 py-2 sm:px-4 sm:py-3 md:py-4">
        <div className="no-scrollbar flex items-center gap-1.5 sm:gap-2 overflow-x-auto overflow-y-visible whitespace-nowrap pb-1">
          {visibleLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl border border-border px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-foreground transition-all hover:translate-y-px hover:border-primary/50 hover:shadow-sm"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
