import type { MetricsFormData } from "@/app/components/metrics-form";

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
 * Gère la migration des données existantes (ignore le coefficient s'il existe)
 */
export function loadMetricsFromStorage(): MetricsFormData | null {
  try {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const data = JSON.parse(stored) as Partial<MetricsFormData & { coefficient?: unknown }>;
    // Validation basique des données
    if (
      typeof data.hoursWorked === "string" &&
      typeof data.accidentsCount === "string" &&
      typeof data.daysLost === "string"
    ) {
      // Migration : ignorer le coefficient s'il existe (Standard Européen fixe)
      return {
        hoursWorked: data.hoursWorked,
        accidentsCount: data.accidentsCount,
        daysLost: data.daysLost,
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
