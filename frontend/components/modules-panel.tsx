"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  ModuleCreateDTO,
  ModuleDTO,
  ModuleUpdateDTO
} from "@/types";
import {
  createModule,
  deleteModule,
  getModules,
  updateModule
} from "@/lib/api/module";
import { useAuth } from "@/lib/hooks/useAuth";
import { formatApiError } from "@/lib/ui/format-api-error";

const emptyForm: ModuleCreateDTO = {
  nom: "",
  description: "",
  categorie: "",
  version: "",
  actif: true
};

export function ModulesPanel() {
  const [modules, setModules] = useState<ModuleDTO[]>([]);
  const [form, setForm] = useState<ModuleCreateDTO>(emptyForm);
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

  const load = useCallback(async () => {
    const authToken = requireAuth();
    if (!authToken) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await getModules(authToken);
      setModules(data ?? []);
    } catch (err) {
      setError(formatApiError(err, "Erreur inconnue"));
    } finally {
      setLoading(false);
    }
  }, [requireAuth]);

  useEffect(() => {
    if (status !== "authenticated" || !token) return;
    void load();
  }, [load, status, token]);

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
    if (!form.nom.trim()) {
      setError("Le nom du module est requis");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      if (editingId) {
        const payload: ModuleUpdateDTO = { ...form };
        await updateModule(authToken, editingId, payload);
      } else {
        await createModule(authToken, form);
      }
      setForm(emptyForm);
      setEditingId(null);
      await load();
    } catch (err) {
      setError(formatApiError(err, "Erreur inconnue"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    const authToken = requireAuth();
    if (!authToken) return;
    try {
      setError(null);
      await deleteModule(authToken, id);
      await load();
    } catch (err) {
      setError(formatApiError(err, "Erreur inconnue"));
    }
  };

  const handleEdit = (module: ModuleDTO) => {
    setEditingId(module.id);
    setForm({
      nom: module.nom,
      description: module.description ?? "",
      categorie: module.categorie ?? "",
      version: module.version ?? "",
      actif: module.actif
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const toggleActif = async (module: ModuleDTO) => {
    const authToken = requireAuth();
    if (!authToken) return;
    try {
      setError(null);
      await updateModule(authToken, module.id, { actif: !module.actif });
      await load();
    } catch (err) {
      setError(formatApiError(err, "Erreur inconnue"));
    }
  };

  return (
    <section className="mx-auto mt-12 w-full max-w-5xl rounded-2xl border border-zinc-200/70 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted">
            Administration
          </p>
          <h2 className="text-xl font-semibold">Modules</h2>
          <p className="mt-1 text-xs text-muted">
            Activation, création et édition des modules fonctionnels.
          </p>
        </div>
        <button
          type="button"
          onClick={load}
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
          placeholder="Nom du module*"
          className="rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
        />
        <input
          type="text"
          value={form.categorie || ""}
          onChange={(e) =>
            setForm((f) => ({ ...f, categorie: e.target.value }))
          }
          placeholder="Catégorie"
          className="rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
        />
        <input
          type="text"
          value={form.version || ""}
          onChange={(e) =>
            setForm((f) => ({ ...f, version: e.target.value }))
          }
          placeholder="Version"
          className="rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
        />
        <textarea
          value={form.description || ""}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
          placeholder="Description"
          rows={3}
          className="sm:col-span-2 rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
        />
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          <input
            type="checkbox"
            checked={form.actif}
            onChange={(e) =>
              setForm((f) => ({ ...f, actif: e.target.checked }))
            }
            className="h-4 w-4 rounded border-zinc-300"
          />
          Module activé
        </label>
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
          ? "Chargement des modules…"
          : `Modules chargés : ${modules.length}`}
      </div>

      <div className="mt-4 divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
        {loading && modules.length === 0 ? (
          <p className="py-4 text-muted">Chargement…</p>
        ) : modules.length === 0 ? (
          <p className="py-4 text-muted">Aucun module pour le moment.</p>
        ) : (
          modules.map((module) => (
            <article
              key={module.id}
              className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-foreground">{module.nom}</p>
                  {module.categorie && (
                    <span className="rounded-full bg-(--badge-bg) px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-(--badge-text)">
                      {module.categorie}
                    </span>
                  )}
                  {module.version && (
                    <span className="rounded-full border border-zinc-200 px-2 py-0.5 text-[10px] font-semibold text-muted dark:border-zinc-700">
                      v{module.version}
                    </span>
                  )}
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                      module.actif
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
                        : "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                    }`}
                  >
                    {module.actif ? "Actif" : "Inactif"}
                  </span>
                </div>
                {module.description && (
                  <p className="text-muted">{module.description}</p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleActif(module)}
                  className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-foreground hover:-translate-y-px hover:shadow-sm dark:border-zinc-700"
                >
                  {module.actif ? "Désactiver" : "Activer"}
                </button>
                <button
                  type="button"
                  onClick={() => handleEdit(module)}
                  className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-foreground hover:-translate-y-px hover:shadow-sm dark:border-zinc-700"
                >
                  Modifier
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(module.id)}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:-translate-y-px hover:shadow-sm dark:border-red-700/60 dark:text-red-100"
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

export default ModulesPanel;
