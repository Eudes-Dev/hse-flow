import { metricsInputSchema, type MetricsInput } from "./validation";
import {
  DEFAULT_COEFFICIENT_STANDARD,
  getCoefficientValue,
  type CoefficientStandard,
} from "./coefficients";

const DEFAULT_COEFFICIENT = 1_000_000; // Standard Européen (pour compatibilité)

export interface CalculationResult {
  tf: number | null;
  tg: number | null;
  error?: string;
}

/**
 * Calcule le Taux de Fréquence (TF)
 * TF = (Nombre d'accidents × Coefficient) / Heures travaillées
 */
export function calculateTF(
  accidentsCount: number,
  hoursWorked: number,
  coefficient: number = DEFAULT_COEFFICIENT
): number {
  if (hoursWorked === 0) {
    throw new Error(
      "Les heures travaillées doivent être supérieures à 0 pour calculer les indicateurs"
    );
  }

  const numerator = accidentsCount * coefficient;
  const result = numerator / hoursWorked;

  // Vérification d'overflow
  if (!Number.isFinite(result)) {
    throw new Error("Erreur de calcul : résultat trop grand (overflow)");
  }

  return result;
}

/**
 * Calcule le Taux de Gravité (TG)
 * TG = (Jours perdus × Coefficient) / Heures travaillées
 */
export function calculateTG(
  daysLost: number,
  hoursWorked: number,
  coefficient: number = DEFAULT_COEFFICIENT
): number {
  if (hoursWorked === 0) {
    throw new Error(
      "Les heures travaillées doivent être supérieures à 0 pour calculer les indicateurs"
    );
  }

  const numerator = daysLost * coefficient;
  const result = numerator / hoursWorked;

  // Vérification d'overflow
  if (!Number.isFinite(result)) {
    throw new Error("Erreur de calcul : résultat trop grand (overflow)");
  }

  return result;
}

/**
 * Calcule les deux indicateurs TF et TG avec validation
 */
export function calculateMetrics(
  input: Partial<{
    hoursWorked: string | number;
    accidentsCount: string | number;
    daysLost: string | number;
    coefficient?: CoefficientStandard;
  }>
): CalculationResult {
  // Validation : si un champ requis est vide, ne pas calculer
  if (
    !input.hoursWorked ||
    input.hoursWorked === "" ||
    input.hoursWorked === 0
  ) {
    return {
      tf: null,
      tg: null,
    };
  }

  // Conversion en nombres
  const hoursWorked = Number(input.hoursWorked);
  const accidentsCount = Number(input.accidentsCount || 0);
  const daysLost = Number(input.daysLost || 0);

  // Validation avec Zod
  const validationResult = metricsInputSchema.safeParse({
    hoursWorked,
    accidentsCount,
    daysLost,
  });

  if (!validationResult.success) {
    const firstError = validationResult.error.errors[0];
    return {
      tf: null,
      tg: null,
      error: firstError.message,
    };
  }

  try {
    // Déterminer le coefficient à utiliser
    const coefficientStandard =
      input.coefficient || DEFAULT_COEFFICIENT_STANDARD;
    const coefficient = getCoefficientValue(coefficientStandard);

    const tf = calculateTF(accidentsCount, hoursWorked, coefficient);
    const tg = calculateTG(daysLost, hoursWorked, coefficient);

    return {
      tf,
      tg,
    };
  } catch (error) {
    return {
      tf: null,
      tg: null,
      error:
        error instanceof Error
          ? error.message
          : "Une erreur inattendue s'est produite lors du calcul",
    };
  }
}
