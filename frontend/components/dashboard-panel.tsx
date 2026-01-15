"use client";

import { useEffect, useMemo, useState } from "react";
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
import { getFactures } from "@/lib/api/facture";
import { getClients } from "@/lib/api/client";
import type { ClientDTO, FactureDTO } from "@/types";

const parseDate = (value?: string | null) => {
  if (!value) return null;
  if (/^\d{2}\/\d{2}\/\d{4}/.test(value)) {
    const [day, month, year] = value.split("/").map(Number);
    return new Date(year, month - 1, day);
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const normalizeStatus = (value?: string | null) =>
  (value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const isPaidStatus = (value?: string | null) =>
  /pay|regl/.test(normalizeStatus(value));

export default function DashboardPanel() {
  const [factures, setFactures] = useState<FactureDTO[]>([]);
  const [clients, setClients] = useState<ClientDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [facturesData, clientsData] = await Promise.all([
          getFactures(),
          getClients(),
        ]);
        if (!isActive) return;
        setFactures(facturesData ?? []);
        setClients(clientsData ?? []);
      } catch (err) {
        if (!isActive) return;
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        if (!isActive) return;
        setLoading(false);
      }
    };

    void loadData();

    return () => {
      isActive = false;
    };
  }, []);

  const currency = useMemo(
    () =>
      new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
      }),
    []
  );

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    []
  );

  const { kpiData, latePayments, nextActions } = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonthStart = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const clientById = new Map<number, ClientDTO>();
    clients.forEach((client) => {
      clientById.set(client.id, client);
    });

    const enrichedFactures = factures.map((facture) => {
      const emission = parseDate(facture.dateEmission);
      const echeance = parseDate(facture.dateEcheance);
      const paid = isPaidStatus(facture.statut);
      const amount = Number(facture.montantTTC ?? 0);
      return {
        facture,
        emission,
        echeance,
        paid,
        amount,
        isOverdue: !!echeance && echeance < today && !paid,
      };
    });

    const sumAmounts = (items: typeof enrichedFactures) =>
      items.reduce((total, item) => total + item.amount, 0);

    const caMois = sumAmounts(
      enrichedFactures.filter(
        (item) =>
          item.emission && item.emission >= monthStart && item.emission <= now
      )
    );

    const caMoisPrecedent = sumAmounts(
      enrichedFactures.filter(
        (item) =>
          item.emission &&
          item.emission >= previousMonthStart &&
          item.emission <= previousMonthEnd
      )
    );

    const caEvolution =
      caMoisPrecedent > 0
        ? ((caMois - caMoisPrecedent) / caMoisPrecedent) * 100
        : null;

    const unpaidFactures = enrichedFactures.filter((item) => !item.paid);
    const overdueFactures = enrichedFactures.filter((item) => item.isOverdue);

    const latePayments = overdueFactures
      .sort((a, b) => {
        const aDate = a.echeance?.getTime() ?? 0;
        const bDate = b.echeance?.getTime() ?? 0;
        return aDate - bDate;
      })
      .slice(0, 5)
      .map((item) => {
        const client = clientById.get(item.facture.clientId);
        const name = client
          ? `${client.prenom ?? ""} ${client.nom}`.trim()
          : `Client #${item.facture.clientId}`;
        const daysLate = item.echeance
          ? Math.max(
              0,
              Math.floor(
                (today.getTime() - item.echeance.getTime()) /
                  (1000 * 60 * 60 * 24)
              )
            )
          : 0;

        return {
          client: name || "Client",
          facture: item.facture.numero,
          montant: item.amount,
          echeance: item.echeance ? dateFormatter.format(item.echeance) : "—",
          retard: daysLate > 0 ? `${daysLate} jours` : "—",
        };
      });

    const kpiData = [
      {
        label: "Chiffre d'affaires (mois)",
        value: caMois,
        isCurrency: true,
        change:
          caEvolution === null
            ? "—"
            : `${caEvolution >= 0 ? "+" : ""}${caEvolution.toFixed(1)}%`,
        hint: "vs mois précédent",
      },
      {
        label: "Factures en attente",
        value: unpaidFactures.length,
        isCurrency: false,
        change: "—",
        hint: "factures ouvertes",
      },
      {
        label: "Encours clients",
        value: sumAmounts(unpaidFactures),
        isCurrency: true,
        change: "—",
        hint: "total non réglé",
      },
      {
        label: "Clients actifs",
        value: clients.length,
        isCurrency: false,
        change: "—",
        hint: "clients enregistrés",
      },
    ];

    const nextActions = [
      {
        title: "Relances à effectuer",
        detail:
          overdueFactures.length > 0
            ? `${overdueFactures.length} facture(s) en retard`
            : "Aucune facture en retard",
      },
      {
        title: "Factures à suivre",
        detail:
          unpaidFactures.length > 0
            ? `${unpaidFactures.length} facture(s) ouvertes`
            : "Tout est réglé",
      },
      {
        title: "Portefeuille clients",
        detail:
          clients.length > 0
            ? `${clients.length} client(s) actifs`
            : "Aucun client enregistré",
      },
    ];

    return { kpiData, latePayments, nextActions };
  }, [clients, factures, dateFormatter]);

  return (
    <section className="w-full max-w-5xl p-6 mx-auto mt-8 border shadow-sm rounded-2xl border-zinc-200/70 bg-white/60 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60 space-y-6">
      <div>
        <p className="text-xs tracking-widest uppercase text-muted">
          Vue d&rsquo;ensemble
        </p>
        <h2 className="text-xl font-semibold">Chiffres importants</h2>
        <p className="mt-1 text-xs text-muted">
          Exemple d&rsquo;indicateurs (à brancher sur vos APIs métiers).
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-border/60 bg-muted/30 px-4 py-8 text-sm text-muted">
          Chargement des indicateurs…
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {kpiData.map((kpi) => (
            <Card key={kpi.label} className="border-border/60">
              <CardHeader className="space-y-1">
                <CardDescription className="text-xs uppercase tracking-wide">
                  {kpi.label}
                </CardDescription>
                <CardTitle className="text-2xl">
                  {typeof kpi.value === "number"
                    ? kpi.isCurrency
                      ? currency.format(kpi.value)
                      : kpi.value
                    : kpi.value}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted">
                <span className="font-semibold text-foreground">
                  {kpi.change}
                </span>{" "}
                {kpi.hint}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

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

      {!loading && (
        <div className="grid gap-4 md:grid-cols-3">
          {nextActions.map((action) => (
            <Card key={action.title} className="border-border/60">
              <CardHeader>
                <CardTitle className="text-base">{action.title}</CardTitle>
                <CardDescription>{action.detail}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
