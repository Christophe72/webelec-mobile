"use client";

import { useTheme } from "@/app/providers";

export function ThemeStatus() {
  const { theme } = useTheme();

  return (
    <div className="inline-flex items-center rounded-lg px-3 py-2 text-sm bg-[var(--surface-hover)] app-hover-surface">
      Theme actif: {theme === "dark" ? "sombre" : "clair"}
    </div>
  );
}
