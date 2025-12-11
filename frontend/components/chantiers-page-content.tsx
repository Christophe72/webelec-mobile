import ChantierPanel from "@/components/chantier-panel";

export function ChantiersPageContent() {
  return (
    <main className="flex min-h-screen flex-col bg-background px-4 py-10 text-foreground">
      <div className="mx-auto w-full max-w-5xl space-y-4">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-widest text-muted">API demo</p>
          <h1 className="text-2xl font-semibold">Chantiers</h1>
          <p className="text-sm text-muted">
            Gestion client-side avec filtrage, création, édition et suppression via l&apos;API chantiers.
          </p>
        </div>

        <ChantierPanel />
      </div>
    </main>
  );
}

export default ChantiersPageContent;
