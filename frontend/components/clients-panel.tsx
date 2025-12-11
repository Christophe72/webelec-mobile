"use client";

import { FormEvent, useEffect, useState } from "react";
import type {
  ClientDTO,
  ClientCreateDTO,
  ClientUpdateDTO,
  SocieteResponse,
} from "@/types";
import {
  getClients,
  createClient,
  updateClient,
  deleteClient,
} from "@/lib/api/client";
import { getSocietes } from "@/lib/api/societe";

const emptyClient: ClientCreateDTO = {
  nom: "",
  prenom: "",
  email: "",
  telephone: "",
  adresse: "",
  societeId: 0,
};

export function ClientsPanel() {
  const [clients, setClients] = useState<ClientDTO[]>([]);
  const [societes, setSocietes] = useState<SocieteResponse[]>([]);
  const [form, setForm] = useState<ClientCreateDTO>(emptyClient);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [clientsData, societesData] = await Promise.all([
        getClients(),
        getSocietes(),
      ]);
      setClients(clientsData ?? []);
      setSocietes(societesData ?? []);
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
    if (!form.nom.trim()) {
      setError("Le nom est requis");
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
        const payload: ClientUpdateDTO = { ...form };
        await updateClient(editingId, payload);
      } else {
        await createClient(form);
      }
      setForm(emptyClient);
      setEditingId(null);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (client: ClientDTO) => {
    setEditingId(client.id);
    setForm({
      nom: client.nom,
      prenom: client.prenom ?? "",
      email: client.email ?? "",
      telephone: client.telephone ?? "",
      adresse: client.adresse ?? "",
      societeId: client.societeId,
    });
  };

  const handleDelete = async (id: number) => {
    try {
      setError(null);
      await deleteClient(id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyClient);
  };

  const selectedSociete = societes.find((s) => s.id === form.societeId);

  return (
    <section className="mx-auto mt-8 w-full max-w-5xl rounded-2xl border border-zinc-200/70 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted">CRM</p>
          <h2 className="text-xl font-semibold">Clients</h2>
          <p className="mt-1 text-xs text-muted">
            Créez, modifiez ou supprimez les contacts liés à vos sociétés.
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
          value={form.nom}
          onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))}
          placeholder="Nom*"
          className="rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
        />
        <input
          type="text"
          value={form.prenom ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, prenom: e.target.value }))}
          placeholder="Prénom"
          className="rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
        />
        <input
          type="email"
          value={form.email ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          placeholder="Email"
          className="rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
        />
        <input
          type="tel"
          value={form.telephone ?? ""}
          onChange={(e) =>
            setForm((f) => ({ ...f, telephone: e.target.value }))
          }
          placeholder="Téléphone"
          className="rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
        />
        <textarea
          value={form.adresse ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, adresse: e.target.value }))}
          placeholder="Adresse"
          rows={2}
          className="sm:col-span-2 rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
        />
        <select
          name="societeId"
          value={form.societeId || ""}
          onChange={(e) =>
            setForm((f) => ({ ...f, societeId: Number(e.target.value) }))
          }
          className="rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
        >
          <option value="">Société liée*</option>
          {societes.map((societe) => (
            <option key={societe.id} value={societe.id}>
              {societe.nom}
            </option>
          ))}
        </select>
        {selectedSociete && (
          <div className="text-xs text-muted">
            Société sélectionnée : {selectedSociete.nom}
          </div>
        )}
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
          ? "Chargement des clients…"
          : `Clients chargés : ${clients.length}`}
      </div>

      <div className="mt-4 divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
        {loading && clients.length === 0 ? (
          <p className="py-4 text-muted">Chargement…</p>
        ) : clients.length === 0 ? (
          <p className="py-4 text-muted">Aucun client pour le moment.</p>
        ) : (
          clients.map((client) => {
            const societe = societes.find((s) => s.id === client.societeId);
            return (
              <article
                key={client.id}
                className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <p className="font-medium text-foreground">
                    {client.prenom} {client.nom}
                  </p>
                  {societe && (
                    <p className="text-xs uppercase tracking-wide text-muted">
                      {societe.nom}
                    </p>
                  )}
                  {(client.email || client.telephone) && (
                    <p className="text-xs text-muted">
                      {client.email ? `✉ ${client.email}` : ""}{" "}
                      {client.telephone ? `• ☎ ${client.telephone}` : ""}
                    </p>
                  )}
                  {client.adresse && (
                    <p className="text-xs text-muted">{client.adresse}</p>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(client)}
                    className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-foreground hover:-translate-y-px hover:shadow-sm dark:border-zinc-700"
                  >
                    Modifier
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(client.id)}
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

export default ClientsPanel;
