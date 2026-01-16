import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface LatePaymentRow {
  client: string;
  facture: string;
  montant: number;
  echeance: string;
  retard: string;
}

interface ClientSummary {
  clientId: number;
  name: string;
  societe: string | null;
  totalFactures: number;
  unpaidMontant: number;
  overdueCount: number;
  lastFacture: Date | null;
}

interface DashboardLatePaymentsProps {
  latePayments: LatePaymentRow[];
  currency: Intl.NumberFormat;
}

interface DashboardClientSummaryProps {
  clientSummaries: ClientSummary[];
  currency: Intl.NumberFormat;
  dateFormatter: Intl.DateTimeFormat;
  loading: boolean;
}

export function DashboardLatePayments({
  latePayments,
  currency,
}: DashboardLatePaymentsProps) {
  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle>Retards de paiement</CardTitle>
        <CardDescription>
          Suivi des factures en retard pour prioriser les relances.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Facture</TableHead>
              <TableHead>Échéance</TableHead>
              <TableHead>Retard</TableHead>
              <TableHead className="text-right">Montant</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {latePayments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted">
                  Aucun retard de paiement détecté.
                </TableCell>
              </TableRow>
            ) : (
              latePayments.map((row) => (
                <TableRow key={row.facture}>
                  <TableCell className="font-medium text-foreground">
                    {row.client}
                  </TableCell>
                  <TableCell>{row.facture}</TableCell>
                  <TableCell>{row.echeance}</TableCell>
                  <TableCell>{row.retard}</TableCell>
                  <TableCell className="text-right">
                    {currency.format(row.montant)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export function DashboardClientSummary({
  clientSummaries,
  currency,
  dateFormatter,
  loading,
}: DashboardClientSummaryProps) {
  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle>Suivi par client</CardTitle>
        <CardDescription>
          Synthèse des encours, retards et dernières factures par client.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="rounded-lg border border-border/60 bg-muted/30 px-4 py-6 text-sm text-muted">
            Chargement des clients…
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Factures</TableHead>
                <TableHead>Encours</TableHead>
                <TableHead>Retards</TableHead>
                <TableHead>Dernière facture</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientSummaries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted">
                    Aucun client ni facture disponible.
                  </TableCell>
                </TableRow>
              ) : (
                clientSummaries.slice(0, 8).map((client) => (
                  <TableRow key={client.clientId}>
                    <TableCell className="font-medium text-foreground">
                      <div className="space-y-1">
                        <p>{client.name}</p>
                        {client.societe && (
                          <p className="text-xs text-muted">{client.societe}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{client.totalFactures}</TableCell>
                    <TableCell>
                      {client.unpaidMontant > 0
                        ? currency.format(client.unpaidMontant)
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {client.overdueCount > 0
                        ? `${client.overdueCount} en retard`
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {client.lastFacture
                        ? dateFormatter.format(client.lastFacture)
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
