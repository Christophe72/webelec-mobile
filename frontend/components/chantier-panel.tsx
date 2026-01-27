"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  ChantierCreateDTO,
  ChantierDTO,
  ClientDTO,
  SocieteResponse,
} from "@/types";
import {
  createChantier,
  deleteChantier,
  getChantiers,
  updateChantier,
} from "@/lib/api/chantier";
import { getSocietes } from "@/lib/api/societe";
import { getClients } from "@/lib/api/client";
import type { ApiError } from "@/lib/api/base";
import { useAuth } from "@/lib/hooks/useAuth";

type ChantierFormState = {
  nom: string;
  adresse?: string;
  description?: string;
  societeId: string;
  clientId: string;
};

const buildEmptyForm = (societeValue: string): ChantierFormState => ({
  nom: "",
  adresse: "",
  description: "",
  societeId: societeValue === "all" ? "" : societeValue,
  clientId: "",
});

export function ChantierPanel() {
  const [chantiers, setChantiers] = useState<ChantierDTO[]>([]);
  const [societes, setSocietes] = useState<SocieteResponse[]>([]);
  const [clients, setClients] = useState<ClientDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterSociete, setFilterSociete] = useState<string>("all");
  const [form, setForm] = useState<ChantierFormState>(() =>
    buildEmptyForm("all")
  );
  const [editingId, setEditingId] = useState<number | null>(null);
  const { status, token } = useAuth();

  const handleApiError = useCallback((err: unknown, fallback: string) => {
    const status = (err as ApiError | null)?.status;
    if (status === 401) {
      setError("Vous devez être connecté pour accéder aux données.");
      return;
    }
    setError(err instanceof Error ? err.message : fallback);
  }, []);

  const requireToken = useCallback(() => {
    if (status === "authenticated" && token) return token;
    setError("Vous devez être connecté pour accéder aux données.");
    return null;
  }, [status, token]);

  const loadChantiers = useCallback(
    async (societeValue: string = filterSociete) => {
      const authToken = requireToken();
      if (!authToken) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const societeId =
          societeValue === "all" ? undefined : Number(societeValue);
        const data = await getChantiers(authToken, societeId);
        setChantiers(data ?? []);
      } catch (err) {
        handleApiError(err, "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    },
    [filterSociete, handleApiError, requireToken]
  );

  const loadSocietes = useCallback(async () => {
    const authToken = requireToken();
    if (!authToken) return;
    try {
      const data = await getSocietes(authToken);
      setSocietes(data ?? []);
    } catch (err) {
      handleApiError(err, "Impossible de charger les sociétés");
    }
  }, [handleApiError, requireToken]);

  const loadClients = useCallback(async () => {
    const authToken = requireToken();
    if (!authToken) return;
    try {
      const data = await getClients(authToken);
      setClients(data ?? []);
    } catch (err) {
      handleApiError(err, "Impossible de charger les clients");
    }
  }, [handleApiError, requireToken]);

  useEffect(() => {
    if (status !== "authenticated" || !token) return;
    void loadSocietes();
    void loadClients();
  }, [status, token, loadSocietes, loadClients]);

  useEffect(() => {
    if (status !== "authenticated" || !token) return;
    void loadChantiers(filterSociete);
  }, [status, token, filterSociete, loadChantiers]);

  useEffect(() => {
    if (status === "unauthenticated") {
      setLoading(false);
      setError("Vous devez être connecté pour accéder aux données.");
    }
  }, [status]);

  const filteredClients = useMemo(() => {
    if (!form.societeId) {
      return clients;
    }
    const selectedSocieteId = Number(form.societeId);
    return clients.filter(
      (client) => client.societe?.id === selectedSocieteId
    );
  }, [clients, form.societeId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const authToken = requireToken();
    if (!authToken) return;
    if (!form.nom.trim()) {
      setError("Le nom du chantier est requis");
      return;
    }
    if (!form.societeId) {
      setError("Sélectionnez une société avant de sauvegarder");
      return;
    }
    if (!form.clientId) {
      setError("Sélectionnez un client avant de sauvegarder");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      const payload: ChantierCreateDTO = {
        nom: form.nom,
        adresse: form.adresse,
        description: form.description,
        societeId: Number(form.societeId),
        clientId: Number(form.clientId),
      };
      if (editingId) {
        await updateChantier(authToken, editingId, payload);
      } else {
        await createChantier(authToken, payload);
      }
      setForm(buildEmptyForm(filterSociete));
      setEditingId(null);
      await loadChantiers();
    } catch (err) {
      handleApiError(err, "Erreur inconnue");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    const authToken = requireToken();
    if (!authToken) return;
    try {
      setError(null);
      await deleteChantier(authToken, id);
      await loadChantiers();
    } catch (err) {
      handleApiError(err, "Erreur inconnue");
    }
  };

  const handleEdit = (chantier: ChantierDTO) => {
    setEditingId(chantier.id);
    setForm({
      nom: chantier.nom ?? "",
      adresse: chantier.adresse ?? "",
      description: chantier.description ?? "",
      societeId: chantier.societe?.id ? String(chantier.societe.id) : "",
      clientId: chantier.client?.id ? String(chantier.client.id) : "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(buildEmptyForm(filterSociete));
  };

  const societeLabel = (id: number | undefined) =>
    id
      ? societes.find((s) => s.id === id)?.nom || `Société #${id}`
      : "Société inconnue";

  const clientLabel = (id: number | undefined) =>
    id
      ? clients.find((c) => c.id === id)?.nom || `Client #${id}`
      : "Client inconnu";

  return (
    <section className="mx-auto mt-12 w-full max-w-5xl rounded-2xl border border-zinc-200/70 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted">
            API demo
          </p>
          <h2 className="text-xl font-semibold">Chantiers</h2>
          <p className="mt-1 text-xs text-muted">
            Création, édition rapide et suppression liées à l&apos;API
            chantiers.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <select
            title="Filtrer par société"
            name="filterSociete"
            value={filterSociete}
            onChange={(e) => setFilterSociete(e.target.value)}
            className="rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
          >
            <option value="all">Toutes les sociétés</option>
            {societes.map((societe) => (
              <option key={societe.id} value={societe.id}>
                {societe.nom}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => loadChantiers()}
            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-foreground shadow-sm hover:-translate-y-px hover:shadow-md dark:border-zinc-700 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Chargement…" : "Rafraîchir"}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-3 sm:grid-cols-2">
        <input
          id="chantier-nom"
          name="nom"
          type="text"
          value={form.nom}
          onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))}
          placeholder="Nom du chantier*"
          className="rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
        />
        <select
          title="Société du chantier"
          id="chantier-societe"
          name="societeId"
          value={form.societeId}
          onChange={(e) => {
            const newSocieteId = e.target.value;
            setForm((f) => {
              if (
                f.clientId &&
                clients.some(
                  (client) =>
                    String(client.id) === f.clientId &&
                    String(client.societe?.id ?? "") === newSocieteId
                )
              ) {
                return { ...f, societeId: newSocieteId };
              }
              return {
                ...f,
                societeId: newSocieteId,
                clientId: "",
              };
            });
          }}
          className="rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
        >
          <option value="">Société liée*</option>
          {societes.map((societe) => (
            <option key={societe.id} value={societe.id}>
              {societe.nom}
            </option>
          ))}
        </select>
        <select
          title="Client du chantier"
          id="chantier-client"
          name="clientId"
          value={form.clientId}
          onChange={(e) => {
            const newClientId = e.target.value;
            setForm((f) => {
              const client = clients.find(
                (c) => String(c.id) === newClientId
              );
              return {
                ...f,
                clientId: newClientId,
                societeId: client
                  ? String(client.societe?.id ?? "")
                  : f.societeId,
              };
            });
          }}
          className="rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
        >
          <option value="">Client lié*</option>
          {filteredClients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.nom} {client.prenom ? `(${client.prenom})` : ""}
            </option>
          ))}
        </select>
        <input
          id="chantier-adresse"
          name="adresse"
          type="text"
          value={form.adresse || ""}
          onChange={(e) => setForm((f) => ({ ...f, adresse: e.target.value }))}
          placeholder="Adresse"
          className="rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60 sm:col-span-2"
        />
        <textarea
          id="chantier-description"
          name="description"
          value={form.description || ""}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
          placeholder="Notes / description"
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
            className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-px hover:shadow-md dark:bg-white dark:text-black disabled:opacity-70"
            disabled={saving}
          >
            {saving ? "Sauvegarde…" : editingId ? "Mettre à jour" : "Créer"}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-700/50 dark:bg-red-900/40 dark:text-red-100">
          {error}
        </div>
      )}

      <div className="mt-6 text-xs text-muted">
        {loading
          ? "Chargement des chantiers…"
          : `Chantiers chargés : ${chantiers.length}`}
      </div>

      <div className="mt-4 divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
        {loading && chantiers.length === 0 ? (
          <p className="py-4 text-muted">Chargement…</p>
        ) : chantiers.length === 0 ? (
          <p className="py-4 text-muted">Aucun chantier pour le moment.</p>
        ) : (
          chantiers.map((chantier) => (
            <article
              key={chantier.id}
              className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-foreground">{chantier.nom}</p>
                  <span className="rounded-full bg-(--badge-bg) px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-(--badge-text)">
                    {societeLabel(chantier.societe?.id)}
                  </span>
                  <span className="rounded-full border border-zinc-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted dark:border-zinc-700">
                    {clientLabel(chantier.client?.id)}
                  </span>
                </div>
                <p className="text-muted">
                  {chantier.adresse || "Adresse non renseignée"}
                </p>
                {chantier.description && (
                  <p className="text-muted line-clamp-2">
                    {chantier.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(chantier)}
                  className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-foreground hover:-translate-y-px hover:shadow-sm dark:border-zinc-700"
                >
                  Modifier
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(chantier.id)}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:-translate-y-px hover:shadow-sm dark:border-red-700/60 dark:text-red-100 disabled:opacity-50"
                  disabled={saving}
                >
                  Supprimer
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

export default ChantierPanel;
