"use client";

import { FormEvent, useEffect, useState } from "react";
import { SocieteRequest, SocieteResponse } from "@/types";
import { createSociete, deleteSocieteById, getSocietes } from "@/lib/api/societe";

const emptyForm: SocieteRequest = {
  nom: "",
  tva: "",
  email: "",
  telephone: "",
  adresse: ""
};

export function SocietesPanel() {
  const [societes, setSocietes] = useState<SocieteResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<SocieteRequest>(emptyForm);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const data = await getSocietes();
      setSocietes(data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.nom.trim() || !form.tva.trim()) {
      setError("Le nom et la TVA sont requis");
      return;
    }
    try {
      setError(null);
      await createSociete(form);
      setForm(emptyForm);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    }
  };

  const onDelete = async (id: number) => {
    try {
      setError(null);
      await deleteSocieteById(id.toString());
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    }
  };

  return (
    <section className="mx-auto mt-12 w-full max-w-3xl rounded-2xl border border-zinc-200/70 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-(--muted)">
            API demo
          </p>
          <h2 className="text-xl font-semibold">Sociétés</h2>
        </div>
        <button
          type="button"
          onClick={load}
          className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-(--foreground) shadow-sm hover:-translate-y-px hover:shadow-md dark:border-zinc-700"
        >
          Rafraîchir
        </button>
      </div>

      <form onSubmit={onSubmit} className="mt-6 grid gap-3 sm:grid-cols-3">
        <input
          type="text"
          value={form.nom}
          onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))}
          placeholder="Nom*"
          className="rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-(--foreground) shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
        />
        <input
          type="text"
          value={form.tva}
          onChange={(e) => setForm((f) => ({ ...f, tva: e.target.value }))}
          placeholder="TVA*"
          className="rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-(--foreground) shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
        />
        <input
          type="email"
          value={form.email || ""}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          placeholder="Email"
          className="rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-(--foreground) shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
        />
        <input
          type="text"
          value={form.telephone || ""}
          onChange={(e) =>
            setForm((f) => ({ ...f, telephone: e.target.value }))
          }
          placeholder="Téléphone"
          className="rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-(--foreground) shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
        />
        <input
          type="text"
          value={form.adresse || ""}
          onChange={(e) =>
            setForm((f) => ({ ...f, adresse: e.target.value }))
          }
          placeholder="Adresse"
          className="rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-(--foreground) shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60 sm:col-span-3"
        />
        <div className="sm:col-span-3 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-px hover:shadow-md dark:bg-white dark:text-black"
          >
            Ajouter
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-700/50 dark:bg-red-900/40 dark:text-red-100">
          {error}
        </div>
      )}

      <div className="mt-6 divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
        {loading ? (
          <p className="py-4 text-(--muted)">Chargement…</p>
        ) : societes.length === 0 ? (
          <p className="py-4 text-(--muted)">Aucune société pour le moment.</p>
        ) : (
          societes.map((societe, index) => {
            const id = societe.id ?? index;
            return (
              <div
                key={id || `${societe.nom}-${index}`}
                className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-(--foreground)">
                    {societe.nom}
                  </p>
                  <p className="text-(--muted)">
                    TVA {societe.tva} ·{" "}
                    {societe.telephone || "Téléphone indisponible"}
                  </p>
                  {(societe.email || societe.adresse) && (
                    <p className="text-(--muted)">
                      {societe.email ?? "Email non renseigné"} ·{" "}
                      {societe.adresse ?? "Adresse non renseignée"}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => onDelete(Number(id))}
                  className="self-start rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:-translate-y-px hover:shadow-sm dark:border-red-700/60 dark:text-red-100 disabled:opacity-50"
                  disabled={!societe.id}
                >
                  Supprimer
                </button>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

export default SocietesPanel;
