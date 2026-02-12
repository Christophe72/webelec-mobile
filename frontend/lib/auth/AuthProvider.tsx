"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  clearToken as clearStoredToken,
  getToken as getStoredToken,
  setToken as setStoredToken,
} from "@/lib/api/auth-storage";

type AuthContextValue = {
    token: string | null;
    setToken: (t: string | null) => void;
    clear: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setTokenState] = useState<string | null>(() => getStoredToken());

    useEffect(() => {
        const sync = () => setTokenState(getStoredToken());
        const scheduleSync = () => queueMicrotask(sync);

        scheduleSync();

        window.addEventListener("storage", scheduleSync);
        window.addEventListener("auth:token-change", scheduleSync);

        return () => {
            window.removeEventListener("storage", scheduleSync);
            window.removeEventListener("auth:token-change", scheduleSync);
        };
    }, []);

    const setToken = useCallback((t: string | null) => {
        setTokenState(t);
        if (t) {
            setStoredToken(t);
            return;
        }
        clearStoredToken();
    }, []);

    const clear = useCallback(() => setToken(null), [setToken]);

    const value = useMemo(() => ({ token, setToken, clear }), [token, setToken, clear]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth doit être utilisé dans AuthProvider");
    return ctx;
}
