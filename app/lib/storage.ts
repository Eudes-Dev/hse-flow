import type { MetricsFormData } from "@/app/components/metrics-form";
import { DEFAULT_COEFFICIENT_STANDARD, type CoefficientStandard } from "./coefficients";

const STORAGE_KEY = "hse-flow-metrics";

/**
 * Sauvegarde les données de formulaire dans LocalStorage
 */
export function saveMetricsToStorage(data: MetricsFormData): void {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    // Gestion silencieuse des erreurs (LocalStorage indisponible, quota dépassé)
    console.warn("Impossible de sauvegarder dans LocalStorage:", error);
  }
}

/**
 * Récupère les données de formulaire depuis LocalStorage
 * Gère la migration des données existantes (si coefficient absent, utilise "european" par défaut)
 */
export function loadMetricsFromStorage(): MetricsFormData | null {
  try {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const data = JSON.parse(stored) as Partial<MetricsFormData>;
    // Validation basique des données
    if (
      typeof data.hoursWorked === "string" &&
      typeof data.accidentsCount === "string" &&
      typeof data.daysLost === "string"
    ) {
      // Migration : si coefficient absent, utiliser "european" par défaut
      const coefficient: CoefficientStandard =
        data.coefficient && (data.coefficient === "european" || data.coefficient === "osha")
          ? data.coefficient
          : DEFAULT_COEFFICIENT_STANDARD;

      return {
        hoursWorked: data.hoursWorked,
        accidentsCount: data.accidentsCount,
        daysLost: data.daysLost,
        coefficient,
      };
    }
    return null;
  } catch (error) {
    console.warn("Impossible de charger depuis LocalStorage:", error);
    return null;
  }
}

/**
 * Supprime les données sauvegardées dans LocalStorage
 */
export function clearMetricsStorage(): void {
  try {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn("Impossible de supprimer LocalStorage:", error);
  }
}
