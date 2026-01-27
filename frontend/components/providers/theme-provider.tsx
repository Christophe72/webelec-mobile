"use client";

import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  isReady: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getPreferredTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("theme") as Theme | null;
    const initial = stored ?? getPreferredTheme();
    startTransition(() => {
      setThemeState(initial);
      setIsReady(true);
    });
  }, []);

  useLayoutEffect(() => {
    if (!isReady) return;

    const root = document.documentElement;

    root.classList.remove("light", "dark");
    root.classList.add(theme);

    root.style.colorScheme = theme;

    window.localStorage.setItem("theme", theme);
  }, [theme, isReady]);

  const setTheme = (next: Theme) => setThemeState(next);
  const toggleTheme = () =>
    setThemeState((prev) => (prev === "light" ? "dark" : "light"));

  const value = useMemo(
    () => ({
      theme,
      isReady,
      toggleTheme,
      setTheme,
    }),
    [theme, isReady],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
