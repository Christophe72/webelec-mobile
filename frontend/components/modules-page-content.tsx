import ModulesPanel from "@/components/modules-panel";

export function ModulesPageContent() {
  return (
    <main className="flex min-h-screen flex-col bg-background px-4 py-10 text-foreground">
      <div className="mx-auto w-full max-w-5xl">
        <h1 className="text-2xl font-semibold">Gestion des modules</h1>
        <p className="mt-2 text-sm text-muted">
          Activez ou désactivez les briques fonctionnelles du SaaS et créez vos propres modules.
        </p>
        <ModulesPanel />
      </div>
    </main>
  );
}

export default ModulesPageContent;
