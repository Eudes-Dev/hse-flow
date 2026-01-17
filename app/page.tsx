"use client";

import { useState, useEffect, useCallback } from "react";
import MetricsForm, { type MetricsFormData } from "./components/metrics-form";
import MetricsResults from "./components/metrics-results";
import InstallPwaBanner from "./components/install-pwa-banner";
import { calculateMetrics } from "./lib/calculations";
import { saveMetricsToStorage, loadMetricsFromStorage } from "./lib/storage";
import { actionCalculateMetrics } from "./actions/calculate-metrics";
const DEFAULT_FORM_DATA: MetricsFormData = {
  hoursWorked: "",
  accidentsCount: "",
  daysLost: "",
};

export default function Home() {
  const [formData, setFormData] = useState<MetricsFormData>(DEFAULT_FORM_DATA);
  const [tf, setTf] = useState<number | null>(null);
  const [tg, setTg] = useState<number | null>(null);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isCalculating, setIsCalculating] = useState(false);

  // Restauration des données au chargement
  useEffect(() => {
    const savedData = loadMetricsFromStorage();
    if (savedData) {
      setFormData(savedData);
    }
  }, []);

  // Fonction de calcul avec fallback client-side
  const performCalculation = useCallback(async (data: MetricsFormData) => {
    // Validation : si heures travaillées est vide ou 0, réinitialiser les résultats
    if (
      !data.hoursWorked ||
      data.hoursWorked === "" ||
      Number(data.hoursWorked) === 0
    ) {
      setTf(null);
      setTg(null);
      setError(undefined);
      return;
    }

    const startTime = performance.now();
    setIsCalculating(true);
    setError(undefined);

    try {
      // Tentative d'utilisation du Server Action
      const hoursWorked = Number(data.hoursWorked);
      const accidentsCount = Number(data.accidentsCount || 0);
      const daysLost = Number(data.daysLost || 0);

      let result;

      try {
        // Appel du Server Action (Standard Européen fixe)
        const serverResult = await actionCalculateMetrics({
          hoursWorked,
          accidentsCount,
          daysLost,
        });

        if (
          serverResult.success &&
          serverResult.tf !== undefined &&
          serverResult.tg !== undefined
        ) {
          result = {
            tf: serverResult.tf,
            tg: serverResult.tg,
            error: undefined,
          };
        } else {
          throw new Error(serverResult.error || "Erreur serveur");
        }
      } catch (serverError) {
        // Fallback client-side si le Server Action échoue (mode offline)
        result = calculateMetrics(data);
      }

      // Vérification de la performance (< 100ms)
      const endTime = performance.now();
      const latency = endTime - startTime;
      if (latency > 100) {
        console.warn(`Calcul took ${latency.toFixed(2)}ms (target: <100ms)`);
      }

      setTf(result.tf);
      setTg(result.tg);
      setError(result.error);

      // Sauvegarde automatique
      saveMetricsToStorage(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur inattendue s'est produite"
      );
      setTf(null);
      setTg(null);
    } finally {
      setIsCalculating(false);
    }
  }, []);

  // Calcul en temps réel à chaque modification
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performCalculation(formData);
    }, 50); // Debounce de 50ms pour éviter trop de calculs

    return () => clearTimeout(timeoutId);
  }, [formData, performCalculation]);

  const handleFieldChange = (field: keyof MetricsFormData, value: string) => {
    // Validation basique : empêcher les valeurs négatives pour les champs numériques
    const numValue = Number(value);
    if (value !== "" && (isNaN(numValue) || numValue < 0)) {
      return; // Ignorer la saisie invalide
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Validation des erreurs pour le formulaire
  const formErrors: {
    hoursWorked?: string;
    accidentsCount?: string;
    daysLost?: string;
  } = {};

  if (error) {
    // Si l'erreur concerne les heures travaillées
    if (error.includes("heures travaillées")) {
      formErrors.hoursWorked = error;
    }
  }

  return (
    <main className="min-h-screen p-4 md:p-8 bg-ui-gray">
      <div className="max-w-2xl mx-auto space-y-8 mb-24">
        <header className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-deep-black">
            HSE-Flow
          </h1>
          <p className="text-lg text-deep-black/70">
            Calcul en temps réel du Taux de Fréquence (TF) et du Taux de Gravité
            (TG)
          </p>
        </header>

        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-deep-black mb-6">
            Saisie des données
          </h2>
          <MetricsForm
            values={formData}
            onChange={handleFieldChange}
            errors={formErrors}
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-deep-black mb-6">
            Résultats
          </h2>
          {isCalculating && (
            <p className="text-sm text-deep-black/50 mb-4">
              Calcul en cours...
            </p>
          )}
          <MetricsResults tf={tf} tg={tg} error={error} />
        </div>
      </div>

      <InstallPwaBanner />
    </main>
  );
}
