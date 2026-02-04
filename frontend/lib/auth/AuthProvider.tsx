"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

type AuthContextValue = {
    token: string | null;
    setToken: (t: string | null) => void;
    clear: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "webelec_access_token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setTokenState] = useState<string | null>(() => {
        if (typeof window !== "undefined") {
            return window.localStorage.getItem(STORAGE_KEY);
        }
        return null;
    });

    const setToken = useCallback((t: string | null) => {
        setTokenState(t);
        if (t) window.localStorage.setItem(STORAGE_KEY, t);
        else window.localStorage.removeItem(STORAGE_KEY);
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
