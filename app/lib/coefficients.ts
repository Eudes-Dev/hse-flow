/**
 * Type représentant le standard de calcul pour les coefficients TF/TG
 */
export type CoefficientStandard = "european" | "osha";

/**
 * Valeurs des coefficients par standard
 */
export const COEFFICIENTS: Record<CoefficientStandard, number> = {
  european: 1_000_000, // Standard Européen
  osha: 200_000, // OSHA (Standard américain)
} as const;

/**
 * Label d'affichage pour chaque standard
 */
export const COEFFICIENT_LABELS: Record<CoefficientStandard, string> = {
  european: "Standard Européen (1,000,000)",
  osha: "OSHA (200,000)",
} as const;

/**
 * Valeur par défaut du coefficient (Standard Européen)
 */
export const DEFAULT_COEFFICIENT_STANDARD: CoefficientStandard = "european";

/**
 * Retourne la valeur numérique du coefficient pour un standard donné
 */
export function getCoefficientValue(standard: CoefficientStandard): number {
  return COEFFICIENTS[standard];
}
