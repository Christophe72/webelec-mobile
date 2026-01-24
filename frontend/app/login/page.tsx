"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { login } from "@/lib/api/auth";
import { setToken, clearToken, getToken } from "@/lib/api/auth-storage";

export default function LoginTestPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [hasToken, setHasToken] = useState<null | boolean>(null);

  useEffect(() => {
    // On lit le token uniquement côté client après le montage
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasToken(!!getToken());
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setMessage(null);
    try {
      const res = await login({ email, motDePasse: password });
      setToken(res.accessToken);
      setHasToken(true);
      setMessage(
        `Connexion réussie pour ${res.utilisateur.email}, token stocké.`
      );
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : "Erreur lors de la connexion."
      );
    }
  }

  function handleLogout() {
    clearToken();
    setHasToken(false);
    setMessage("Token supprimé.");
  }

  const quickLinks = [
    {
      href: "/dashboard",
      title: "Dashboard",
      description: "Vue synthétique des indicateurs clés",
    },
    {
      href: "/societes",
      title: "Sociétés",
      description: "CRUD complet via l'API backend",
    },
    {
      href: "/clients",
      title: "Clients",
      description: "Contacts liés via l'API backend",
    },
    {
      href: "/modules",
      title: "Modules",
      description: "Activer les briques fonctionnelles",
    },
    {
      href: "/chantiers",
      title: "Chantiers",
      description: "Piloter les interventions",
    },
    {
      href: "/catalogue",
      title: "Catalogue",
      description: "Tester les produits et le stock",
    },
    {
      href: "/calculateur?tab=disjoncteur",
      title: "Calculatrice disjoncteur",
      description: "Aide au choix du disjoncteur",
    },
    {
      href: "/files-demo",
      title: "Gestion fichiers",
      description: "Uploader des pièces jointes",
    },
    {
      href: "/ia",
      title: "IA",
      description: "Assistant RGIE",
    },
    {
      href: "/rgie/auditeur-pro",
      title: "Auditeur RGIE",
      description: "IA conformité via /api/query",
    },
  ];

  return (
    <div className="mx-auto mt-4 sm:mt-8 md:mt-12 max-w-md px-4 sm:px-0">
      <div className="rounded-2xl border border-border bg-card/80 p-4 sm:p-6 shadow-sm backdrop-blur">
        <h1 className="text-lg sm:text-xl font-semibold mb-4">Test login JWT</h1>

      {hasToken === null ? (
        <p>Chargement…</p>
      ) : hasToken ? (
        <div>
          <p className="mb-4">Token actif</p>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-lg border border-border px-3 py-2 sm:px-4 text-xs sm:text-sm font-medium text-foreground hover:-translate-y-px hover:shadow-sm transition-all"
          >
            Déconnexion
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
          />
          <input
            type="password"
            name="password"
            autoComplete="current-password" // ou "new-password" si c'est pour créer un compte
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
          />
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-black px-3 py-2 sm:px-4 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:-translate-y-px hover:shadow-md dark:bg-white dark:text-black"
          >
            Se connecter
          </button>
        </form>
      )}

      <div className="mt-4 text-xs text-muted-foreground">
        <p>
          Token actuel :{" "}
          {hasToken === null ? "..." : hasToken ? "présent" : "absent"}
        </p>
      </div>

      {message && (
        <div className="mt-4 rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-foreground">
          {message}
        </div>
      )}

      <div className="mt-4 sm:mt-6 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Accès rapide
        </p>
        <div className="grid grid-cols-1 gap-2">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg sm:rounded-xl border border-border px-3 py-2 sm:px-4 sm:py-3 text-sm font-medium text-foreground hover:-translate-y-px hover:shadow-sm hover:border-primary/50 transition-all"
            >
              <span className="block text-sm sm:text-base font-semibold">
                {link.title}
              </span>
              <span className="text-xs text-muted-foreground">
                {link.description}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
}
