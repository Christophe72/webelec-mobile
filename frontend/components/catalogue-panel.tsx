/**
 * CataloguePanel gère l'intégralité du catalogue produits.
 *
 * Il propose une interface permettant de lister, créer, modifier et supprimer des
 * produits tout en les rattachant à une société.
 *
 * Fonctionnalités :
 * - Récupère et affiche les listes de produits et de sociétés.
 * - Fournit un formulaire pour ajouter ou éditer un produit existant.
 * - Permet de supprimer un produit et de rafraîchir les données.
 * - Gère les états de chargement, d'erreur et les validations essentielles du formulaire.
 *
 * État local :
 * - `produits` : liste des produits chargés.
 * - `societes` : liste des sociétés utilisables dans le formulaire.
 * - `form` : valeurs courantes du formulaire de création/édition.
 * - `editingId` : identifiant du produit en cours de modification, `null` sinon.
 * - `loading` : indique si les données sont en cours de chargement.
 * - `saving` : indique si une sauvegarde est en cours.
 * - `error` : message d'erreur éventuel.
 *
 * Exemple :
 * ```tsx
 * <CataloguePanel />
 * ```
 *
 * @component
 */
"use client";

import { FormEvent, useEffect, useState } from "react";
import type { ProduitDTO, ProduitCreateDTO, SocieteResponse } from "@/types";
import {
  getProduits,
  createProduit,
  updateProduit,
  deleteProduit,
} from "@/lib/api/catalogue";
import { getSocietes } from "@/lib/api/societe";

const emptyProduit: ProduitCreateDTO = {
  reference: "",
  nom: "",
  description: "",
  quantiteStock: 0,
  prixUnitaire: 0,
  societeId: 0,
};

export function CataloguePanel() {
  const [produits, setProduits] = useState<ProduitDTO[]>([]);
  const [societes, setSocietes] = useState<SocieteResponse[]>([]);
  const [form, setForm] = useState<ProduitCreateDTO>(emptyProduit);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [produitsData, societesData] = await Promise.all([
        getProduits(),
        getSocietes(),
      ]);
      setProduits(produitsData ?? []);
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
    if (!form.reference.trim() || !form.nom.trim()) {
      setError("Référence et nom sont requis");
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
        await updateProduit(editingId, form);
      } else {
        await createProduit(form);
      }
      setForm(emptyProduit);
      setEditingId(null);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (produit: ProduitDTO) => {
    setEditingId(produit.id);
    setForm({
      reference: produit.reference,
      nom: produit.nom,
      description: produit.description ?? "",
      quantiteStock: produit.quantiteStock,
      prixUnitaire: produit.prixUnitaire,
      societeId: produit.societeId,
    });
  };

  const handleDelete = async (id: number) => {
    try {
      setError(null);
      await deleteProduit(id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyProduit);
  };

  return (
    <section className="mx-auto mt-8 w-full max-w-5xl rounded-2xl border border-zinc-200/70 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted">Stock</p>
          <h2 className="text-xl font-semibold">Catalogue produits</h2>
          <p className="mt-1 text-xs text-muted">
            Références centralisées et stocks synchronisés avec `/produits`.
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
          value={form.reference}
          onChange={(e) =>
            setForm((f) => ({ ...f, reference: e.target.value }))
          }
          placeholder="Référence*"
          className="rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
        />
        <input
          type="text"
          value={form.nom}
          onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))}
          placeholder="Nom du produit*"
          className="rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
        />
        <textarea
          value={form.description ?? ""}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
          placeholder="Description"
          rows={2}
          className="sm:col-span-2 rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
        />
        <input
          type="number"
          value={form.quantiteStock}
          onChange={(e) =>
            setForm((f) => ({ ...f, quantiteStock: Number(e.target.value) }))
          }
          placeholder="Quantité en stock"
          className="rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
        />
        <input
          type="number"
          step="0.01"
          value={form.prixUnitaire}
          onChange={(e) =>
            setForm((f) => ({ ...f, prixUnitaire: Number(e.target.value) }))
          }
          placeholder="Prix unitaire (€)"
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
          ? "Chargement du catalogue…"
          : `Produits chargés : ${produits.length}`}
      </div>

      <div className="mt-4 divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
        {loading && produits.length === 0 ? (
          <p className="py-4 text-muted">Chargement…</p>
        ) : produits.length === 0 ? (
          <p className="py-4 text-muted">Aucun produit enregistré.</p>
        ) : (
          produits.map((produit) => {
            const societe = societes.find((s) => s.id === produit.societeId);
            return (
              <article
                key={produit.id}
                className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">
                    {produit.reference} — {produit.nom}
                  </p>
                  {societe && (
                    <p className="text-xs uppercase tracking-wide text-muted">
                      {societe.nom}
                    </p>
                  )}
                  {produit.description && (
                    <p className="text-xs text-muted">{produit.description}</p>
                  )}
                  <p className="text-xs text-muted">
                    Stock : {produit.quantiteStock} • Prix :{" "}
                    {produit.prixUnitaire.toLocaleString("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(produit)}
                    className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-foreground hover:-translate-y-px hover:shadow-sm dark:border-zinc-700"
                  >
                    Modifier
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(produit.id)}
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

export default CataloguePanel;
