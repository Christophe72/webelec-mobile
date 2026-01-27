"use client";

import { useEffect, useState } from "react";
import { fetchDashboardMetrics } from "@/lib/api/dashboard";
import type { DashboardMetrics } from "@/types/dashboard";
import { useAuth } from "@/lib/hooks/useAuth";

export default function DashboardPage() {
  const { status, token } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();
  console.log("AUTH DASHBOARD =", auth);

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
          setError(data.error ?? "Erreur dashboard");
        }
      } catch (error) {
        if (!cancelled) {
          setError(error instanceof Error ? error.message : "Erreur dashboard");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [status, token]);

  if (status !== "authenticated" || !token) {
    return <div className="p-6">Non connecté (token absent).</div>;
  }

  if (loading) {
    return <div className="p-6">Chargement…</div>;
  }

  if (error) {
    return <div className="p-6">Erreur: {error}</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Dashboard</h1>

      {!metrics ? (
        <div>Aucune donnée.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border p-4">
            <div className="text-sm text-muted-foreground">Chantiers actifs</div>
            <div className="text-2xl font-bold">{metrics.activeSitesCount}</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-sm text-muted-foreground">Alertes stock</div>
            <div className="text-2xl font-bold">{metrics.stockAlertsCount}</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-sm text-muted-foreground">Alertes RGIE</div>
            <div className="text-2xl font-bold">{metrics.rgieAlertsCount}</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-sm text-muted-foreground">Notifications critiques</div>
            <div className="text-2xl font-bold">{metrics.criticalNotificationsCount}</div>
          </div>
        </div>
      )}
    </div>
  );
}
