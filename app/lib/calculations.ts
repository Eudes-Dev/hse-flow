import { metricsInputSchema, type MetricsInput } from "./validation";

export interface CalculationResult {
  tf: number | null;
  tg: number | null;
  error?: string;
}

/**
 * Calcule le Taux de Fréquence (TF)
 * TF = (Nombre d'accidents avec arrêt / Heures travaillées) × 1 000 000
 * Standard Européen (fixe)
 */
export function calculateTF(
  accidentsCount: number,
  hoursWorked: number
): number {
  if (hoursWorked === 0) {
    throw new Error(
      "Les heures travaillées doivent être supérieures à 0 pour calculer les indicateurs"
    );
  }

  // TF utilise toujours 1 000 000 comme coefficient (Standard Européen)
  const tfCoefficient = 1_000_000;
  const result = (accidentsCount / hoursWorked) * tfCoefficient;

  // Vérification d'overflow
  if (!Number.isFinite(result)) {
    throw new Error("Erreur de calcul : résultat trop grand (overflow)");
  }

  return result;
}

/**
 * Calcule le Taux de Gravité (TG)
 * TG = (Nombre de jours perdus / Heures travaillées) × 1 000
 * Standard Européen (fixe)
 */
export function calculateTG(
  daysLost: number,
  hoursWorked: number
): number {
  if (hoursWorked === 0) {
    throw new Error(
      "Les heures travaillées doivent être supérieures à 0 pour calculer les indicateurs"
    );
  }

  // TG utilise toujours 1 000 comme coefficient (Standard Européen)
  const tgCoefficient = 1_000;
  const result = (daysLost / hoursWorked) * tgCoefficient;

  // Vérification d'overflow
  if (!Number.isFinite(result)) {
    throw new Error("Erreur de calcul : résultat trop grand (overflow)");
  }

  return result;
}

/**
 * Calcule les deux indicateurs TF et TG avec validation
 * Utilise toujours le Standard Européen (fixe)
 */
export function calculateMetrics(
  input: Partial<{
    hoursWorked: string | number;
    accidentsCount: string | number;
    daysLost: string | number;
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
    // Utilise toujours le Standard Européen (fixe)
    const tf = calculateTF(accidentsCount, hoursWorked);
    const tg = calculateTG(daysLost, hoursWorked);

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
