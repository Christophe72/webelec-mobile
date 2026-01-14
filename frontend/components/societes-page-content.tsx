import SocietesPanel from "@/components/societes-panel";

export function SocietesPageContent() {
  return (
    <main className="flex min-h-screen flex-col bg-background px-4 py-10 text-foreground">
      <div className="mx-auto w-full max-w-5xl">
        <h1 className="text-2xl font-semibold">Test API Sociétés</h1>
        <p className="mt-2 text-sm text-muted">
          Formulaire de création + liste avec suppression. Utilise l&apos;API
          backend.
        </p>

        <SocietesPanel />
      </div>
    </main>
  );
}

export default SocietesPageContent;
