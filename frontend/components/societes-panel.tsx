"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { SocieteRequest, SocieteResponse } from "@/types";
import {
  createSociete,
  deleteSocieteById,
  getSocietes,
} from "@/lib/api/societe";
import { useAuth } from "@/lib/hooks/useAuth";
import { formatApiError } from "@/lib/ui/format-api-error";

const emptyForm: SocieteRequest = {
  nom: "",
  tva: "",
  email: "",
  telephone: "",
  adresse: "",
};

export function SocietesPanel() {
  const [societes, setSocietes] = useState<SocieteResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<SocieteRequest>(emptyForm);
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
      const data = await getSocietes(authToken);
      setSocietes(data ?? []);
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

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const authToken = requireAuth();
    if (!authToken) return;
    const trimmedNom = form.nom.trim();
    const trimmedTva = form.tva.trim();
    if (!trimmedNom || !trimmedTva) {
      setError("Le nom et la TVA sont requis");
      return;
    }
    try {
      setError(null);
      const payload: SocieteRequest = {
        nom: trimmedNom,
        tva: trimmedTva,
        email: form.email?.trim() || undefined,
        telephone: form.telephone?.trim() || undefined,
        adresse: form.adresse?.trim() || undefined,
      };
      await createSociete(authToken, payload);
      setForm(emptyForm);
      await load();
    } catch (err) {
      setError(formatApiError(err, "Erreur inconnue"));
    }
  };

  const onDelete = async (id: number) => {
    const authToken = requireAuth();
    if (!authToken) return;
    try {
      setError(null);
      await deleteSocieteById(authToken, id.toString());
      await load();
    } catch (err) {
      setError(formatApiError(err, "Erreur inconnue"));
    }
  };

  return (
    <section className="mx-auto mt-12 w-full max-w-5xl rounded-2xl border border-zinc-200/70 bg-white/60 p-4 sm:p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted">
            API demo
          </p>
          <h2 className="text-xl font-semibold">Sociétés</h2>
        </div>
        <button
          type="button"
          onClick={load}
          className="self-start rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-foreground shadow-sm hover:-translate-y-px hover:shadow-md dark:border-zinc-700 sm:self-auto"
        >
          Rafraîchir
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
        {/* Formulaire à gauche */}
        <div className="md:col-span-1">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Nouvelle société
          </h3>
          <form onSubmit={onSubmit} className="grid gap-3">
            <div>
              <label htmlFor="societe-nom" className="mb-1.5 block text-xs font-semibold text-muted">
                Nom de la société*
              </label>
              <input
                id="societe-nom"
                name="nom"
                autoComplete="organization"
                type="text"
                value={form.nom}
                onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))}
                placeholder="Ex: ACME SARL"
                className="w-full rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
              />
            </div>
            <div>
              <label htmlFor="societe-tva" className="mb-1.5 block text-xs font-semibold text-muted">
                Numéro de TVA*
              </label>
              <input
                id="societe-tva"
                name="tva"
                autoComplete="off"
                type="text"
                value={form.tva}
                onChange={(e) => setForm((f) => ({ ...f, tva: e.target.value }))}
                placeholder="Ex: BE0123456789"
                className="w-full rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
              />
            </div>
            <div>
              <label htmlFor="societe-email" className="mb-1.5 block text-xs font-semibold text-muted">
                Email
              </label>
              <input
                id="societe-email"
                name="email"
                autoComplete="email"
                type="email"
                value={form.email || ""}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="contact@acme.com"
                className="w-full rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
              />
            </div>
            <div>
              <label htmlFor="societe-telephone" className="mb-1.5 block text-xs font-semibold text-muted">
                Téléphone
              </label>
              <input
                id="societe-telephone"
                name="telephone"
                autoComplete="tel"
                type="text"
                value={form.telephone || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, telephone: e.target.value }))
                }
                placeholder="+32 2 123 45 67"
                className="w-full rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
              />
            </div>
            <div>
              <label htmlFor="societe-adresse" className="mb-1.5 block text-xs font-semibold text-muted">
                Adresse
              </label>
              <input
                id="societe-adresse"
                name="adresse"
                autoComplete="street-address"
                type="text"
                value={form.adresse || ""}
                onChange={(e) => setForm((f) => ({ ...f, adresse: e.target.value }))}
                placeholder="Rue de la Loi 1, 1000 Bruxelles"
                className="w-full rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
              />
            </div>
            <div className="flex justify-end">
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
        </div>

        {/* Liste des sociétés à droite */}
        <div className="md:col-span-1 lg:col-span-2">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Liste des sociétés ({societes.length})
          </h3>

          <div className="text-xs text-muted mb-4">
            {loading ? "Chargement des sociétés…" : `${societes.length} société${societes.length > 1 ? "s" : ""} enregistrée${societes.length > 1 ? "s" : ""}`}
          </div>

          <div className="divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
            {loading ? (
              <p className="py-4 text-muted">Chargement…</p>
            ) : societes.length === 0 ? (
              <p className="py-4 text-muted">Aucune société pour le moment.</p>
            ) : (
              societes.map((societe, index) => {
                const id = societe.id ?? index;
                return (
                  <div
                    key={id || `${societe.nom}-${index}`}
                    className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-medium text-foreground">{societe.nom}</p>
                      <p className="text-muted">
                        TVA {societe.tva} ·{" "}
                        {societe.telephone || "Téléphone indisponible"}
                      </p>
                      {(societe.email || societe.adresse) && (
                        <p className="text-muted">
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
        </div>
      </div>
    </section>
  );
}

export default SocietesPanel;
