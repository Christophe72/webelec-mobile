import ClientsPanel from "@/components/clients-panel";

export function ClientsPageContent() {
  return (
    <main className="flex min-h-screen flex-col bg-background px-4 py-10 text-foreground">
      <div className="mx-auto w-full max-w-5xl space-y-2">
        <p className="text-xs uppercase tracking-widest text-muted">CRM</p>
        <h1 className="text-2xl font-semibold">Clients</h1>
        <p className="text-sm text-muted">
          Suivi des contacts associés à vos sociétés et synchronisation avec l&apos;API `/clients`.
        </p>
        <ClientsPanel />
      </div>
    </main>
  );
}

export default ClientsPageContent;
