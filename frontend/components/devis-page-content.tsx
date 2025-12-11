import DevisPanel from "@/components/devis-panel";

export function DevisPageContent() {
  return (
    <main className="flex min-h-screen flex-col bg-background px-4 py-10 text-foreground">
      <div className="mx-auto w-full max-w-5xl space-y-2">
        <p className="text-xs uppercase tracking-widest text-muted">Finance</p>
        <h1 className="text-2xl font-semibold">Devis</h1>
        <p className="text-sm text-muted">
          Création, édition et suivi des devis via l&apos;API `/devis`.
        </p>
        <DevisPanel />
      </div>
    </main>
  );
}

export default DevisPageContent;
