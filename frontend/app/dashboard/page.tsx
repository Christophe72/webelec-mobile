"use client";

import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { PrioritiesToday } from "@/components/dashboard/PrioritiesToday";
import { useState, useEffect } from "react";
import type { AcknowledgedPriority, DashboardEvent } from "@/types/dashboard";

export default function DashboardPage() {
  const [events, setEvents] = useState<DashboardEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [acknowledgedPriorities, setAcknowledgedPriorities] = useState<AcknowledgedPriority[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);

      try {
        const token = localStorage.getItem("accessToken");
        console.log("🔑 Token:", token === null ? "NULL" : "présent");

        const response = await fetch("http://localhost:8080/api/user/context", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Erreur API: ${response.status}`);
        }

        const data = await response.json();
        setEvents(Array.isArray(data?.events) ? data.events : []);
        setAcknowledgedPriorities(Array.isArray(data?.acknowledgedPriorities) ? data.acknowledgedPriorities : []);
      } catch (error) {
        console.error("Erreur lors du chargement des événements:", error);
        setEvents([]);
        setAcknowledgedPriorities([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleAcknowledge = async (priorityId: string) => {
    const acknowledgedAt = new Date().toISOString();
    setAcknowledgedPriorities(prev => [...prev, { priorityId, acknowledgedAt }]);

    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(`http://localhost:8080/api/priorities/${encodeURIComponent(priorityId)}/ack`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("Erreur lors du marquage de la priorité:", response.status);
      }
    } catch (error) {
      console.error("Erreur lors du marquage de la priorité:", error);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Vue d&apos;ensemble de votre activité électrique
        </p>
      </div>

      {/* Layout du dashboard */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Priorités du jour - Colonne de gauche */}
        <div className="lg:col-span-1">
          <PrioritiesToday
            events={events}
            acknowledgedPriorities={acknowledgedPriorities}
            onAcknowledge={handleAcknowledge}
          />
        </div>

        {/* Activité récente - Colonne centrale/droite */}
        <div className="md:col-span-1 lg:col-span-2">
          <RecentActivity events={events} isLoading={isLoading} />
        </div>
      </div>

      {/* Autres widgets du dashboard peuvent aller ici */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Exemple : KPIs, graphiques, etc. */}
      </div>
    </div>
  );
}
