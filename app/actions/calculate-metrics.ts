"use server";

import { metricsInputSchema } from "@/app/lib/validation";
import { calculateTF, calculateTG } from "@/app/lib/calculations";
import {
  DEFAULT_COEFFICIENT_STANDARD,
  getCoefficientValue,
  type CoefficientStandard,
} from "@/app/lib/coefficients";

const DEFAULT_COEFFICIENT = 1_000_000; // Standard Européen (pour compatibilité)

export interface CalculateMetricsInput {
  hoursWorked: number;
  accidentsCount: number;
  daysLost: number;
  coefficient?: CoefficientStandard;
}

export interface CalculateMetricsResult {
  success: boolean;
  tf?: number;
  tg?: number;
  error?: string;
}

/**
 * Server Action pour calculer les indicateurs TF/TG
 * Valide les entrées avec Zod et retourne les résultats
 */
export async function actionCalculateMetrics(
  input: CalculateMetricsInput
): Promise<CalculateMetricsResult> {
  try {
    // Validation avec Zod
    const validationResult = metricsInputSchema.safeParse(input);

    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0];
      return {
        success: false,
        error: firstError.message,
      };
    }

    const { hoursWorked, accidentsCount, daysLost } = validationResult.data;

    // Déterminer le coefficient à utiliser
    const coefficientStandard =
      input.coefficient || DEFAULT_COEFFICIENT_STANDARD;
    const coefficient = getCoefficientValue(coefficientStandard);

    // Calcul des indicateurs
    const tf = calculateTF(accidentsCount, hoursWorked, coefficient);
    const tg = calculateTG(daysLost, hoursWorked, coefficient);

    return {
      success: true,
      tf,
      tg,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Une erreur inattendue s'est produite lors du calcul",
    };
  }
}
