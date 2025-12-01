"use client";

import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme, isReady } = useTheme();

  const isDark = theme === "dark";
  const label = isDark ? "Passer en mode clair" : "Passer en mode sombre";
  const icon = isDark ? "🌙" : "☀️";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-pressed={isDark}
      aria-label={label}
      disabled={!isReady}
      className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-3 py-1.5 text-xs font-medium text-zinc-800 shadow-sm backdrop-blur transition hover:-translate-y-[1px] hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500 dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-100"
    >
      <span className="text-lg leading-none">
        {icon}
      </span>
      <span className="hidden sm:inline">
        {label}
      </span>
    </button>
  );
}

export default ThemeToggle;
