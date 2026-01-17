"use server";

import { metricsInputSchema } from "@/app/lib/validation";
import { calculateTF, calculateTG } from "@/app/lib/calculations";

export interface CalculateMetricsInput {
  hoursWorked: number;
  accidentsCount: number;
  daysLost: number;
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

    // Calcul des indicateurs (Standard Européen fixe)
    const tf = calculateTF(accidentsCount, hoursWorked);
    const tg = calculateTG(daysLost, hoursWorked);

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
