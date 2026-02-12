"use client";

import Link from "next/link";
import { useTheme } from "@/app/providers";

export default function BottomNav() {
  const { theme, toggleTheme } = useTheme();
  const navItemClass = "app-hover-surface px-3 py-2 rounded";

  return (
    <nav className="fixed top-0 w-full bg-[var(--surface)] border-b border-[var(--surface-border)] flex justify-around items-center py-3 text-sm z-50 transition-colors">
      <Link href="/dashboard" className={navItemClass}>
        Dashboard
      </Link>
      <Link href="/clients" className={navItemClass}>
        Clients
      </Link>
      <Link href="/chantiers" className={navItemClass}>
        Chantiers
      </Link>
      <Link href="/settings" className={navItemClass}>
        Réglages
      </Link>
      <button
        onClick={toggleTheme}
        className={`${navItemClass} text-lg`}
        aria-label="Basculer le mode nuit/jour"
      >
        {theme === "dark" ? "☀️" : "🌙"}
      </button>
    </nav>
  );
}
