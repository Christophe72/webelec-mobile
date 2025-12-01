import ThemeToggle from "../components/theme-toggle";
import SocietesPanel from "../components/societes-panel";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-[var(--background)] font-sans text-[var(--foreground)] transition-colors duration-200">
      <header className="w-full">
        <div className="mx-auto flex max-w-5xl items-center justify-end px-4 py-4">
          <ThemeToggle />
        </div>
      </header>

      <div className="flex flex-1 items-center justify-center">
        <div className="text-center space-y-4 px-4 text-[var(--foreground)]">
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--badge-bg)] px-3 py-1 text-xs font-medium text-[var(--badge-text)] shadow-sm">
            <span className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
            <span>Site en construction</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold">
            WebElec – saas en construction
          </h1>

          <p className="text-sm sm:text-base max-w-md mx-auto text-[var(--muted)]">
            Saas professionnel pour électricien en cours de réalisation.
            Revenez bientôt pour découvrir nos services et réalisations.
          </p>
        </div>
      </div>

      <SocietesPanel />

      <footer className="w-full border-t border-zinc-200/60 dark:border-zinc-800">
        <div className="mx-auto max-w-5xl px-4 py-4 text-center text-xs sm:text-sm text-zinc-500 dark:text-zinc-500">
          © {new Date().getFullYear()} WebElec
        </div>
      </footer>
    </main>
  );
}
