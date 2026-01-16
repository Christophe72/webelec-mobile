"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSocietes } from "@/lib/api/societe";
import { createProduit } from "@/lib/api/catalogue";
import type { SocieteResponse } from "@/types";

type CatalogueItem = {
  label: string;
};

type CatalogueCategory = {
  id: string;
  title: string;
  items: CatalogueItem[];
};

type MaterialItem = {
  label: string;
  reference: string;
  quantiteStock: number;
  prixUnitaire: number;
};

const CATEGORIES: CatalogueCategory[] = [
  {
    id: "protection-distribution",
    title: "Protection & distribution",
    items: [
      { label: "Disjoncteur de branchement 40 A" },
      { label: "Disjoncteur de branchement 63 A" },
      { label: "Interrupteur différentiel 300 mA – 40 A" },
      { label: "Interrupteur différentiel 300 mA – 63 A" },
      { label: "Interrupteur différentiel 30 mA – 40 A" },
      { label: "Interrupteur différentiel 30 mA – 63 A" },
      { label: "Disjoncteur 10 A – courbe C" },
      { label: "Disjoncteur 16 A – courbe C" },
      { label: "Disjoncteur 20 A – courbe C" },
      { label: "Disjoncteur 25 A – courbe C" },
      { label: "Disjoncteur 32 A – courbe C" },
      { label: "Disjoncteur 40 A – courbe C" },
      { label: "Peigne d’alimentation monophasé" },
      { label: "Peigne d’alimentation tétrapolaire" },
      { label: "Barrette de répartition" },
      { label: "Bornier de terre" },
      { label: "Tableau électrique" },
      { label: "Coffret modulaire" },
      { label: "Parafoudre type 2" },
    ],
  },
  {
    id: "conducteurs-cables",
    title: "Conducteurs & câbles",
    items: [
      { label: "Conducteur phase" },
      { label: "Conducteur neutre" },
      { label: "Conducteur de protection (terre)" },
      { label: "Fil VOB 1,5 mm²" },
      { label: "Fil VOB 2,5 mm²" },
      { label: "Fil VOB 4 mm²" },
      { label: "Fil VOB 6 mm²" },
      { label: "Fil VOB 10 mm²" },
      { label: "Câble XVB 3G1,5" },
      { label: "Câble XVB 3G2,5" },
      { label: "Câble XVB 3G4" },
      { label: "Câble XVB 3G6" },
      { label: "Câble XVB 5G6" },
      { label: "Câble EXVB 3G2,5" },
      { label: "Câble EXVB 3G6" },
    ],
  },
  {
    id: "sections-normalisees",
    title: "Sections normalisées (références métier)",
    items: [
      { label: "Section 1,5 mm²" },
      { label: "Section 2,5 mm²" },
      { label: "Section 4 mm²" },
      { label: "Section 6 mm²" },
      { label: "Section 10 mm²" },
      { label: "Section 16 mm²" },
      { label: "Section 25 mm²" },
    ],
  },
  {
    id: "cheminement-protection-mecanique",
    title: "Cheminement & protection mécanique",
    items: [
      { label: "Gaine ICTA Ø16" },
      { label: "Gaine ICTA Ø20" },
      { label: "Gaine ICTA Ø25" },
      { label: "Tube rigide PVC Ø16" },
      { label: "Tube rigide PVC Ø20" },
      { label: "Goulotte électrique" },
      { label: "Chemin de câble" },
      { label: "Boîte de dérivation" },
      { label: "Boîte d’encastrement" },
      { label: "Boîte étanche IP55" },
      { label: "Boîte étanche IP65" },
    ],
  },
  {
    id: "commande-appareillage",
    title: "Commande & appareillage",
    items: [
      { label: "Interrupteur simple" },
      { label: "Interrupteur va-et-vient" },
      { label: "Interrupteur permutateur" },
      { label: "Bouton-poussoir" },
      { label: "Variateur" },
      { label: "Télérupteur 16 A" },
      { label: "Contacteur 20 A" },
      { label: "Contacteur 25 A" },
      { label: "Minuterie d’escalier" },
      { label: "Horloge programmable" },
    ],
  },
  {
    id: "prises-sorties",
    title: "Prises & sorties",
    items: [
      { label: "Prise de courant 16 A" },
      { label: "Prise double 16 A" },
      { label: "Prise commandée 16 A" },
      { label: "Prise extérieure 16 A IP55" },
      { label: "Prise étanche 16 A IP65" },
      { label: "Prise RJ45" },
      { label: "Prise TV coaxiale" },
      { label: "Prise USB" },
    ],
  },
  {
    id: "eclairage",
    title: "Éclairage",
    items: [
      { label: "Point lumineux" },
      { label: "Luminaire plafonnier" },
      { label: "Applique murale" },
      { label: "Spot encastré" },
      { label: "Spot LED" },
      { label: "Réglette LED" },
      { label: "Éclairage extérieur" },
      { label: "Éclairage de sécurité" },
    ],
  },
  {
    id: "appareils-dedies",
    title: "Appareils dédiés",
    items: [
      { label: "Circuit lave-linge – disjoncteur 20 A – 2,5 mm²" },
      { label: "Circuit lave-vaisselle – disjoncteur 20 A – 2,5 mm²" },
      { label: "Circuit sèche-linge – disjoncteur 20 A – 2,5 mm²" },
      { label: "Circuit four – disjoncteur 25 A – 4 mm²" },
      { label: "Circuit taque – disjoncteur 32 A – 6 mm²" },
      { label: "Circuit chauffe-eau – disjoncteur 20 A – 2,5 mm²" },
      { label: "Circuit chauffage électrique – disjoncteur 20–32 A" },
    ],
  },
  {
    id: "mise-a-la-terre",
    title: "Mise à la terre",
    items: [
      { label: "Prise de terre" },
      { label: "Piquet de terre" },
      { label: "Boucle de fond de fouille" },
      { label: "Barrette de coupure de terre" },
      { label: "Conducteur principal de terre 16 mm²" },
      { label: "Collecteur de terre" },
    ],
  },
  {
    id: "securite-controle",
    title: "Sécurité & contrôle",
    items: [
      { label: "Testeur de tension" },
      { label: "Testeur différentiel" },
      { label: "Mesureur de terre" },
      { label: "Étiquette de repérage" },
      { label: "Schéma unifilaire" },
      { label: "Schéma de position" },
      { label: "Repérage des circuits" },
    ],
  },
] as const;

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const extractCapacities = (label: string) => {
  const normalized = label.replace(/–/g, "-");
  const capacities: string[] = [];

  const amperageMatch = normalized.match(/(\d+(?:-\d+)?\s*A)/g);
  if (amperageMatch) capacities.push(...amperageMatch.map((v) => v.trim()));

  const milliAmpMatch = normalized.match(/(\d+\s*mA)/g);
  if (milliAmpMatch) capacities.push(...milliAmpMatch.map((v) => v.trim()));

  const sectionMatch = normalized.match(/(\d+(?:,\d+)?\s*mm²)/g);
  if (sectionMatch) capacities.push(...sectionMatch.map((v) => v.trim()));

  const diameterMatch = normalized.match(/(Ø\s*\d+)/g);
  if (diameterMatch) capacities.push(...diameterMatch.map((v) => v.trim()));

  const ipMatch = normalized.match(/(IP\d+)/g);
  if (ipMatch) capacities.push(...ipMatch.map((v) => v.trim()));

  const cableMatch = normalized.match(/(\dG\d+(?:,\d+)?)/g);
  if (cableMatch) capacities.push(...cableMatch.map((v) => v.trim()));

  const curveMatch = normalized.match(/courbe\s*[A-Z]/i);
  if (curveMatch)
    capacities.push(curveMatch[0].replace(/courbe\s*/i, "Courbe "));

  const typeMatch = normalized.match(/type\s*\d+/i);
  if (typeMatch) capacities.push(typeMatch[0].replace(/type\s*/i, "Type "));

  return Array.from(new Set(capacities));
};

export default function CatalogueComposantsList() {
  const [activeCategoryId, setActiveCategoryId] = useState(
    CATEGORIES[0]?.id ?? ""
  );
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [materialItems, setMaterialItems] = useState<MaterialItem[]>([]);
  const [activeCapacities, setActiveCapacities] = useState<string[]>([]);
  const [societes, setSocietes] = useState<SocieteResponse[]>([]);
  const [societeId, setSocieteId] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const loadSocietes = async () => {
      try {
        const data = await getSocietes();
        setSocietes(data ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      }
    };

    void loadSocietes();
  }, []);

  const activeCategory =
    CATEGORIES.find((category) => category.id === activeCategoryId) ??
    CATEGORIES[0];

  const capacityOptions = useMemo(() => {
    if (!activeCategory) return [];
    const allCaps = activeCategory.items.flatMap((item) =>
      extractCapacities(item.label)
    );
    return Array.from(new Set(allCaps)).sort();
  }, [activeCategory]);

  const filteredItems = useMemo(() => {
    if (!activeCategory) return [];
    if (activeCapacities.length === 0) return activeCategory.items;
    return activeCategory.items.filter((item) => {
      const capacities = extractCapacities(item.label);
      return activeCapacities.some((cap) => capacities.includes(cap));
    });
  }, [activeCategory, activeCapacities]);

  const toggleItem = (label: string) => {
    setSelectedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
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
      const existing = new Set(prev.map((item) => item.label));
      const nextItems = selectedItems
        .filter((label) => !existing.has(label))
        .map((label) => ({
          label,
          reference: toSlug(label),
          quantiteStock: 0,
          prixUnitaire: 0,
        }));
      return [...prev, ...nextItems];
    });
    setSelectedItems([]);
  };

  const removeMaterialItem = (label: string) => {
    setMaterialItems((prev) => prev.filter((item) => item.label !== label));
  };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  const updateMaterialItem = (
    label: string,
    changes: Partial<MaterialItem>
  ) => {
    setMaterialItems((prev) =>
      prev.map((item) =>
        item.label === label ? { ...item, ...changes } : item
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
    const validationError = validateMaterialItems();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);
      await Promise.all(
        materialItems.map((item) =>
          createProduit({
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
      setError(err instanceof Error ? err.message : "Erreur inconnue");
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
                <ol className="space-y-2 text-sm text-foreground list-decimal pl-5">
                  {filteredItems.map((item) => {
                    const caps = extractCapacities(item.label);
                    const isSelected = selectedItems.includes(item.label);
                    return (
                      <li key={item.label} className="pl-1">
                        <button
                          type="button"
                          onClick={() => toggleItem(item.label)}
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
                                {toSlug(item.label)}
                              </span>
                              {caps.map((cap) => (
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
                    {selectedItems.map((label) => (
                      <li
                        key={label}
                        className="rounded-lg border border-border/60 px-3 py-2"
                      >
                        {label}
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
                        key={item.label}
                        className="space-y-2 rounded-lg border border-border/60 px-3 py-2"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-medium text-foreground">
                              {item.label}
                            </p>
                            <p className="text-xs text-muted">
                              {toSlug(item.label)}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeMaterialItem(item.label)}
                            className="text-xs font-semibold text-muted-foreground hover:text-foreground"
                          >
                            Retirer
                          </button>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-3">
                          <div>
                            <label
                              htmlFor={`reference-${toSlug(item.label)}`}
                              className="text-[11px] uppercase text-muted"
                            >
                              Référence
                            </label>
                            <input
                              id={`reference-${toSlug(item.label)}`}
                              type="text"
                              value={item.reference}
                              onChange={(event) =>
                                updateMaterialItem(item.label, {
                                  reference: event.target.value,
                                })
                              }
                              className="mt-1 w-full rounded-lg border border-border/60 bg-white/70 px-2 py-1 text-xs text-foreground shadow-inner dark:bg-zinc-900/60"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor={`quantite-${toSlug(item.label)}`}
                              className="text-[11px] uppercase text-muted"
                            >
                              Quantité
                            </label>
                            <input
                              id={`quantite-${toSlug(item.label)}`}
                              type="number"
                              value={item.quantiteStock}
                              onChange={(event) =>
                                updateMaterialItem(item.label, {
                                  quantiteStock: Number(event.target.value),
                                })
                              }
                              className="mt-1 w-full rounded-lg border border-border/60 bg-white/70 px-2 py-1 text-xs text-foreground shadow-inner dark:bg-zinc-900/60"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor={`prix-${toSlug(item.label)}`}
                              className="text-[11px] uppercase text-muted"
                            >
                              Prix unitaire (€)
                            </label>
                            <input
                              id={`prix-${toSlug(item.label)}`}
                              type="number"
                              step="0.01"
                              value={item.prixUnitaire}
                              onChange={(event) =>
                                updateMaterialItem(item.label, {
                                  prixUnitaire: Number(event.target.value),
                                })
                              }
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
