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
      <div className="mx-auto w-full max-w-6xl px-4 py-4">
        <div className="no-scrollbar flex items-center gap-2 overflow-x-auto overflow-y-visible whitespace-nowrap pb-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-all hover:translate-y-px hover:border-primary/50 hover:shadow-sm"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
