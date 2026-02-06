export type CatalogueItem = {
  label: string;
  slug: string;
  capacities: string[];
};

export type CatalogueCategory = {
  id: string;
  title: string;
  items: CatalogueItem[];
};

type RawCatalogueCategory = {
  id: string;
  title: string;
  items: { label: string }[];
};

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
  if (milliAmpMatch)
    capacities.push(...milliAmpMatch.map((v) => v.trim()));

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

const RAW_CATEGORIES: RawCatalogueCategory[] = [
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
];

const buildCategory = (category: RawCatalogueCategory): CatalogueCategory => ({
  ...category,
  items: category.items.map((item) => ({
    ...item,
    slug: toSlug(item.label),
    capacities: extractCapacities(item.label),
  })),
});

export const CATEGORIES: CatalogueCategory[] = RAW_CATEGORIES.map(buildCategory);
