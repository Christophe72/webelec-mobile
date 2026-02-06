"use client";

import { useEffect, useState } from "react";
import { fetchDashboardMetrics } from "@/lib/api/dashboard";
import type { DashboardMetrics } from "@/types/dashboard";
import { useAuth } from "@/lib/hooks/useAuth";
import { formatApiError } from "@/lib/ui/format-api-error";
import { DashboardKPIs } from "@/components/dashboard/DashboardKPIs";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { PrioritiesToday } from "@/components/dashboard/PrioritiesToday";
import type { DashboardEvent } from "@/types/dashboard";

export default function DashboardPage() {
  const { status, token } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [events, setEvents] = useState<DashboardEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated" || !token) return;

    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchDashboardMetrics(token);
        if (data.status === "success") {
          if (!cancelled) {
            setMetrics(data.metrics);
            setError(null);
          }
        } else if (!cancelled) {
          setMetrics(data.metrics ?? null);
          setError(formatApiError(data.error ?? "Erreur dashboard", "Erreur dashboard"));
        }
      } catch (error) {
        if (!cancelled) {
          setError(formatApiError(error, "Erreur dashboard"));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    // Simuler le chargement des événements (à remplacer par un vrai appel API)
    const fetchEvents = async () => {
      setLoadingEvents(true);
      // TODO: Remplacer par un vrai appel API
      // const response = await fetch('/api/dashboard/events', { headers: { Authorization: `Bearer ${token}` } })
      // const data = await response.json()

      // Données mockées pour l'instant
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (!cancelled) {
        setEvents([
          {
            id: "1",
            severity: "CRITICAL",
            message: "RGIE : Non-conformité détectée sur l'installation électrique",
            entityType: "RGIE",
            entityId: "RGIE-2024-042",
            createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          },
          {
            id: "2",
            severity: "WARNING",
            message: "Stock faible : Disjoncteurs 16A (5 unités restantes)",
            entityType: "STOCK",
            entityId: "STOCK-001",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          },
          {
            id: "3",
            severity: "INFO",
            message: "Nouveau devis créé pour le chantier Avenue des Lilas",
            entityType: "DEVIS",
            entityId: "DEV-2024-001",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
          },
        ]);
        setLoadingEvents(false);
      }
    };

    fetchData();
    fetchEvents();

    return () => {
      cancelled = true;
    };
  }, [status, token]);

  if (status !== "authenticated" || !token) {
    return (
      <div className="p-6 text-gray-900 dark:text-gray-100">
        Non connecté (token absent).
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Vue d&apos;ensemble de votre activité électrique
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded">
            ❌ {error}
          </div>
        )}

        {/* KPIs Grid */}
        <section>
          <DashboardKPIs metrics={metrics} isLoading={loading} hasError={!!error} />
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            ⚡ Actions rapides
          </h2>
          <QuickActions />
        </section>

        {/* Priorities and Recent Activity */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Priorités du jour */}
          <div className="lg:col-span-1">
            <PrioritiesToday events={events} />
          </div>

          {/* Activité récente */}
          <div className="md:col-span-1 lg:col-span-2">
            <RecentActivity events={events} isLoading={loadingEvents} />
          </div>
        </div>

        {/* Statistics Section */}
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                📊 Chantiers ce mois
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {metrics?.activeSitesCount || 0}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              En cours d&apos;exécution
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                💰 Devis en attente
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">—</div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              En attente de réponse
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                📦 Articles en stock
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">—</div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Produits disponibles
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                👥 Clients actifs
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">—</div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Avec chantiers en cours
            </div>
          </div>
        </section>

        {/* Charts Section (Placeholder for future) */}
        <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            📈 Activité des 30 derniers jours
          </h2>
          <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded">
            Graphique à venir
          </div>
        </section>
      </div>
    </div>
  );
}
