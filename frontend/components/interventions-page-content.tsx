import InterventionsPanel from "@/components/interventions-panel";

export function InterventionsPageContent() {
  return (
    <main className="flex min-h-screen flex-col bg-background px-4 py-10 text-foreground">
      <div className="mx-auto w-full max-w-5xl space-y-2">
        <p className="text-xs uppercase tracking-widest text-muted">
          Opérations
        </p>
        <h1 className="text-2xl font-semibold">Interventions</h1>
        <p className="text-sm text-muted">
          Planification mockée des interventions via l&apos;API `/interventions`.
        </p>
        <InterventionsPanel />
      </div>
    </main>
  );
}

export default InterventionsPageContent;
