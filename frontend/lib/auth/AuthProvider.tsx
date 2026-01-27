"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type AuthContextValue = {
    token: string | null;
    setToken: (t: string | null) => void;
    clear: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "webelec_access_token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setTokenState] = useState<string | null>(null);

    useEffect(() => {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) setTokenState(stored);
    }, []);

    const setToken = (t: string | null) => {
        setTokenState(t);
        if (t) window.localStorage.setItem(STORAGE_KEY, t);
        else window.localStorage.removeItem(STORAGE_KEY);
    };

    const clear = () => setToken(null);

    const value = useMemo(() => ({ token, setToken, clear }), [token]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth doit être utilisé dans AuthProvider");
    return ctx;
}
