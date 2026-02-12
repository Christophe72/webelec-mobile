"use client";

import { useState, useEffect } from "react";
import { Chantier } from "@/types";

const STORAGE_KEY = "webelec_chantiers";

const INITIAL_CHANTIERS: Chantier[] = [
  {
    id: "1",
    title: "Ecole Sainte-Marie",
    clientId: "3",
    clientName: "Residence Les Tilleuls",
    address: "Rue des Ecoles 12",
    city: "Bruxelles",
    postalCode: "1000",
    status: "En cours",
    startDate: "2026-02-10",
    description: "Installation électrique complète",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Bureaux Delta Park",
    clientId: "2",
    clientName: "Atelier Meca Nord",
    address: "Avenue du Commerce 45",
    city: "Namur",
    postalCode: "5000",
    status: "A demarrer",
    startDate: "2026-02-15",
    description: "Rénovation tableau électrique",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Entrepot Sud",
    clientId: "1",
    clientName: "Dupont Electricite",
    address: "Zone industrielle 8",
    city: "Liege",
    postalCode: "4000",
    status: "Controle final",
    startDate: "2026-02-05",
    endDate: "2026-02-12",
    description: "Mise aux normes électriques",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function useChantiers() {
  const [chantiers, setChantiers] = useState<Chantier[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setChantiers(JSON.parse(stored));
      } catch {
        setChantiers(INITIAL_CHANTIERS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CHANTIERS));
      }
    } else {
      setChantiers(INITIAL_CHANTIERS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CHANTIERS));
    }
    setIsLoading(false);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const saveChantiers = (newChantiers: Chantier[]) => {
    setChantiers(newChantiers);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newChantiers));
  };

  const addChantier = (chantier: Omit<Chantier, "id" | "createdAt" | "updatedAt">) => {
    const newChantier: Chantier = {
      ...chantier,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveChantiers([...chantiers, newChantier]);
    return newChantier;
  };

  const updateChantier = (id: string, updates: Partial<Omit<Chantier, "id" | "createdAt">>) => {
    const newChantiers = chantiers.map((chantier) =>
      chantier.id === id
        ? { ...chantier, ...updates, updatedAt: new Date().toISOString() }
        : chantier
    );
    saveChantiers(newChantiers);
  };

  const deleteChantier = (id: string) => {
    saveChantiers(chantiers.filter((chantier) => chantier.id !== id));
  };

  const getChantierById = (id: string) => {
    return chantiers.find((chantier) => chantier.id === id);
  };

  const getChantiersByClient = (clientId: string) => {
    return chantiers.filter((chantier) => chantier.clientId === clientId);
  };

  return {
    chantiers,
    isLoading,
    addChantier,
    updateChantier,
    deleteChantier,
    getChantierById,
    getChantiersByClient,
  };
}
