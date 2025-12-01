"use client";

import { FormEvent, useEffect, useState } from "react";

type Societe = {
  id?: string | number;
  name: string;
  description?: string;
  city?: string;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE?.replace(/\/+$/, "") ??
  "http://localhost:8080";

export function SocietesPanel() {
  const [societes, setSocietes] = useState<Societe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", city: "", description: "" });

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/api/societes`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`GET failed (${res.status})`);
      const data = (await res.json()) as Societe[];
      setSocietes(data);
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
    if (!form.name.trim()) {
      setError("Le nom est requis");
      return;
    }
    try {
      setError(null);
      const res = await fetch(`${API_BASE}/api/societes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`POST failed (${res.status})`);
      setForm({ name: "", city: "", description: "" });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    }
  };

  const onDelete = async (id: string) => {
    try {
      setError(null);
      const res = await fetch(`${API_BASE}/api/societes/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`DELETE failed (${res.status})`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    }
  };

  return (
    <section className="mx-auto mt-12 w-full max-w-3xl rounded-2xl border border-zinc-200/70 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-[var(--muted)]">
            API demo
          </p>
          <h2 className="text-xl font-semibold">Sociétés</h2>
        </div>
        <button
          type="button"
          onClick={load}
          className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-[var(--foreground)] shadow-sm hover:-translate-y-[1px] hover:shadow-md dark:border-zinc-700"
        >
          Rafraîchir
        </button>
      </div>

      <form onSubmit={onSubmit} className="mt-6 grid gap-3 sm:grid-cols-3">
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="Nom"
          className="rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-[var(--foreground)] shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
        />
        <input
          type="text"
          value={form.city}
          onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
          placeholder="Ville"
          className="rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-[var(--foreground)] shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
        />
        <input
          type="text"
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
          placeholder="Description"
          className="rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-[var(--foreground)] shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60 sm:col-span-3"
        />
        <div className="sm:col-span-3 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-[1px] hover:shadow-md dark:bg-white dark:text-black"
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
          <p className="py-4 text-[var(--muted)]">Chargement…</p>
        ) : societes.length === 0 ? (
          <p className="py-4 text-[var(--muted)]">Aucune société pour le moment.</p>
        ) : (
          societes.map((societe, index) => {
            const idStr =
              societe.id !== undefined && societe.id !== null
                ? String(societe.id)
                : "";
            return (
              <div
                key={idStr || `${societe.name}-${index}`}
                className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-[var(--foreground)]">
                    {societe.name}
                  </p>
                  <p className="text-[var(--muted)]">
                    {societe.city || "Ville inconnue"} ·{" "}
                    {societe.description || "Pas de description"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    idStr
                      ? onDelete(idStr)
                      : setError("Impossible de supprimer : id manquant")
                  }
                  className="self-start rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:-translate-y-[1px] hover:shadow-sm dark:border-red-700/60 dark:text-red-100 disabled:opacity-50"
                  disabled={!idStr}
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
