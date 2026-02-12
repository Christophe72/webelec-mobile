"use client";

import { useState, useEffect } from "react";
import { Client } from "@/types";

const STORAGE_KEY = "webelec_clients";

const INITIAL_CLIENTS: Client[] = [
  {
    id: "1",
    name: "Dupont Electricite",
    contact: "Mme Dupont",
    phone: "0470123456",
    email: "dupont@example.com",
    city: "Liege",
    postalCode: "4000",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Atelier Meca Nord",
    contact: "M. Leroy",
    phone: "0471234567",
    email: "leroy@atelier-meca.be",
    city: "Namur",
    postalCode: "5000",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Residence Les Tilleuls",
    contact: "Syndic Immo",
    phone: "0472345678",
    email: "contact@tilleuls.be",
    city: "Bruxelles",
    postalCode: "1000",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setClients(JSON.parse(stored));
      } catch {
        setClients(INITIAL_CLIENTS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CLIENTS));
      }
    } else {
      setClients(INITIAL_CLIENTS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CLIENTS));
    }
    setIsLoading(false);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const saveClients = (newClients: Client[]) => {
    setClients(newClients);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newClients));
  };

  const addClient = (client: Omit<Client, "id" | "createdAt" | "updatedAt">) => {
    const newClient: Client = {
      ...client,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveClients([...clients, newClient]);
    return newClient;
  };

  const updateClient = (id: string, updates: Partial<Omit<Client, "id" | "createdAt">>) => {
    const newClients = clients.map((client) =>
      client.id === id
        ? { ...client, ...updates, updatedAt: new Date().toISOString() }
        : client
    );
    saveClients(newClients);
  };

  const deleteClient = (id: string) => {
    saveClients(clients.filter((client) => client.id !== id));
  };

  const getClientById = (id: string) => {
    return clients.find((client) => client.id === id);
  };

  return {
    clients,
    isLoading,
    addClient,
    updateClient,
    deleteClient,
    getClientById,
  };
}
