"use client";

import React from "react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import type {
  DevisDTO,
  DevisCreateDTO,
  DevisUpdateDTO,
  SocieteResponse,
  ClientDTO,
  ChantierDTO,
} from "@/types";
import {
  getDevis,
  createDevis,
  updateDevis,
  deleteDevis,
} from "@/lib/api/devis";
import { getSocietes } from "@/lib/api/societe";
import { getClients } from "@/lib/api/client";
import { getChantiers } from "@/lib/api/chantier";
import { NumberInput } from "@/components/ui/number-input";

const today = () => new Date().toISOString().slice(0, 10);

const addDays = (date: Date, days: number): string => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result.toISOString().slice(0, 10);
};

const generateNumeroDevis = (existingDevis: DevisDTO[]): string => {
  const year = new Date().getFullYear();
  const prefix = `DEV-${year}-`;

  // Find the highest number for this year
  const thisYearDevis = existingDevis
    .filter((d) => d.numero.startsWith(prefix))
    .map((d) => {
      const match = d.numero.match(/DEV-\d{4}-(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    });

  const maxNumber = thisYearDevis.length > 0 ? Math.max(...thisYearDevis) : 0;
  const nextNumber = (maxNumber + 1).toString().padStart(4, "0");

  return `${prefix}${nextNumber}`;
};

const emptyDevis = (existingDevis: DevisDTO[] = []): DevisCreateDTO => ({
  numero: generateNumeroDevis(existingDevis),
  dateEmission: today(),
  dateExpiration: addDays(new Date(), 30), // 30 days validity
  montantHT: 1000,
  montantTVA: 200,
  montantTTC: 1200,
  statut: "BROUILLON",
  societeId: 0,
  clientId: 0,
  chantierId: undefined,
  lignes: [],
});

export function DevisPanel() {
  const [devis, setDevis] = useState<DevisDTO[]>([]);
  const [societes, setSocietes] = useState<SocieteResponse[]>([]);
  const [clients, setClients] = useState<ClientDTO[]>([]);
  const [chantiers, setChantiers] = useState<ChantierDTO[]>([]);
  const [form, setForm] = useState<DevisCreateDTO>(emptyDevis([]));
  const [lineDesc, setLineDesc] = useState("Prestation forfaitaire");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [devisData, societesData, clientsData, chantiersData] =
        await Promise.all([
          getDevis(),
          getSocietes(),
          getClients(),
          getChantiers(),
        ]);
      setDevis(devisData ?? []);
      setSocietes(societesData ?? []);
      setClients(clientsData ?? []);
      setChantiers(chantiersData ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.numero.trim()) {
      setError("Le numéro de devis est requis.");
      return;
    }
    if (!form.societeId || !form.clientId) {
      setError("Sélectionnez une société et un client.");
      return;
    }

    const lignes =
      form.lignes.length > 0
        ? form.lignes
        : [
            {
              description: lineDesc || "Ligne principale",
              quantite: 1,
              prixUnitaire: form.montantHT,
              total: form.montantHT,
            },
          ];

    const payload: DevisCreateDTO | DevisUpdateDTO = {
      ...form,
      lignes,
    };

    try {
      setSaving(true);
      setError(null);
      if (editingId) {
        await updateDevis(editingId, payload);
      } else {
        await createDevis(payload as DevisCreateDTO);
      }
      setForm(emptyDevis(devis));
      setLineDesc("Prestation forfaitaire");
      setEditingId(null);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (item: DevisDTO) => {
    setEditingId(item.id);
    setForm({
      numero: item.numero,
      dateEmission: item.dateEmission.slice(0, 10),
      dateExpiration: item.dateExpiration.slice(0, 10),
      montantHT: item.montantHT,
      montantTVA: item.montantTVA,
      montantTTC: item.montantTTC,
      statut: item.statut,
      societeId: item.societeId,
      clientId: item.clientId,
      chantierId: item.chantierId,
      lignes: item.lignes,
    });
    setLineDesc(item.lignes[0]?.description ?? "Prestation forfaitaire");
  };

  const handleDelete = async (id: number) => {
    try {
      setError(null);
      await deleteDevis(id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyDevis());
    setLineDesc("Prestation forfaitaire");
  };

  const filteredClients = useMemo(() => {
    if (!form.societeId) return clients;
    return clients.filter((client) => client.societe?.id === form.societeId);
  }, [clients, form.societeId]);

  const filteredChantiers = useMemo(() => {
    if (!form.societeId) return chantiers;
    return chantiers.filter(
      (chantier) => chantier.societe?.id === form.societeId
    );
  }, [chantiers, form.societeId]);

  const handleClientSelect = (value: string) => {
    const clientId = Number(value);
    if (!clientId) {
      setForm((f) => ({ ...f, clientId: 0 }));
      return;
    }
    const selectedClient = clients.find((client) => client.id === clientId);
    setForm((f) => ({
      ...f,
      clientId,
      societeId: selectedClient?.societe?.id ?? f.societeId,
    }));
  };

  const handleChantierSelect = (value: string) => {
    if (!value) {
      setForm((f) => ({ ...f, chantierId: undefined }));
      return;
    }
    const chantierId = Number(value);
    const selectedChantier = chantiers.find(
      (chantier) => chantier.id === chantierId
    );
    setForm((f) => ({
      ...f,
      chantierId,
      societeId: selectedChantier?.societe?.id ?? f.societeId,
    }));
  };

  return (
    <section className="mx-auto mt-8 w-full max-w-5xl rounded-2xl border border-zinc-200/70 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted">
            Finance
          </p>
          <h2 className="text-xl font-semibold">Devis</h2>
          <p className="mt-1 text-xs text-muted">
            Génération rapide et suivi des devis liés aux sociétés/clients.
          </p>
        </div>
        <button
          type="button"
          onClick={loadData}
          className="rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-foreground shadow-sm hover:-translate-y-px hover:shadow-md dark:border-zinc-700"
        >
          Rafraîchir
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted">
            Numéro de devis*
          </label>
          <input
            type="text"
            value={form.numero}
            onChange={(e) => setForm((f) => ({ ...f, numero: e.target.value }))}
            placeholder="Ex: DEV-2026-0001"
            className="w-full rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted">
            Statut
          </label>
          <select
            value={form.statut}
            onChange={(e) => setForm((f) => ({ ...f, statut: e.target.value }))}
            className="w-full rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
          >
            <option value="BROUILLON">Brouillon</option>
            <option value="ENVOYE">Envoyé</option>
            <option value="SIGNE">Signé</option>
            <option value="PERDU">Perdu</option>
          </select>
        </div>
        <div>
          <label htmlFor="dateEmission" className="mb-1.5 block text-xs font-semibold text-muted">
            Date d&apos;émission
          </label>
          <input
            id="dateEmission"
            name="dateEmission"
            type="date"
            value={form.dateEmission}
            onChange={(e) =>
              setForm((f) => ({ ...f, dateEmission: e.target.value }))
            }
            className="w-full rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
          />
        </div>
        <div>
          <label htmlFor="dateExpiration" className="mb-1.5 block text-xs font-semibold text-muted">
            Date d&apos;expiration
          </label>
          <input
            id="dateExpiration"
            name="dateExpiration"
            type="date"
            value={form.dateExpiration}
            onChange={(e) =>
              setForm((f) => ({ ...f, dateExpiration: e.target.value }))
            }
            className="w-full rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
          />
        </div>
        <div>
          <label htmlFor="societeId" className="mb-1.5 block text-xs font-semibold text-muted">
            Société*
          </label>
          <select
            id="societeId"
            value={form.societeId || ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, societeId: Number(e.target.value) }))
            }
            className="w-full rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
          >
            <option value="">-- Sélectionner une société --</option>
            {societes.map((societe) => (
              <option key={societe.id} value={societe.id}>
                {societe.nom}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="clientId" className="mb-1.5 block text-xs font-semibold text-muted">
            Client*
          </label>
          <select
            id="clientId"
            value={form.clientId || ""}
            onChange={(e) => handleClientSelect(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
          >
            <option value="">-- Sélectionner un client --</option>
            {filteredClients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.prenom} {client.nom}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="chantierId" className="mb-1.5 block text-xs font-semibold text-muted">
            Chantier (optionnel)
          </label>
          <select
            id="chantierId"
            value={form.chantierId ?? ""}
            onChange={(e) => handleChantierSelect(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
          >
            <option value="">-- Aucun chantier --</option>
            {filteredChantiers.map((chantier) => (
              <option key={chantier.id} value={chantier.id}>
                {chantier.nom}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted">
            Montant HT (€)
          </label>
          <NumberInput
            step={0.01}
            min={0}
            value={form.montantHT}
            onChange={(e) =>
              setForm((f) => ({ ...f, montantHT: Number(e.target.value) }))
            }
            placeholder="1000.00"
            className="w-full rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted">
            TVA (€)
          </label>
          <NumberInput
            step={0.01}
            min={0}
            value={form.montantTVA}
            onChange={(e) =>
              setForm((f) => ({ ...f, montantTVA: Number(e.target.value) }))
            }
            placeholder="200.00"
            className="w-full rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted">
            Montant TTC (€)
          </label>
          <NumberInput
            step={0.01}
            min={0}
            value={form.montantTTC}
            onChange={(e) =>
              setForm((f) => ({ ...f, montantTTC: Number(e.target.value) }))
            }
            placeholder="1200.00"
            className="w-full rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-semibold text-muted">
            Description de la ligne
          </label>
          <textarea
            value={lineDesc}
            onChange={(e) => setLineDesc(e.target.value)}
            placeholder="Ex: Prestation forfaitaire, installation électrique..."
            rows={2}
            className="w-full rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
          />
        </div>
        <div className="sm:col-span-2 flex justify-end gap-2">
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:-translate-y-px hover:shadow-md dark:border-zinc-700"
            >
              Annuler
            </button>
          )}
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-px hover:shadow-md dark:bg-white dark:text-black disabled:opacity-70"
          >
            {saving ? "Sauvegarde…" : editingId ? "Mettre à jour" : "Créer"}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-700/60 dark:bg-red-900/40 dark:text-red-100">
          {error}
        </div>
      )}

      <div className="mt-4 text-xs text-muted">
        {loading ? "Chargement des devis…" : `Devis chargés : ${devis.length}`}
      </div>

      <div className="mt-4 divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
        {loading && devis.length === 0 ? (
          <p className="py-4 text-muted">Chargement…</p>
        ) : devis.length === 0 ? (
          <p className="py-4 text-muted">Aucun devis enregistré.</p>
        ) : (
          devis.map((item) => {
            const societe = societes.find((s) => s.id === item.societeId);
            const client = clients.find((c) => c.id === item.clientId);
            return (
              <article
                key={item.id}
                className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">
                    #{item.numero} — {item.statut}
                  </p>
                  <p className="text-xs text-muted">
                    {societe?.nom ?? "Société inconnue"} •{" "}
                    {client ? `${client.prenom} ${client.nom}` : "Client ?"}
                  </p>
                  <p className="text-xs text-muted">
                    Emis le {new Date(item.dateEmission).toLocaleDateString()} •
                    Expire le{" "}
                    {new Date(item.dateExpiration).toLocaleDateString()}
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {item.montantTTC.toLocaleString("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(item)}
                    className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-foreground hover:-translate-y-px hover:shadow-sm dark:border-zinc-700"
                  >
                    Modifier
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:-translate-y-px hover:shadow-sm dark:border-red-700/60 dark:text-red-100"
                  >
                    Supprimer
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}

export default DevisPanel;
