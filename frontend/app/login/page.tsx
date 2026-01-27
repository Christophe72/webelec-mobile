"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { login, me, refresh } from "@/lib/api/auth";
import { useAuth } from "@/lib/auth/AuthProvider";

function decodeTokenInfo(value?: string | null): string | null {
  if (!value) return null;
  try {
    const [, payloadBase64] = value.split(".");
    const payload = JSON.parse(
      atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/")),
    ) as { sub?: string; role?: string; exp?: number };

    const exp = payload.exp
      ? new Date(payload.exp * 1000).toLocaleString()
      : "n/a";

    return `sub=${payload.sub ?? "n/a"} · role=${payload.role ?? "n/a"} · exp=${exp}`;
  } catch {
    return "JWT illisible";
  }
}

export default function LoginTestPage() {
  const { token, setToken, clear } = useAuth();

  // Form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI feedback
  const [message, setMessage] = useState<string | null>(null);
  const [meStatus, setMeStatus] = useState<string | null>(null);
  const [refreshStatus, setRefreshStatus] = useState<string | null>(null);

  // Debug / info
  const [refreshTokenValue, setRefreshTokenValue] = useState<string | null>(null);
  const [accessTokenShadow, setAccessTokenShadow] = useState<string | null>(null);

  // 🔑 DÉRIVÉS
  const accessToken = accessTokenShadow ?? token;
  const hasToken = Boolean(accessToken);
  const tokenInfo = useMemo(() => decodeTokenInfo(accessToken), [accessToken]);
  const localTime = useMemo(
    () => (accessToken ? new Date().toLocaleString() : null),
    [accessToken],
  );

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setMessage(null);
    setMeStatus(null);

    try {
      const res = await login({ email, motDePasse: password });

      // ✅ Provider = source de vérité
      setToken(res.accessToken);

      // shadow UI immédiat
      setAccessTokenShadow(res.accessToken);
      setRefreshTokenValue(res.refreshToken ?? null);

      setMessage(`Connexion réussie pour ${res.utilisateur.email}`);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Erreur lors de la connexion.");
    }
  }

  async function handleCheckMe() {
    if (!accessToken) {
      setMeStatus("Aucun token disponible");
      return;
    }
    setMeStatus("Vérification en cours...");
    try {
      const user = await me(accessToken);
      setMeStatus(`OK: ${user.email}`);
    } catch (err) {
      setMeStatus(err instanceof Error ? err.message : "Erreur /auth/me");
    }
  }

  async function handleCheckRefresh() {
    if (!refreshTokenValue) {
      setRefreshStatus("Aucun refresh token");
      return;
    }
    setRefreshStatus("Refresh en cours...");
    try {
      const res = await refresh({ refreshToken: refreshTokenValue });

      setToken(res.accessToken);
      setAccessTokenShadow(res.accessToken);

      if (res.refreshToken) {
        setRefreshTokenValue(res.refreshToken);
      }

      setRefreshStatus("OK: refresh accepté");
    } catch (err) {
      setRefreshStatus(err instanceof Error ? err.message : "Erreur /auth/refresh");
    }
  }

  function handleLogout() {
    clear();
    setMessage("Déconnecté.");
    setAccessTokenShadow(null);
    setRefreshTokenValue(null);
  }

  const quickLinks = [
    { href: "/dashboard", title: "Dashboard", description: "Vue synthétique" },
    { href: "/societes", title: "Sociétés", description: "CRUD backend" },
    { href: "/clients", title: "Clients", description: "Contacts" },
    { href: "/modules", title: "Modules", description: "Fonctionnalités" },
    { href: "/chantiers", title: "Chantiers", description: "Interventions" },
    { href: "/catalogue", title: "Catalogue", description: "Stock & produits" },
    { href: "/calculateur?tab=disjoncteur", title: "Calculateur", description: "Disjoncteurs" },
    { href: "/ia", title: "IA", description: "Assistant RGIE" },
    { href: "/rgie/auditeur-pro", title: "Auditeur RGIE", description: "Conformité" },
  ];

  return (
    <div className="mx-auto mt-10 max-w-md px-4">
      <div className="rounded-2xl border border-border bg-card/80 p-6 shadow-sm backdrop-blur">
        <h1 className="mb-4 text-xl font-semibold">Test login JWT</h1>

        {hasToken ? (
          <>
            <p className="mb-3 text-sm">Token actif</p>
            <div className="mb-4 rounded-lg border border-border/80 bg-muted/40 p-3 text-xs text-muted-foreground">
              <p>{tokenInfo ?? "JWT illisible"}</p>
              <p>Horodatage local : {localTime ?? "n/a"}</p>
            </div>

            <button onClick={handleCheckMe} className="btn mb-2 w-full" type="button">
              Tester /auth/me
            </button>
            <button onClick={handleCheckRefresh} className="btn mb-2 w-full" type="button">
              Tester /auth/refresh
            </button>
            <button onClick={handleLogout} className="btn w-full" type="button">
              Déconnexion
            </button>

            {meStatus && <p className="mt-3 text-xs text-muted-foreground">/auth/me : {meStatus}</p>}
            {refreshStatus && (
              <p className="text-xs text-muted-foreground">/auth/refresh : {refreshStatus}</p>
            )}
            {message && <p className="text-xs font-medium text-emerald-600">{message}</p>}
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
            />
            <button type="submit" className="btn w-full">
              Se connecter
            </button>
            {message && <p className="text-xs text-muted-foreground">{message}</p>}
          </form>
        )}
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card/70 p-4">
        <p className="mb-3 text-sm font-medium">Raccourcis ERP</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg border border-border/70 bg-muted/30 p-3 text-sm hover:border-primary hover:text-primary"
            >
              <div className="font-semibold">{link.title}</div>
              <div className="text-xs text-muted-foreground">{link.description}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
