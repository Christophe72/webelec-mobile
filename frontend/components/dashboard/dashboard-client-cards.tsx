import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ClientInsights {
  totalFactures: number;
  unpaidCount: number;
  avgInvoice: number | null;
  paidRate: number | null;
  overdueRate: number | null;
}

interface TopUnpaidClient {
  clientId: number;
  name: string;
  societe: string | null;
  unpaidMontant: number;
}

interface DashboardClientInsightsProps {
  insights: ClientInsights;
  currency: Intl.NumberFormat;
}

interface DashboardTopUnpaidClientsProps {
  clients: TopUnpaidClient[];
  currency: Intl.NumberFormat;
}

export function DashboardClientInsights({
  insights,
  currency,
}: DashboardClientInsightsProps) {
  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle>Indicateurs clients</CardTitle>
        <CardDescription>
          Qualité d&rsquo;encaissement et volumes de facturation.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">
            Taux de règlement
          </p>
          <p className="text-xl font-semibold text-foreground">
            {insights.paidRate === null
              ? "—"
              : `${Math.round(insights.paidRate * 100)}%`}
          </p>
          <p className="text-xs text-muted">Factures payées</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">
            Montant moyen
          </p>
          <p className="text-xl font-semibold text-foreground">
            {insights.avgInvoice === null
              ? "—"
              : currency.format(insights.avgInvoice)}
          </p>
          <p className="text-xs text-muted">Par facture</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">
            Factures totales
          </p>
          <p className="text-xl font-semibold text-foreground">
            {insights.totalFactures}
          </p>
          <p className="text-xs text-muted">{insights.unpaidCount} ouvertes</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">
            Taux de retard
          </p>
          <p className="text-xl font-semibold text-foreground">
            {insights.overdueRate === null
              ? "—"
              : `${Math.round(insights.overdueRate * 100)}%`}
          </p>
          <p className="text-xs text-muted">Factures en retard</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardTopUnpaidClients({
  clients,
  currency,
}: DashboardTopUnpaidClientsProps) {
  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle>Priorités de relance</CardTitle>
        <CardDescription>
          Clients avec le plus gros encours non réglé.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {clients.length === 0 ? (
          <p className="text-sm text-muted">Aucun encours à relancer.</p>
        ) : (
          <div className="space-y-3">
            {clients.map((client) => (
              <div
                key={client.clientId}
                className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {client.name}
                  </p>
                  {client.societe && (
                    <p className="text-xs text-muted">{client.societe}</p>
                  )}
                </div>
                <div className="text-sm font-semibold text-foreground">
                  {currency.format(client.unpaidMontant)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
