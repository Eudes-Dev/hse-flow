import {
  saveMetricsToStorage,
  loadMetricsFromStorage,
  clearMetricsStorage,
} from "../storage";
import type { MetricsFormData } from "@/app/components/metrics-form";
import { DEFAULT_COEFFICIENT_STANDARD } from "../coefficients";

describe("LocalStorage", () => {
  beforeEach(() => {
    // Nettoyer LocalStorage avant chaque test
    localStorage.clear();
  });

  afterEach(() => {
    // Nettoyer après chaque test
    localStorage.clear();
  });

  describe("saveMetricsToStorage", () => {
    it("devrait sauvegarder les données dans LocalStorage", () => {
      const data: MetricsFormData = {
        hoursWorked: "1000000",
        accidentsCount: "5",
        daysLost: "10",
        coefficient: "european",
      };

      saveMetricsToStorage(data);

      const stored = localStorage.getItem("hse-flow-metrics");
      expect(stored).not.toBeNull();
      if (stored) {
        const parsed = JSON.parse(stored);
        expect(parsed).toEqual(data);
      }
    });

    it("devrait écraser les données existantes", () => {
      const data1: MetricsFormData = {
        hoursWorked: "1000000",
        accidentsCount: "5",
        daysLost: "10",
        coefficient: "european",
      };
      const data2: MetricsFormData = {
        hoursWorked: "2000000",
        accidentsCount: "10",
        daysLost: "20",
        coefficient: "european",
      };

      saveMetricsToStorage(data1);
      saveMetricsToStorage(data2);

      const loaded = loadMetricsFromStorage();
      expect(loaded).toEqual(data2);
    });

    it("ne devrait pas lancer d'erreur si LocalStorage est indisponible", () => {
      // Simuler l'indisponibilité de LocalStorage
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = jest.fn(() => {
        throw new Error("QuotaExceededError");
      });

      const data: MetricsFormData = {
        hoursWorked: "1000000",
        accidentsCount: "5",
        daysLost: "10",
        coefficient: "european",
      };

      expect(() => saveMetricsToStorage(data)).not.toThrow();

      Storage.prototype.setItem = originalSetItem;
    });
  });

  describe("loadMetricsFromStorage", () => {
    it("devrait charger les données depuis LocalStorage", () => {
      const data: MetricsFormData = {
        hoursWorked: "1000000",
        accidentsCount: "5",
        daysLost: "10",
        coefficient: "european",
      };

      localStorage.setItem("hse-flow-metrics", JSON.stringify(data));

      const loaded = loadMetricsFromStorage();
      expect(loaded).toEqual(data);
    });

    it("devrait retourner null si aucune donnée n'est sauvegardée", () => {
      const loaded = loadMetricsFromStorage();
      expect(loaded).toBeNull();
    });

    it("devrait retourner null si les données sont corrompues", () => {
      localStorage.setItem("hse-flow-metrics", "invalid json");

      const loaded = loadMetricsFromStorage();
      expect(loaded).toBeNull();
    });

    it("devrait retourner null si les données ne correspondent pas au format attendu", () => {
      localStorage.setItem(
        "hse-flow-metrics",
        JSON.stringify({ invalid: "data" })
      );

      const loaded = loadMetricsFromStorage();
      expect(loaded).toBeNull();
    });

    it("ne devrait pas lancer d'erreur si LocalStorage est indisponible", () => {
      // Simuler l'indisponibilité de LocalStorage
      const originalGetItem = Storage.prototype.getItem;
      Storage.prototype.getItem = jest.fn(() => {
        throw new Error("SecurityError");
      });

      expect(() => loadMetricsFromStorage()).not.toThrow();
      expect(loadMetricsFromStorage()).toBeNull();

      Storage.prototype.getItem = originalGetItem;
    });
  });

  describe("clearMetricsStorage", () => {
    it("devrait supprimer les données de LocalStorage", () => {
      const data: MetricsFormData = {
        hoursWorked: "1000000",
        accidentsCount: "5",
        daysLost: "10",
        coefficient: "european",
      };

      saveMetricsToStorage(data);
      expect(loadMetricsFromStorage()).not.toBeNull();

      clearMetricsStorage();
      expect(loadMetricsFromStorage()).toBeNull();
    });

    it("ne devrait pas lancer d'erreur si LocalStorage est vide", () => {
      expect(() => clearMetricsStorage()).not.toThrow();
    });

    it("ne devrait pas lancer d'erreur si LocalStorage est indisponible", () => {
      const originalRemoveItem = Storage.prototype.removeItem;
      Storage.prototype.removeItem = jest.fn(() => {
        throw new Error("SecurityError");
      });

      expect(() => clearMetricsStorage()).not.toThrow();

      Storage.prototype.removeItem = originalRemoveItem;
    });
  });

  describe("Intégration", () => {
    it("devrait permettre de sauvegarder, charger et supprimer les données", () => {
      const data: MetricsFormData = {
        hoursWorked: "1000000",
        accidentsCount: "5",
        daysLost: "10",
        coefficient: "european",
      };

      // Sauvegarde
      saveMetricsToStorage(data);
      expect(loadMetricsFromStorage()).toEqual(data);

      // Modification
      const modifiedData: MetricsFormData = {
        hoursWorked: "2000000",
        accidentsCount: "10",
        daysLost: "20",
        coefficient: "osha",
      };
      saveMetricsToStorage(modifiedData);
      expect(loadMetricsFromStorage()).toEqual(modifiedData);

      // Suppression
      clearMetricsStorage();
      expect(loadMetricsFromStorage()).toBeNull();
    });
  });

  describe("Migration du coefficient", () => {
    it("devrait utiliser 'european' par défaut si le coefficient est absent", () => {
      // Données anciennes sans coefficient (story 1.1)
      const oldData = {
        hoursWorked: "1000000",
        accidentsCount: "5",
        daysLost: "10",
      };
      localStorage.setItem("hse-flow-metrics", JSON.stringify(oldData));

      const loaded = loadMetricsFromStorage();
      expect(loaded).not.toBeNull();
      if (loaded) {
        expect(loaded.coefficient).toBe(DEFAULT_COEFFICIENT_STANDARD);
        expect(loaded.hoursWorked).toBe("1000000");
        expect(loaded.accidentsCount).toBe("5");
        expect(loaded.daysLost).toBe("10");
      }
    });

    it("devrait sauvegarder et restaurer le coefficient", () => {
      const data: MetricsFormData = {
        hoursWorked: "1000000",
        accidentsCount: "5",
        daysLost: "10",
        coefficient: "osha",
      };

      saveMetricsToStorage(data);
      const loaded = loadMetricsFromStorage();
      expect(loaded).toEqual(data);
      expect(loaded?.coefficient).toBe("osha");
    });

    it("devrait restaurer 'european' si le coefficient sauvegardé est invalide", () => {
      // Données avec coefficient invalide
      const invalidData = {
        hoursWorked: "1000000",
        accidentsCount: "5",
        daysLost: "10",
        coefficient: "invalid",
      };
      localStorage.setItem("hse-flow-metrics", JSON.stringify(invalidData));

      const loaded = loadMetricsFromStorage();
      expect(loaded).not.toBeNull();
      if (loaded) {
        expect(loaded.coefficient).toBe(DEFAULT_COEFFICIENT_STANDARD);
      }
    });
  });
});
