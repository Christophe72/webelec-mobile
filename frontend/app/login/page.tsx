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
      setMessage(`Connexion réussie pour ${res.utilisateur.email}, token stocké.`);
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
    { href: "/modules", title: "Modules", description: "Activer les briques fonctionnelles" },
    { href: "/chantiers", title: "Chantiers", description: "Piloter les interventions" },
    { href: "/societes", title: "Sociétés", description: "Gérer vos clients finaux" }
  ];

  return (
    <div className="mx-auto mt-12 max-w-md rounded-2xl border border-zinc-200/70 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60">
      <h1 className="text-xl font-semibold mb-4">Test login JWT</h1>

      {hasToken === null ? (
        <p>Chargement…</p>
      ) : hasToken ? (
        <div>
          <p className="mb-4">Token actif</p>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-foreground hover:-translate-y-px hover:shadow-sm dark:border-zinc-700"
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
            className="w-full rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
          />
          <input
           type="password"
          name="password"
          autoComplete="current-password" // ou "new-password" si c’est pour créer un compte
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
          />
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-px hover:shadow-md dark:bg-white dark:text-black"
          >
            Se connecter
          </button>
        </form>
      )}

      <div className="mt-4 text-xs text-muted">
        <p>
          Token actuel :{" "}
          {hasToken === null ? "..." : hasToken ? "présent" : "absent"}
        </p>
      </div>

      {message && (
        <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-foreground dark:border-zinc-700/50 dark:bg-zinc-900/40">
          {message}
        </div>
      )}

      <div className="mt-6 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">
          Accès rapide
        </p>
        <div className="grid grid-cols-1 gap-2">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl border border-zinc-200/80 px-4 py-3 text-sm font-medium text-foreground hover:-translate-y-px hover:shadow-sm dark:border-zinc-700/70"
            >
              <span className="block text-base font-semibold">{link.title}</span>
              <span className="text-xs text-muted">{link.description}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
