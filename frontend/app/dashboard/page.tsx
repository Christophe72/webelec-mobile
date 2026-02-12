"use client";

import { useEffect, useState, useMemo } from "react";
import { fetchDashboardEvents, fetchDashboardMetrics } from "@/lib/api/dashboard";
import type { DashboardMetrics } from "@/types/dashboard";
import { useAuth } from "@/lib/hooks/useAuth";
import { formatApiError } from "@/lib/ui/format-api-error";
import { DashboardKPIs } from "@/components/dashboard/DashboardKPIs";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { PrioritiesToday } from "@/components/dashboard/PrioritiesToday";
import type { DashboardEvent } from "@/types/dashboard";
import { Line, LineChart, CartesianGrid, XAxis, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export default function DashboardPage() {
  const { status, token } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [events, setEvents] = useState<DashboardEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Données aléatoires pour le graphique d'activité (30 derniers jours)
  const activityData = useMemo(() => {
    const data = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayLabel = date.getDate().toString();
      // Données aléatoires mais réalistes (0-15 activités par jour, plus actif en semaine)
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const baseActivity = isWeekend ? 2 : 8;
      const variance = Math.floor(Math.random() * 6);
      data.push({
        day: dayLabel,
        activites: baseActivity + variance,
      });
    }
    return data;
  }, []);

  useEffect(() => {
    if (status !== "authenticated" || !token) return;

    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [metricsData, eventsData] = await Promise.all([
          fetchDashboardMetrics(token),
          fetchDashboardEvents(token),
        ]);

        if (metricsData.status === "success") {
          if (!cancelled) {
            setMetrics(metricsData.metrics);
          }
        }

        if (!cancelled) {
          if (eventsData.status === "success") {
            setEvents(eventsData.events);
          } else {
            setEvents([]);
          }

          const errors: string[] = [];
          if (metricsData.status === "error") {
            errors.push(formatApiError(metricsData.error ?? "Erreur dashboard", "Erreur dashboard"));
            setMetrics(metricsData.metrics ?? null);
          }
          if (eventsData.status === "error") {
            errors.push(
              formatApiError(eventsData.error ?? "Erreur événements", "Erreur événements dashboard")
            );
          }
          setError(errors.length > 0 ? errors.join(" · ") : null);
        }
      } catch (error) {
        if (!cancelled) {
          setEvents([]);
          setError(formatApiError(error, "Erreur dashboard"));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          setLoadingEvents(false);
        }
      }
    };

    setLoadingEvents(true);
    fetchData();

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

        {/* Charts Section - Activité sur 30 jours */}
        <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            📈 Activité des 30 derniers jours
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Nombre d&apos;interventions, factures et devis créés chaque jour
          </p>
          <ChartContainer className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityData} margin={{ left: 12, right: 12 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => `${value}`}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => `Jour ${value}`}
                      formatter={(value) => [`${value} activités`, "Total"]}
                    />
                  }
                />
                <Line
                  dataKey="activites"
                  type="monotone"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </section>
      </div>
    </div>
  );
}
