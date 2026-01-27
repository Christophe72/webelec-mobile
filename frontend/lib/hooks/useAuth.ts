"use client";

import { useEffect, useState } from "react";
import { getToken } from "@/lib/api/auth-storage";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export function useAuth() {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const isAuthDisabled = process.env.NEXT_PUBLIC_API_AUTH_DISABLED === "true";

    const syncAuth = () => {
      const t = getToken();
      // DEV MODE : fournir un token dummy si auth désactivée
      const effectiveToken = isAuthDisabled ? (t || "dev-mode-no-auth") : t;
      setToken(effectiveToken);
      setStatus(effectiveToken ? "authenticated" : "unauthenticated");
    };
    const scheduleSync = () => queueMicrotask(syncAuth);

    scheduleSync();

    const handleStorage = () => scheduleSync();
    window.addEventListener("storage", handleStorage);
    window.addEventListener("auth:token-change", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("auth:token-change", handleStorage);
    };
  }, []);

  return { status, token };
}
