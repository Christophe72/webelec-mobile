"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NumberInput } from "@/components/ui/number-input";
import { CATEGORIES, type CatalogueItem } from "@/data/catalogue-categories";
import { createProduit } from "@/lib/api/catalogue";
import { getSocietes } from "@/lib/api/societe";
import { useAuth } from "@/lib/hooks/useAuth";
import { formatApiError } from "@/lib/ui/format-api-error";
import type { SocieteResponse } from "@/types";

type MaterialItem = {
  label: string;
  slug: string;
  reference: string;
  quantiteStock: number;
  prixUnitaire: number;
};

export default function CatalogueComposantsList() {
  const [activeCategoryId, setActiveCategoryId] = useState(
    CATEGORIES[0]?.id ?? ""
  );
  const [selectedItems, setSelectedItems] = useState<CatalogueItem[]>([]);
  const [materialItems, setMaterialItems] = useState<MaterialItem[]>([]);
  const [activeCapacities, setActiveCapacities] = useState<string[]>([]);
  const [societes, setSocietes] = useState<SocieteResponse[]>([]);
  const [societeId, setSocieteId] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { status, token } = useAuth();

  const requireAuth = useCallback(() => {
    if (status === "authenticated" && token) return token;
    setError("Vous devez être connecté pour accéder aux données.");
    return null;
  }, [status, token]);

  useEffect(() => {
    const loadSocietes = async () => {
      try {
        const authToken = requireAuth();
        if (!authToken) return;
        const data = await getSocietes(authToken);
        setSocietes(data ?? []);
      } catch (err) {
        setError(formatApiError(err, "Erreur inconnue"));
      }
    };

    if (status !== "authenticated" || !token) return;
    void loadSocietes();
  }, [requireAuth, status, token]);

  const activeCategory =
    CATEGORIES.find((category) => category.id === activeCategoryId) ??
    CATEGORIES[0];

  const capacityOptions = useMemo(() => {
    if (!activeCategory) return [];
    const allCaps = activeCategory.items.flatMap((item) => item.capacities);
    return Array.from(new Set(allCaps)).sort();
  }, [activeCategory]);

  const filteredItems = useMemo(() => {
    if (!activeCategory) return [];
    if (activeCapacities.length === 0) return activeCategory.items;
    return activeCategory.items.filter((item) =>
      activeCapacities.some((cap) => item.capacities.includes(cap))
    );
  }, [activeCategory, activeCapacities]);

  const toggleItem = (item: CatalogueItem) => {
    setSelectedItems((prev) =>
      prev.some((entry) => entry.slug === item.slug)
        ? prev.filter((entry) => entry.slug !== item.slug)
        : [...prev, item]
    );
  };

  const toggleCapacity = (cap: string) => {
    setActiveCapacities((prev) =>
      prev.includes(cap) ? prev.filter((item) => item !== cap) : [...prev, cap]
    );
  };

  const addSelectionToMaterial = () => {
    if (selectedItems.length === 0) return;
    setMaterialItems((prev) => {
      const existing = new Set(prev.map((item) => item.slug));
      const nextItems = selectedItems
        .filter((item) => !existing.has(item.slug))
        .map((item) => ({
          label: item.label,
          slug: item.slug,
          reference: item.slug,
          quantiteStock: 0,
          prixUnitaire: 0,
        }));
      return [...prev, ...nextItems];
    });
    setSelectedItems([]);
  };

  const removeMaterialItem = (slug: string) => {
    setMaterialItems((prev) => prev.filter((item) => item.slug !== slug));
  };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  const updateMaterialItem = (slug: string, changes: Partial<MaterialItem>) => {
    setMaterialItems((prev) =>
      prev.map((item) =>
        item.slug === slug ? { ...item, ...changes } : item
      )
    );
  };

  const validateMaterialItems = () => {
    if (!societeId) {
      return "Sélectionnez une société pour enregistrer le matériel.";
    }
    if (materialItems.length === 0) {
      return "Ajoutez au moins un composant au matériel.";
    }
    const invalid = materialItems.find(
      (item) => !item.reference || item.prixUnitaire <= 0
    );
    if (invalid) {
      return "Chaque composant doit avoir une référence et un prix unitaire > 0.";
    }
    return null;
  };

  const handleSaveMaterial = async () => {
    setError(null);
    setSuccess(null);
    const authToken = requireAuth();
    if (!authToken) return;
    const validationError = validateMaterialItems();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);
      await Promise.all(
        materialItems.map((item) =>
          createProduit(authToken, {
            reference: item.reference,
            nom: item.label,
            description: undefined,
            quantiteStock: item.quantiteStock,
            prixUnitaire: item.prixUnitaire,
            societeId,
          })
        )
      );
      setMaterialItems([]);
      setSelectedItems([]);
      setSuccess("Matériel ajouté au catalogue.");
      window.dispatchEvent(new CustomEvent("catalogue:refresh"));
    } catch (err) {
      setError(formatApiError(err, "Erreur inconnue"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="w-full max-w-5xl space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-muted">
          Catalogue
        </p>
        <h2 className="text-xl font-semibold">Composants électriques</h2>
        <p className="mt-1 text-xs text-muted">
          Sélectionnez un composant et filtrez par capacité.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Familles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => {
                  setActiveCategoryId(category.id);
                  setActiveCapacities([]);
                }}
                className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                  activeCategoryId === category.id
                    ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                    : "border-border/60 text-foreground hover:-translate-y-px hover:shadow-sm"
                }`}
              >
                {category.title}
              </button>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base">
                Paramètres d&apos;ajout
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-xs uppercase tracking-wide text-muted">
                  Société
                </label>
                <select
                  value={societeId || ""}
                  onChange={(event) => setSocieteId(Number(event.target.value))}
                  className="mt-1 w-full rounded-lg border border-border/60 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:bg-zinc-900/60"
                >
                  <option value="">Sélectionnez une société</option>
                  {societes.map((societe) => (
                    <option key={societe.id} value={societe.id}>
                      {societe.nom}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-muted">
                Renseignez un prix unitaire pour chaque composant avant
                l&apos;enregistrement.
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base">Capacités</CardTitle>
            </CardHeader>
            <CardContent>
              {capacityOptions.length === 0 ? (
                <p className="text-sm text-muted">Aucune capacité détectée.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {capacityOptions.map((cap) => (
                    <button
                      key={cap}
                      type="button"
                      onClick={() => toggleCapacity(cap)}
                      className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                        activeCapacities.includes(cap)
                          ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                          : "border-border/60 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {cap}
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base">
                {activeCategory?.title ?? "Composants"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredItems.length === 0 ? (
                <p className="text-sm text-muted">
                  Aucun composant ne correspond aux filtres.
                </p>
              ) : (
                <ol className="space-y-2 text-sm text-foreground list-decimal pl-5 marker:text-foreground">
                  {filteredItems.map((item) => {
                    const isSelected = selectedItems.some(
                      (entry) => entry.slug === item.slug
                    );
                    return (
                      <li key={item.label} className="pl-1">
                        <button
                          type="button"
                          onClick={() => toggleItem(item)}
                          className={`w-full rounded-lg border px-3 py-2 text-left transition ${
                            isSelected
                              ? "border-black bg-black/5 dark:border-white dark:bg-white/10"
                              : "border-border/60 hover:-translate-y-px hover:shadow-sm"
                          }`}
                        >
                          <div className="flex flex-col gap-1">
                            <span className="font-medium text-foreground">
                              {item.label}
                            </span>
                            <div className="flex flex-wrap gap-2">
                              <span className="text-xs text-muted">
                                {item.slug}
                              </span>
                              {item.capacities.map((cap) => (
                                <span
                                  key={`${item.label}-${cap}`}
                                  className="rounded-full border border-border/60 px-2 py-0.5 text-[11px] text-muted-foreground"
                                >
                                  {cap}
                                </span>
                              ))}
                            </div>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ol>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base">Sélection</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedItems.length === 0 ? (
                <p className="text-sm text-muted">
                  Aucun composant sélectionné.
                </p>
              ) : (
                <div className="space-y-3">
                  <ul className="space-y-2 text-sm">
                    {selectedItems.map((item) => (
                      <li
                        key={item.slug}
                        className="rounded-lg border border-border/60 px-3 py-2"
                      >
                        {item.label}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={addSelectionToMaterial}
                      className="rounded-lg bg-black px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-px hover:shadow-md dark:bg-white dark:text-black"
                    >
                      Ajouter au matériel
                    </button>
                    <button
                      type="button"
                      onClick={clearSelection}
                      className="rounded-lg border border-border/60 px-3 py-2 text-xs font-medium text-foreground hover:-translate-y-px hover:shadow-sm"
                    >
                      Vider la sélection
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base">Matériel à ajouter</CardTitle>
            </CardHeader>
            <CardContent>
              {materialItems.length === 0 ? (
                <p className="text-sm text-muted">
                  Ajoutez des composants depuis la sélection.
                </p>
              ) : (
                <div className="space-y-3">
                  <ul className="space-y-3 text-sm">
                    {materialItems.map((item) => (
                      <li
                        key={item.slug}
                        className="space-y-2 rounded-lg border border-border/60 px-3 py-2"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-medium text-foreground">
                              {item.label}
                            </p>
                            <p className="text-xs text-muted">
                              {item.slug}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeMaterialItem(item.slug)}
                            className="text-xs font-semibold text-muted-foreground hover:text-foreground"
                          >
                            Retirer
                          </button>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-3">
                          <div>
                            <label
                              htmlFor={`reference-${item.slug}`}
                              className="text-[11px] uppercase text-muted"
                            >
                              Référence
                            </label>
                            <input
                              id={`reference-${item.slug}`}
                              type="text"
                              value={item.reference}
                              onChange={(event) =>
                                updateMaterialItem(item.slug, {
                                  reference: event.target.value,
                                })
                              }
                              className="mt-1 w-full rounded-lg border border-border/60 bg-white/70 px-2 py-1 text-xs text-foreground shadow-inner dark:bg-zinc-900/60"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor={`quantite-${item.slug}`}
                              className="text-[11px] uppercase text-muted"
                            >
                              Quantité
                            </label>
                            <NumberInput
                              id={`quantite-${item.slug}`}
                              value={item.quantiteStock}
                              onChange={(event) =>
                                updateMaterialItem(item.slug, {
                                  quantiteStock: Number(event.target.value),
                                })
                              }
                              min={0}
                              placeholder="10"
                              className="mt-1 w-full rounded-lg border border-border/60 bg-white/70 px-2 py-1 text-xs text-foreground shadow-inner dark:bg-zinc-900/60"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor={`prix-${item.slug}`}
                              className="text-[11px] uppercase text-muted"
                            >
                              Prix unitaire (€)
                            </label>
                            <NumberInput
                              id={`prix-${item.slug}`}
                              step={0.01}
                              value={item.prixUnitaire}
                              onChange={(event) =>
                                updateMaterialItem(item.slug, {
                                  prixUnitaire: Number(event.target.value),
                                })
                              }
                              min={0}
                              placeholder="49.99"
                              className="mt-1 w-full rounded-lg border border-border/60 bg-white/70 px-2 py-1 text-xs text-foreground shadow-inner dark:bg-zinc-900/60"
                            />
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSaveMaterial}
                      disabled={saving}
                      className="rounded-lg bg-black px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-px hover:shadow-md disabled:opacity-70 dark:bg-white dark:text-black"
                    >
                      {saving ? "Enregistrement…" : "Terminer et enregistrer"}
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-900/30 dark:text-emerald-100">
              {success}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
