import DashboardPanel from "./dashboard-panel";

export function DashboardPageContent() {
  return (
    <main className="flex min-h-screen flex-col bg-background px-4 py-10 text-foreground">
      <div className="mx-auto w-full max-w-5xl space-y-2">
        <p className="text-xs uppercase tracking-widest text-muted">Pilotage</p>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted">
          Exemple de vue synthétique pour suivre les indicateurs clés et les
          paiements en retard.
        </p>
        <DashboardPanel />
      </div>
    </main>
  );
}

export default DashboardPageContent;
