"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
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
import { useAuth } from "@/lib/hooks/useAuth";
import { formatApiError } from "@/lib/ui/format-api-error";

const emptyClient: ClientCreateDTO = {
  nom: "",
  prenom: "",
  telephone: "",
  adresse: "",
  societeId: 0,
};

const phoneRegex = /^[+]?[\d\s().-]{6,}$/;
const normalizePhone = (value: string) => value.replace(/[^+\d]/g, "");

export const buildClientPayload = (form: ClientCreateDTO): ClientCreateDTO => ({
  ...form,
  nom: form.nom.trim(),
  prenom: form.prenom.trim(),
  telephone: (form.telephone ?? "").trim() || undefined,
  adresse: (form.adresse ?? "").trim() || undefined,
});

export const validateClientForm = (
  form: ClientCreateDTO,
  clients: ClientDTO[],
  editingId: number | null
) => {
  const payload = buildClientPayload(form);
  const issues: string[] = [];

  if (!payload.nom) {
    issues.push("Le nom est requis.");
  }
  if (!payload.prenom) {
    issues.push("Le prénom est requis.");
  }
  if (!payload.societeId) {
    issues.push("Sélectionnez une société.");
  }
  if (payload.telephone && !phoneRegex.test(payload.telephone)) {
    issues.push("Format de téléphone invalide.");
  }
  if (payload.telephone) {
    const normalizedTelephone = normalizePhone(payload.telephone);
    const duplicateTelephone = clients.some(
      (client) =>
        client.id !== editingId &&
        client.telephone &&
        normalizePhone(client.telephone) === normalizedTelephone
    );
    if (duplicateTelephone) {
      issues.push("Ce téléphone est déjà utilisé par un autre client.");
    }
  }

  return { payload, issues };
};

export function ClientsPanel() {
  const [clients, setClients] = useState<ClientDTO[]>([]);
  const [societes, setSocietes] = useState<SocieteResponse[]>([]);
  const [form, setForm] = useState<ClientCreateDTO>(emptyClient);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [filterQuery, setFilterQuery] = useState("");
  const { status, token } = useAuth();
  const isEditing = editingId !== null;

  const requireToken = useCallback(() => {
    if (status === "authenticated" && token) return token;
    setError("Vous devez être connecté pour accéder aux données.");
    return null;
  }, [status, token]);

  const societeById = useMemo(() => {
    const map = new Map<number, SocieteResponse>();
    societes.forEach((societe) => {
      map.set(societe.id, societe);
    });
    return map;
  }, [societes]);

  const filteredClients = useMemo(() => {
    const normalizedQuery = filterQuery.trim().toLowerCase();
    if (!normalizedQuery) {
      return clients;
    }
    return clients.filter((client) => {
      const valuesToSearch = [
        client.nom,
        client.prenom,
        client.telephone,
        client.societe?.nom,
        client.adresse,
      ]
        .filter(Boolean)
        .map((value) => value!.toLowerCase());
      return valuesToSearch.some((value) => value.includes(normalizedQuery));
    });
  }, [clients, filterQuery]);

  const hasFilter = Boolean(filterQuery.trim());

  const loadData = useCallback(async () => {
    const authToken = requireToken();
    if (!authToken) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const [clientsData, societesData] = await Promise.all([
        getClients(authToken),
        getSocietes(authToken),
      ]);
      setClients(clientsData ?? []);
      setSocietes(societesData ?? []);
    } catch (err) {
      setError(formatApiError(err, "Erreur inconnue"));
    } finally {
      setLoading(false);
    }
  }, [requireToken]);

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
    const authToken = requireToken();
    if (!authToken) return;
    setFormErrors([]);
    const { payload, issues } = validateClientForm(form, clients, editingId);
    if (issues.length > 0) {
      setFormErrors(issues);
      return;
    }

    try {
      setSaving(true);
      setError(null);

      if (isEditing && editingId !== null) {
        const updatePayload: ClientUpdateDTO = { ...payload };
        await updateClient(authToken, editingId, updatePayload);
      } else {
        await createClient(authToken, payload);
      }
      setForm(emptyClient);
      setEditingId(null);
      await loadData();
    } catch (err) {
      setError(formatApiError(err, "Erreur inconnue"));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (client: ClientDTO) => {
    setEditingId(client.id);
    setFormErrors([]);
    setForm({
      nom: client.nom,
      prenom: client.prenom ?? "",
      telephone: client.telephone ?? "",
      adresse: client.adresse ?? "",
      societeId: client.societe?.id ?? 0,
    });
  };

  const handleDelete = async (id: number) => {
    const authToken = requireToken();
    if (!authToken) return;
    try {
      setFormErrors([]);
      setError(null);
      await deleteClient(authToken, id);
      await loadData();
    } catch (err) {
      setError(formatApiError(err, "Erreur inconnue"));
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyClient);
    setFormErrors([]);
  };

  const selectedSociete = form.societeId
    ? societeById.get(form.societeId)
    : undefined;

  return (
    <section className="w-full max-w-5xl p-6 mx-auto mt-8 border shadow-sm rounded-2xl border-zinc-200/70 bg-white/60 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs tracking-widest uppercase text-muted">CRM</p>
          <h2 className="text-xl font-semibold">Clients</h2>
          <p className="mt-1 text-xs text-muted">
            Créez, modifiez ou supprimez les contacts liés à vos sociétés.
          </p>
        </div>
        <button
          type="button"
          onClick={loadData}
          className="px-3 py-2 text-sm font-medium border rounded-lg shadow-sm border-zinc-200 text-foreground hover:-translate-y-px hover:shadow-md dark:border-zinc-700"
        >
          Rafraîchir
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-3 mt-6 sm:grid-cols-2">
        <input
          id="client-nom"
          name="nom"
          type="text"
          value={form.nom}
          onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))}
          placeholder="Nom*"
          className="px-3 py-2 text-sm border rounded-lg shadow-inner border-zinc-200 bg-white/70 text-foreground dark:border-zinc-700 dark:bg-zinc-900/60"
        />
        <input
          id="client-prenom"
          name="prenom"
          type="text"
          value={form.prenom ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, prenom: e.target.value }))}
          placeholder="Prénom*"
          className="px-3 py-2 text-sm border rounded-lg shadow-inner border-zinc-200 bg-white/70 text-foreground dark:border-zinc-700 dark:bg-zinc-900/60"
        />
        <input
          id="client-telephone"
          name="telephone"
          type="tel"
          value={form.telephone ?? ""}
          onChange={(e) =>
            setForm((f) => ({ ...f, telephone: e.target.value }))
          }
          placeholder="Téléphone"
          className="px-3 py-2 text-sm border rounded-lg shadow-inner border-zinc-200 bg-white/70 text-foreground dark:border-zinc-700 dark:bg-zinc-900/60"
        />
        <textarea
          id="client-adresse"
          name="adresse"
          value={form.adresse ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, adresse: e.target.value }))}
          placeholder="Adresse"
          rows={2}
          className="px-3 py-2 text-sm border rounded-lg shadow-inner sm:col-span-2 border-zinc-200 bg-white/70 text-foreground dark:border-zinc-700 dark:bg-zinc-900/60"
        />
        <label htmlFor="societeId-select" className="sr-only">
          Société liée*
        </label>
        <select
          id="societeId-select"
          name="societeId"
          value={form.societeId || ""}
          onChange={(e) =>
            setForm((f) => ({ ...f, societeId: Number(e.target.value) }))
          }
          className="px-3 py-2 text-sm border rounded-lg shadow-inner border-zinc-200 bg-white/70 text-foreground dark:border-zinc-700 dark:bg-zinc-900/60"
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
        <div className="flex justify-end gap-2 sm:col-span-2">
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="px-4 py-2 text-sm font-medium border rounded-lg shadow-sm border-zinc-200 text-foreground hover:-translate-y-px hover:shadow-md dark:border-zinc-700"
            >
              Annuler
            </button>
          )}
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white transition bg-black rounded-lg shadow-sm hover:-translate-y-px hover:shadow-md dark:bg-white dark:text-black disabled:opacity-70"
          >
          {saving ? "Sauvegarde…" : editingId ? "Mettre à jour" : "Créer"}
        </button>
        </div>
      </form>

      {formErrors.length > 0 && (
        <div className="px-3 py-2 mt-4 text-sm border rounded-lg border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/60 dark:bg-amber-900/40 dark:text-amber-100">
          <ul className="pl-5 space-y-1 list-disc">
            {formErrors.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      {error && (
        <div className="px-3 py-2 mt-4 text-sm text-red-700 border border-red-200 rounded-lg bg-red-50 dark:border-red-700/60 dark:bg-red-900/40 dark:text-red-100">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-3 mt-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex-1">
          <label htmlFor="clients-search" className="text-xs tracking-wide uppercase text-muted">
            Recherche
          </label>
          <input
            id="clients-search"
            name="search"
            type="search"
            value={filterQuery}
            onChange={(event) => setFilterQuery(event.target.value)}
            placeholder="Nom, société ou téléphone"
            className="w-full px-3 py-2 mt-1 text-sm border rounded-lg shadow-inner border-zinc-200 bg-white/70 text-foreground dark:border-zinc-700 dark:bg-zinc-900/60"
          />
        </div>
        <div className="text-xs text-muted">
          {loading
            ? "Chargement des clients…"
            : `Clients affichés : ${filteredClients.length}/${clients.length}`}
        </div>
      </div>

      <div className="mt-4 text-sm divide-y divide-zinc-200 dark:divide-zinc-800">
        {loading && clients.length === 0 ? (
          <p className="py-4 text-muted">Chargement…</p>
        ) : filteredClients.length === 0 ? (
          <p className="py-4 text-muted">
            {hasFilter
              ? "Aucun client ne correspond à votre recherche."
              : "Aucun client pour le moment."}
          </p>
        ) : (
          filteredClients.map((client) => {
            const societe = client.societe?.id
              ? societeById.get(client.societe.id)
              : undefined;
            const societeLabel = client.societe?.nom ?? societe?.nom;
            return (
              <article
                key={client.id}
                className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <p className="font-medium text-foreground">
                    {client.prenom} {client.nom}
                  </p>
                  {societeLabel && (
                    <p className="text-xs tracking-wide uppercase text-muted">
                      {societeLabel}
                    </p>
                  )}
                  {client.telephone && (
                    <p className="text-xs text-muted">
                      {`☎ ${client.telephone}`}
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
