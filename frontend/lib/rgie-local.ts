
/**
 * Thèmes RGIE disponibles.
 * 
 * @remarks
 * Représente les différents thèmes pour lesquels des règles RGIE sont disponibles.
 */

/**
 * Interface étendue pour une règle RGIE avec information sur le thème.
 * 
 * @remarks
 * Ajoute la propriété `theme` à une règle RGIE pour indiquer son appartenance thématique.
 */

/**
 * Datasets RGIE indexés par thème.
 * 
 * @remarks
 * Permet d'accéder aux règles RGIE selon leur thème respectif.
 */

/**
 * Récupère le dataset RGIE pour un thème donné.
 * 
 * @param theme - Le thème RGIE souhaité.
 * @returns Un tableau de règles RGIE correspondant au thème.
 */

/**
 * Récupère toutes les règles RGIE, chaque règle étant annotée avec son thème.
 * 
 * @returns Un tableau de toutes les règles RGIE avec leur thème associé.
 */

/**
 * Recherche les règles RGIE par tag.
 * 
 * @param tag - Le tag à rechercher (insensible à la casse).
 * @returns Un tableau de règles RGIE dont au moins un tag correspond au critère.
 */

/**
 * Recherche les règles RGIE par article.
 * 
 * @param article - L'article à rechercher (insensible à la casse).
 * @returns Un tableau de règles RGIE dont l'article correspond au critère.
 */

/**
 * Récupère le rapport de validation RGIE.
 * 
 * @returns Un tableau d'éléments du rapport de validation RGIE.
 */

/**
 * Récupère le schéma RGIE utilisé par Webelec.
 * 
 * @returns Le schéma RGIE (type inconnu).
 */
import ddr from "@/data/rgie/ddr.json";
import influencesExternes from "@/data/rgie/influences_externes.json";
import installationsExistantes from "@/data/rgie/installations_existantes.json";
import pv from "@/data/rgie/pv.json";
import sdb2025 from "@/data/rgie/sdb_2025.json";
import sections from "@/data/rgie/sections.json";
import surintensites from "@/data/rgie/surintensites.json";
import tableaux from "@/data/rgie/tableaux.json";
import terre from "@/data/rgie/terre.json";
import ve from "@/data/rgie/ve.json";
import validationReport from "@/data/rgie/validation_report.json";
import webelecSchema from "@/data/rgie/webelec_schema.json";
import type { RgieRegle, RgieValidationReportItem } from "@/types";

export type RgieTheme =
  | "ddr"
  | "influences_externes"
  | "installations_existantes"
  | "pv"
  | "sdb_2025"
  | "sections"
  | "surintensites"
  | "tableaux"
  | "terre"
  | "ve";

export interface RgieRegleWithTheme extends RgieRegle {
  theme: RgieTheme;
}

const rgieDatasets: Record<RgieTheme, RgieRegle[]> = {
  ddr,
  influences_externes: influencesExternes,
  installations_existantes: installationsExistantes,
  pv,
  sdb_2025: sdb2025,
  sections,
  surintensites,
  tableaux,
  terre,
  ve
};

export function getRgieDataset(theme: RgieTheme): RgieRegle[] {
  return rgieDatasets[theme];
}

export function getAllRgieRegles(): RgieRegleWithTheme[] {
  const entries: RgieRegleWithTheme[] = [];

  (Object.entries(rgieDatasets) as [RgieTheme, RgieRegle[]][]).forEach(
    ([theme, regles]) => {
      regles.forEach((regle) => {
        entries.push({ ...regle, theme });
      });
    }
  );

  return entries;
}

export function searchRgieByTag(tag: string): RgieRegleWithTheme[] {
  const needle = tag.toLowerCase();

  return getAllRgieRegles().filter((regle) =>
    regle.tags.some((t) => t.toLowerCase().includes(needle))
  );
}

export function searchRgieByArticle(article: string): RgieRegleWithTheme[] {
  const needle = article.toLowerCase();

  return getAllRgieRegles().filter((regle) =>
    regle.rgie.article.toLowerCase().includes(needle)
  );
}

export function getRgieValidationReport(): RgieValidationReportItem[] {
  return validationReport;
}

export function getRgieSchema(): unknown {
  return webelecSchema;
}

