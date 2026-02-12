"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
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
import { useAuth } from "@/lib/hooks/useAuth";
import { formatApiError } from "@/lib/ui/format-api-error";

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
  const { status, token } = useAuth();

  const requireAuth = useCallback(() => {
    if (status === "authenticated" && token) return token;
    setError("Vous devez être connecté pour accéder aux données.");
    return null;
  }, [status, token]);

  const loadData = useCallback(async () => {
    const authToken = requireAuth();
    if (!authToken) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const [interventionsData, societesData, clientsData, chantiersData] =
        await Promise.all([
          getInterventions(authToken),
          getSocietes(authToken),
          getClients(authToken),
          getChantiers(authToken),
        ]);
      setInterventions(interventionsData ?? []);
      setSocietes(societesData ?? []);
      setClients(clientsData ?? []);
      setChantiers(chantiersData ?? []);
    } catch (err) {
      setError(formatApiError(err, "Erreur inconnue"));
    } finally {
      setLoading(false);
    }
  }, [requireAuth]);

  useEffect(() => {
    if (status !== "authenticated" || !token) return;
    void loadData();
  }, [loadData, status, token]);

  useEffect(() => {
    if (status === "unauthenticated") {
      setLoading(false);
      setError("Vous devez être connecté pour accéder aux données.");
    }
  }, [status]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const authToken = requireAuth();
    if (!authToken) return;
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
        await updateIntervention(authToken, editingId, form);
      } else {
        await createIntervention(authToken, form);
      }
      setForm(emptyIntervention());
      setEditingId(null);
      await loadData();
    } catch (err) {
      setError(formatApiError(err, "Erreur inconnue"));
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
    const authToken = requireAuth();
    if (!authToken) return;
    try {
      setError(null);
      await deleteIntervention(authToken, id);
      await loadData();
    } catch (err) {
      setError(formatApiError(err, "Erreur inconnue"));
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
    <section className="mx-auto mt-8 w-full max-w-5xl rounded-2xl border border-zinc-200/70 bg-white/60 p-4 sm:p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
          className="self-start rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-foreground shadow-sm hover:-translate-y-px hover:shadow-md dark:border-zinc-700 sm:self-auto"
        >
          Rafraîchir
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
        {/* Formulaire à gauche */}
        <div className="md:col-span-1">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            {editingId ? "Modifier l'intervention" : "Nouvelle intervention"}
          </h3>
          <form onSubmit={handleSubmit} className="grid gap-3">
            <div>
              <label htmlFor="intervention-titre" className="mb-1.5 block text-xs font-semibold text-muted">
                Titre*
              </label>
              <input
                id="intervention-titre"
                type="text"
                value={form.titre}
                onChange={(e) => setForm((f) => ({ ...f, titre: e.target.value }))}
                placeholder="Ex: Installation tableau électrique"
                className="w-full rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
              />
            </div>
            <div>
              <label htmlFor="intervention-statut" className="mb-1.5 block text-xs font-semibold text-muted">
                Statut
              </label>
              <select
                id="intervention-statut"
                value={form.statut ?? "PLANIFIEE"}
                onChange={(e) => setForm((f) => ({ ...f, statut: e.target.value }))}
                className="w-full rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
              >
                <option value="PLANIFIEE">Planifiée</option>
                <option value="EN_COURS">En cours</option>
                <option value="TERMINEE">Terminée</option>
                <option value="ANNULEE">Annulée</option>
              </select>
            </div>
            <div>
              <label htmlFor="intervention-date" className="mb-1.5 block text-xs font-semibold text-muted">
                Date de l&apos;intervention
              </label>
              <input
                id="intervention-date"
                type="date"
                value={form.dateIntervention}
                onChange={(e) =>
                  setForm((f) => ({ ...f, dateIntervention: e.target.value }))
                }
                className="w-full rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
              />
            </div>
            <div>
              <label htmlFor="intervention-societe" className="mb-1.5 block text-xs font-semibold text-muted">
                Société*
              </label>
              <select
                id="intervention-societe"
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
              <label htmlFor="intervention-client" className="mb-1.5 block text-xs font-semibold text-muted">
                Client (optionnel)
              </label>
              <select
                id="intervention-client"
                value={form.clientId ?? ""}
                onChange={(e) => handleClientSelect(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
              >
                <option value="">-- Aucun client --</option>
                {filteredClients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.prenom} {client.nom}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="intervention-chantier" className="mb-1.5 block text-xs font-semibold text-muted">
                Chantier (optionnel)
              </label>
              <select
                id="intervention-chantier"
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
              <label htmlFor="intervention-description" className="mb-1.5 block text-xs font-semibold text-muted">
                Description / Notes
              </label>
              <textarea
                id="intervention-description"
                value={form.description ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Détails de l'intervention..."
                rows={3}
                className="w-full rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
              />
            </div>
            <div className="flex justify-end gap-2">
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
        </div>

        {/* Liste des interventions à droite */}
        <div className="md:col-span-1 lg:col-span-2">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Liste des interventions ({interventions.length})
          </h3>

          <div className="text-xs text-muted mb-4">
            {loading
              ? "Chargement des interventions…"
              : `${interventions.length} intervention${interventions.length > 1 ? "s" : ""} chargée${interventions.length > 1 ? "s" : ""}`}
          </div>

          <div className="divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
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
        </div>
      </div>
    </section>
  );
}

export default InterventionsPanel;
