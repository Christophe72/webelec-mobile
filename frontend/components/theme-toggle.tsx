"use client";

import { useTheme } from "./theme-provider";

const SunIcon = () => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className="h-5 w-5 fill-none stroke-[1.5]"
  >
    <circle cx="12" cy="12" r="4" className="stroke-current" />
    <path
      className="stroke-current"
      d="M12 2.5v2.5M12 19v2.5M4.5 12H2M22 12h-2.5M5.6 5.6 3.8 3.8M20.2 20.2l-1.8-1.8M18.4 5.6l1.8-1.8M3.8 20.2l1.8-1.8"
      strokeLinecap="round"
    />
  </svg>
);

const MoonIcon = () => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className="h-5 w-5 fill-none stroke-[1.5]"
  >
    <path
      className="stroke-current"
      strokeLinecap="round"
      d="M20 15.5A7.5 7.5 0 0 1 8.5 4a7.6 7.6 0 1 0 11.5 11.5Z"
    />
  </svg>
);

export function ThemeToggle() {
  const { theme, toggleTheme, isReady } = useTheme();
  const isDark = theme === "dark";
  const label = isDark ? "Passer en mode clair" : "Passer en mode sombre";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-pressed={isDark}
      aria-label={label}
      disabled={!isReady}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white/80 text-zinc-800 shadow-sm backdrop-blur transition hover:-translate-y-[1px] hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-100"
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

export default ThemeToggle;
