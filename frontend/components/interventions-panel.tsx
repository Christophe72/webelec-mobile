"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type {
  InterventionDTO,
  InterventionCreateDTO,
  SocieteResponse,
  ClientDTO,
  ChantierDTO,
} from "@/types";
import {
  getInterventions,
  createIntervention,
  updateIntervention,
  deleteIntervention,
} from "@/lib/api/intervention";
import { getSocietes } from "@/lib/api/societe";
import { getClients } from "@/lib/api/client";
import { getChantiers } from "@/lib/api/chantier";

const today = () => new Date().toISOString().slice(0, 10);

const emptyIntervention = (): InterventionCreateDTO => ({
  titre: "",
  description: "",
  dateIntervention: today(),
  societeId: 0,
  chantierId: undefined,
  clientId: undefined,
  statut: "PLANIFIEE",
});

export function InterventionsPanel() {
  const [interventions, setInterventions] = useState<InterventionDTO[]>([]);
  const [societes, setSocietes] = useState<SocieteResponse[]>([]);
  const [clients, setClients] = useState<ClientDTO[]>([]);
  const [chantiers, setChantiers] = useState<ChantierDTO[]>([]);
  const [form, setForm] = useState<InterventionCreateDTO>(emptyIntervention());
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [interventionsData, societesData, clientsData, chantiersData] =
        await Promise.all([
          getInterventions(),
          getSocietes(),
          getClients(),
          getChantiers(),
        ]);
      setInterventions(interventionsData ?? []);
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
    if (!form.titre.trim()) {
      setError("Le titre est requis");
      return;
    }
    if (!form.societeId) {
      setError("Sélectionnez une société");
      return;
    }
    try {
      setSaving(true);
      setError(null);
      if (editingId) {
        await updateIntervention(editingId, form);
      } else {
        await createIntervention(form);
      }
      setForm(emptyIntervention());
      setEditingId(null);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (item: InterventionDTO) => {
    setEditingId(item.id);
    setForm({
      titre: item.titre,
      description: item.description ?? "",
      dateIntervention: item.dateIntervention.slice(0, 10),
      societeId: item.societeId,
      chantierId: item.chantierId,
      clientId: item.clientId,
      statut: item.statut ?? "PLANIFIEE",
    });
  };

  const handleDelete = async (id: number) => {
    try {
      setError(null);
      await deleteIntervention(id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyIntervention());
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
    if (!value) {
      setForm((f) => ({ ...f, clientId: undefined }));
      return;
    }
    const clientId = Number(value);
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
            Opérations
          </p>
          <h2 className="text-xl font-semibold">Interventions</h2>
          <p className="mt-1 text-xs text-muted">
            Planifiez et suivez les interventions terrain.
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

      <form onSubmit={handleSubmit} className="mt-6 grid gap-3 sm:grid-cols-2">
        <input
          type="text"
          value={form.titre}
          onChange={(e) => setForm((f) => ({ ...f, titre: e.target.value }))}
          placeholder="Titre*"
          className="rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
        />
        <select
          value={form.statut ?? "PLANIFIEE"}
          onChange={(e) => setForm((f) => ({ ...f, statut: e.target.value }))}
          className="rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
        >
          <option value="PLANIFIEE">Planifiée</option>
          <option value="EN_COURS">En cours</option>
          <option value="TERMINEE">Terminée</option>
          <option value="ANNULEE">Annulée</option>
        </select>
        <input
          title="Date de l&apos;intervention"
          type="date"
          value={form.dateIntervention}
          onChange={(e) =>
            setForm((f) => ({ ...f, dateIntervention: e.target.value }))
          }
          className="rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
        />
        <select
          value={form.societeId || ""}
          onChange={(e) =>
            setForm((f) => ({ ...f, societeId: Number(e.target.value) }))
          }
          className="rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
        >
          <option value="">Société*</option>
          {societes.map((societe) => (
            <option key={societe.id} value={societe.id}>
              {societe.nom}
            </option>
          ))}
        </select>
        <select
          value={form.clientId ?? ""}
          onChange={(e) => handleClientSelect(e.target.value)}
          className="rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
        >
          <option value="">Client (optionnel)</option>
          {filteredClients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.prenom} {client.nom}
            </option>
          ))}
        </select>
        <select
          value={form.chantierId ?? ""}
          onChange={(e) => handleChantierSelect(e.target.value)}
          className="rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
        >
          <option value="">Chantier (optionnel)</option>
          {filteredChantiers.map((chantier) => (
            <option key={chantier.id} value={chantier.id}>
              {chantier.nom}
            </option>
          ))}
        </select>
        <textarea
          value={form.description ?? ""}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
          placeholder="Description / notes"
          rows={3}
          className="sm:col-span-2 rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
        />
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
        {loading
          ? "Chargement des interventions…"
          : `Interventions chargées : ${interventions.length}`}
      </div>

      <div className="mt-4 divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
        {loading && interventions.length === 0 ? (
          <p className="py-4 text-muted">Chargement…</p>
        ) : interventions.length === 0 ? (
          <p className="py-4 text-muted">Aucune intervention.</p>
        ) : (
          interventions.map((item) => {
            const societe = societes.find((s) => s.id === item.societeId);
            const client = clients.find((c) => c.id === item.clientId);
            const chantier = chantiers.find((c) => c.id === item.chantierId);
            return (
              <article
                key={item.id}
                className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">
                    {item.titre} — {item.statut ?? "PLANIFIEE"}
                  </p>
                  <p className="text-xs text-muted">
                    {new Date(item.dateIntervention).toLocaleDateString()} •{" "}
                    {societe?.nom ?? "Société ?"}
                  </p>
                  {(client || chantier) && (
                    <p className="text-xs text-muted">
                      {client
                        ? `Client : ${client.prenom} ${client.nom}`
                        : null}
                      {client && chantier ? " • " : ""}
                      {chantier ? `Chantier : ${chantier.nom}` : null}
                    </p>
                  )}
                  {item.description && (
                    <p className="text-xs text-muted">{item.description}</p>
                  )}
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

export default InterventionsPanel;
