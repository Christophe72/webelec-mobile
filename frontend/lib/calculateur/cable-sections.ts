/**
 * Sections de câbles normalisées (en mm²)
 * Selon les normes électriques usuelles
 */
export const CABLE_SECTIONS = [
  0.75,
  1,
  1.5,
  2.5,
  4,
  6,
  10,
  16,
  25,
  35,
  50,
  70,
  95,
  120,
  150,
  185,
  240,
  300,
] as const;

export type CableSection = typeof CABLE_SECTIONS[number];
