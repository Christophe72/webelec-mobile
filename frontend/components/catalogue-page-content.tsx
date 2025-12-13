/**
 * CataloguePageContent structure la page Catalogue avec son en-tête
 * et le panneau principal de gestion des produits.
 *
 * @component
 */
import CataloguePanel from "@/components/catalogue-panel";

export function CataloguePageContent() {
  return (
    <main className="flex min-h-screen flex-col bg-background px-4 py-10 text-foreground">
      <div className="mx-auto w-full max-w-5xl space-y-2">
        <p className="text-xs uppercase tracking-widest text-muted">Stock</p>
        <h1 className="text-2xl font-semibold">Catalogue</h1>
        <p className="text-sm text-muted">
          Gestion des références produits et mouvements de stock mockés.
        </p>
        <CataloguePanel />
      </div>
    </main>
  );
}

export default CataloguePageContent;
