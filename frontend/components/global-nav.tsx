import Link from "next/link";

const navLinks = [
  { href: "/login", label: "Accueil" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/societes", label: "Sociétés" },
  { href: "/clients", label: "Clients" },
  { href: "/modules", label: "Modules" },
  { href: "/chantiers", label: "Chantiers" },
  { href: "/catalogue", label: "Catalogue" },
  { href: "/calculateur?tab=disjoncteur", label: "Calculateur" },
  { href: "/files-demo", label: "Fichiers" },
  { href: "/ia", label: "IA" },
  { href: "/rgie/auditeur-pro", label: "Auditeur RGIE" },
];

export default function GlobalNav() {
  return (
    <div className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto w-full max-w-6xl px-2 py-2 sm:px-4 sm:py-3 md:py-4">
        <div className="no-scrollbar flex items-center gap-1.5 sm:gap-2 overflow-x-auto overflow-y-visible whitespace-nowrap pb-1">
          {navLinks.map((link) => (
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
