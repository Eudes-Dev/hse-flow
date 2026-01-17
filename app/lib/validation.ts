import { z } from "zod";

export const metricsInputSchema = z.object({
  hoursWorked: z
    .number()
    .int("Les heures travaillées doivent être un nombre entier")
    .min(1, "Les heures travaillées doivent être supérieures à 0")
    .max(10000000, "Les heures travaillées ne peuvent pas dépasser 10,000,000"),
  accidentsCount: z
    .number()
    .int("Le nombre d'accidents doit être un nombre entier")
    .min(0, "Le nombre d'accidents ne peut pas être négatif")
    .max(1000000, "Le nombre d'accidents ne peut pas dépasser 1,000,000"),
  daysLost: z
    .number()
    .int("Les jours perdus doivent être un nombre entier")
    .min(0, "Les jours perdus ne peuvent pas être négatifs")
    .max(1000000, "Les jours perdus ne peuvent pas dépasser 1,000,000"),
});

export type MetricsInput = z.infer<typeof metricsInputSchema>;
