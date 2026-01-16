import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ProduitDTO } from "@/types";

interface StockInsights {
  totalProduits: number;
  totalStock: number;
  ruptureCount: number;
}

interface DashboardStockSummaryProps {
  stockInsights: StockInsights;
}

interface DashboardStockAlertsProps {
  stockShortages: ProduitDTO[];
  topStockItems: ProduitDTO[];
}

export function DashboardStockSummary({
  stockInsights,
}: DashboardStockSummaryProps) {
  return (
    <Card className="border-border/60 lg:col-span-1">
      <CardHeader>
        <CardTitle>Stock</CardTitle>
        <CardDescription>
          Synthèse des niveaux de stock disponibles.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">
            Références
          </p>
          <p className="text-xl font-semibold text-foreground">
            {stockInsights.totalProduits}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">
            Quantité totale
          </p>
          <p className="text-xl font-semibold text-foreground">
            {stockInsights.totalStock}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">Ruptures</p>
          <p className="text-xl font-semibold text-foreground">
            {stockInsights.ruptureCount}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardStockAlerts({
  stockShortages,
  topStockItems,
}: DashboardStockAlertsProps) {
  return (
    <Card className="border-border/60 lg:col-span-2">
      <CardHeader>
        <CardTitle>Alertes &amp; niveaux élevés</CardTitle>
        <CardDescription>
          Produits en rupture et références les plus stockées.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">
            Ruptures à traiter
          </p>
          {stockShortages.length === 0 ? (
            <p className="mt-2 text-sm text-muted">Aucune rupture détectée.</p>
          ) : (
            <div className="mt-2 space-y-2">
              {stockShortages.map((produit) => (
                <div
                  key={produit.id}
                  className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {produit.nom}
                    </p>
                    <p className="text-xs text-muted">{produit.reference}</p>
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {produit.quantiteStock}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">
            Stock disponible
          </p>
          {topStockItems.length === 0 ? (
            <p className="mt-2 text-sm text-muted">Aucun produit en stock.</p>
          ) : (
            <div className="mt-2 space-y-2">
              {topStockItems.map((produit) => (
                <div
                  key={produit.id}
                  className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {produit.nom}
                    </p>
                    <p className="text-xs text-muted">{produit.reference}</p>
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {produit.quantiteStock}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
