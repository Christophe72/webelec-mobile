"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardCharts } from "@/components/dashboard/dashboard-charts";
import { DashboardKpiGrid } from "@/components/dashboard/dashboard-kpi-grid";
import {
  DashboardClientInsights,
  DashboardTopUnpaidClients,
} from "@/components/dashboard/dashboard-client-cards";
import {
  DashboardStockAlerts,
  DashboardStockSummary,
} from "@/components/dashboard/dashboard-stock-cards";
import {
  DashboardClientSummary,
  DashboardLatePayments,
} from "@/components/dashboard/dashboard-tables";
import { DashboardNextActions } from "@/components/dashboard/dashboard-next-actions";
import { DashboardViewToggle } from "@/components/dashboard/dashboard-view-toggle";
import { getFactures } from "@/lib/api/facture";
import { getClients } from "@/lib/api/client";
import { getProduits } from "@/lib/api/catalogue";
import type { ClientDTO, FactureDTO, ProduitDTO } from "@/types";

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
  const [produits, setProduits] = useState<ProduitDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"tableaux" | "graphiques">(
    "tableaux"
  );

  useEffect(() => {
    let isActive = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [facturesData, clientsData, produitsData] = await Promise.all([
          getFactures(),
          getClients(),
          getProduits(),
        ]);
        if (!isActive) return;
        setFactures(facturesData ?? []);
        setClients(clientsData ?? []);
        setProduits(produitsData ?? []);
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

  const monthLabelFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("fr-FR", {
        month: "short",
        year: "2-digit",
      }),
    []
  );

  const numberFormatter = useMemo(() => new Intl.NumberFormat("fr-FR"), []);

  const {
    kpiData,
    latePayments,
    nextActions,
    clientSummaries,
    insights,
    topUnpaidClients,
    stockInsights,
    stockShortages,
    topStockItems,
    revenueSeries,
    stockSeries,
  } = useMemo(() => {
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

    const clientStats = new Map<
      number,
      {
        clientId: number;
        name: string;
        societe: string | null;
        totalFactures: number;
        totalMontant: number;
        unpaidCount: number;
        unpaidMontant: number;
        overdueCount: number;
        lastFacture: Date | null;
      }
    >();

    clients.forEach((client) => {
      const name = `${client.prenom ?? ""} ${client.nom}`.trim() || "Client";
      clientStats.set(client.id, {
        clientId: client.id,
        name,
        societe: client.societe?.nom ?? null,
        totalFactures: 0,
        totalMontant: 0,
        unpaidCount: 0,
        unpaidMontant: 0,
        overdueCount: 0,
        lastFacture: null,
      });
    });

    enrichedFactures.forEach((item) => {
      const clientId = item.facture.clientId;
      if (!clientStats.has(clientId)) {
        clientStats.set(clientId, {
          clientId,
          name: `Client #${clientId}`,
          societe: null,
          totalFactures: 0,
          totalMontant: 0,
          unpaidCount: 0,
          unpaidMontant: 0,
          overdueCount: 0,
          lastFacture: null,
        });
      }

      const current = clientStats.get(clientId)!;
      const nextLast =
        item.emission &&
        (!current.lastFacture || item.emission > current.lastFacture)
          ? item.emission
          : current.lastFacture;

      clientStats.set(clientId, {
        ...current,
        totalFactures: current.totalFactures + 1,
        totalMontant: current.totalMontant + item.amount,
        unpaidCount: current.unpaidCount + (item.paid ? 0 : 1),
        unpaidMontant: current.unpaidMontant + (item.paid ? 0 : item.amount),
        overdueCount: current.overdueCount + (item.isOverdue ? 1 : 0),
        lastFacture: nextLast ?? null,
      });
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
    const encoursClients = sumAmounts(unpaidFactures);

    const monthlyTotals = Array.from({ length: 6 }, (_, index) => {
      const monthDate = new Date(
        now.getFullYear(),
        now.getMonth() - (5 - index),
        1
      );
      const monthStartDate = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth(),
        1
      );
      const monthEndDate = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth() + 1,
        0
      );

      const total = sumAmounts(
        enrichedFactures.filter(
          (item) =>
            item.emission &&
            item.emission >= monthStartDate &&
            item.emission <= monthEndDate
        )
      );

      return {
        label: monthLabelFormatter.format(monthDate),
        total,
      };
    });

    const totalFactures = enrichedFactures.length;
    const totalMontant = sumAmounts(enrichedFactures);
    const paidCount = enrichedFactures.filter((item) => item.paid).length;
    const unpaidCount = totalFactures - paidCount;
    const overdueCount = overdueFactures.length;
    const avgInvoice = totalFactures > 0 ? totalMontant / totalFactures : null;
    const paidRate = totalFactures > 0 ? paidCount / totalFactures : null;
    const overdueRate = totalFactures > 0 ? overdueCount / totalFactures : null;

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
        value: encoursClients,
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

    const clientSummaries = Array.from(clientStats.values()).sort((a, b) => {
      if (b.unpaidMontant !== a.unpaidMontant) {
        return b.unpaidMontant - a.unpaidMontant;
      }
      return b.totalMontant - a.totalMontant;
    });

    const topUnpaidClients = clientSummaries
      .filter((client) => client.unpaidMontant > 0)
      .slice(0, 3);

    const insights = {
      totalFactures,
      unpaidCount,
      avgInvoice,
      paidRate,
      overdueRate,
    };

    const totalStock = produits.reduce(
      (sum, produit) => sum + Number(produit.quantiteStock ?? 0),
      0
    );
    const stockShortages = produits
      .filter((produit) => Number(produit.quantiteStock ?? 0) <= 0)
      .slice(0, 5);
    const topStockItems = produits
      .filter((produit) => Number(produit.quantiteStock ?? 0) > 0)
      .sort((a, b) => Number(b.quantiteStock) - Number(a.quantiteStock))
      .slice(0, 5);

    const stockInsights = {
      totalProduits: produits.length,
      totalStock,
      ruptureCount: stockShortages.length,
    };

    const revenueSeries = monthlyTotals.map((item) => ({
      month: item.label,
      ca: item.total,
    }));

    const stockSeries = topStockItems.map((item) => ({
      name: item.nom,
      stock: Number(item.quantiteStock ?? 0),
    }));

    return {
      kpiData,
      latePayments,
      nextActions,
      clientSummaries,
      insights,
      topUnpaidClients,
      stockInsights,
      stockShortages,
      topStockItems,
      revenueSeries,
      stockSeries,
    };
  }, [clients, factures, dateFormatter, produits, monthLabelFormatter]);

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

      <DashboardViewToggle value={viewMode} onChange={setViewMode} />

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
        <DashboardKpiGrid kpiData={kpiData} currency={currency} />
      )}

      {viewMode === "tableaux" && (
        <>
          {!loading && (
            <div className="grid gap-4 md:grid-cols-2">
              <DashboardClientInsights
                insights={insights}
                currency={currency}
              />
              <DashboardTopUnpaidClients
                clients={topUnpaidClients}
                currency={currency}
              />
            </div>
          )}

          {!loading && (
            <div className="grid gap-4 lg:grid-cols-3">
              <DashboardStockSummary stockInsights={stockInsights} />
              <DashboardStockAlerts
                stockShortages={stockShortages}
                topStockItems={topStockItems}
              />
            </div>
          )}

          <DashboardLatePayments
            latePayments={latePayments}
            currency={currency}
          />

          <DashboardClientSummary
            clientSummaries={clientSummaries}
            currency={currency}
            dateFormatter={dateFormatter}
            loading={loading}
          />

          {!loading && <DashboardNextActions nextActions={nextActions} />}
        </>
      )}

      {viewMode === "graphiques" && (
        <>
          {loading ? (
            <div className="rounded-xl border border-border/60 bg-muted/30 px-4 py-8 text-sm text-muted">
              Chargement des graphiques…
            </div>
          ) : (
            <DashboardCharts
              revenueSeries={revenueSeries}
              stockSeries={stockSeries}
              currency={currency}
              numberFormatter={numberFormatter}
            />
          )}
        </>
      )}
    </section>
  );
}
